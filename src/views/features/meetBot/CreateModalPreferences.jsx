import { Slider, Switch } from 'antd';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import './CreateModalPreferences.scss';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';

const stepsHint = {
	2: 'Broader suggestions for brainstorming, including low-signal but useful insights.',
	4: 'Blend of broad ideas and focused suggestions — ideal for exploratory mode with some signal control.',
	6: 'Shows only high-relevance ideas based on recent discussion momentum.',
	8: 'Stricter suggestions for clear, focused direction.',
	10: 'Only top-priority insights shown—ideal for focused, high-impact meetings.',
};

const CreateModalPreferences = ({ mode = 'Meeting', onUpdatePreferences }) => {
	const {
		notes: { getMeetingPreferences, updateMeetingPreferences },
	} = useContext(Context);

	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [sliderValue, setSliderValue] = useState(2);
	const [info, setInfo] = useState({
		thresholdValue: 8,
		enabledFeatures: {
			smartQuestions: true,
			instantAnswers: true,
			actionSuggestions: true,
			contextFilePulls: true,
		},
		allPreferences: {},
	});

	// Map mode to API meeting type
	const getMeetingTypeFromMode = (mode) => {
		const modeMap = {
			'Sales Mode': 'sales',
			Support: 'support',
			Interviewer: 'interview',
			Ideas: 'ideas',
			Meeting: 'meeting',
		};
		return modeMap[mode] || 'meeting';
	};

	const meetingType = getMeetingTypeFromMode(mode);

	// Fetch initial preferences when component mounts
	useEffect(() => {
		fetchMeetingPreferences();
	}, []);

	// Update local state when mode changes
	useEffect(() => {
		if (info.allPreferences[meetingType]) {
			const preferences = info.allPreferences[meetingType];
			const thresholdValue = preferences.threshold || 8;
			setInfo((prev) => ({
				...prev,
				thresholdValue: thresholdValue,
				enabledFeatures: {
					smartQuestions: preferences.askUser || false,
					instantAnswers: preferences.needHelp || false,
					actionSuggestions: preferences.actions || false,
					contextFilePulls: preferences.similarFiles || false,
				},
			}));
			setSliderValue(thresholdValue);
		}
	}, [meetingType, info.allPreferences]);

	const fetchMeetingPreferences = async () => {
		try {
			setLoading(true);
			const response = await getMeetingPreferences();

			if (response?.meetingPreference) {
				setInfo((prev) => ({
					...prev,
					allPreferences: response.meetingPreference,
				}));

				// Set current meeting type preferences
				const currentPreferences = response.meetingPreference[meetingType];
				if (currentPreferences) {
					const thresholdValue = currentPreferences.threshold || 8;
					setInfo((prev) => ({
						...prev,
						thresholdValue: thresholdValue,
						enabledFeatures: {
							smartQuestions: currentPreferences.askUser || false,
							instantAnswers: currentPreferences.needHelp || false,
							actionSuggestions: currentPreferences.actions || false,
							contextFilePulls: currentPreferences.similarFiles || false,
						},
					}));
					setSliderValue(thresholdValue);
				}
			}
		} catch (error) {
			console.error('Error fetching meeting preferences:', error);
		} finally {
			setLoading(false);
		}
	};

	const updatePreferencesAPI = async (updatedInfo) => {
		try {
			setUpdating(true);
			const { thresholdValue, enabledFeatures, allPreferences } = updatedInfo;

			// Update the current meeting type preferences in allPreferences
			const updatedAllPreferences = {
				...allPreferences,
				[meetingType]: {
					threshold: thresholdValue,
					askUser: enabledFeatures.smartQuestions,
					needHelp: enabledFeatures.instantAnswers,
					actions: enabledFeatures.actionSuggestions,
					similarFiles: enabledFeatures.contextFilePulls,
				},
			};

			const payload = {
				preferenceType: 'meetingPreference',
				data: updatedAllPreferences,
			};

			const response = await updateMeetingPreferences(payload);
			if (response) {
				message.success('Meeting preferences updated successfully');
			}
		} catch (error) {
			console.error('Error updating meeting preferences:', error);
			message.error('Failed to update preferences');
		} finally {
			setUpdating(false);
		}
	};

	// Debounced API update function
	const debouncedUpdate = useCallback(
		async (value) => {
			const updatedInfo = {
				...info,
				thresholdValue: value,
			};
			setInfo(updatedInfo);

			// Update API
			await updatePreferencesAPI(updatedInfo);

			// Also pass to parent if callback exists
			if (onUpdatePreferences) {
				onUpdatePreferences({
					thresholdValue: value,
					enabledFeatures: info.enabledFeatures,
					allPreferences: info.allPreferences,
					meetingType,
				});
			}
		},
		[info, onUpdatePreferences, meetingType],
	);

	const handleThresholdChange = (value) => {
		// Update UI immediately
		setSliderValue(value);
	};

	const handleThresholdChangeComplete = (value) => {
		// Update API when user finishes dragging
		debouncedUpdate(value);
	};

	const handleFeatureToggle = async (feature, checked) => {
		const updatedInfo = {
			...info,
			enabledFeatures: {
				...info.enabledFeatures,
				[feature]: checked,
			},
		};
		setInfo(updatedInfo);

		// Update API immediately
		await updatePreferencesAPI(updatedInfo);

		// Also pass to parent if callback exists
		if (onUpdatePreferences) {
			onUpdatePreferences({
				thresholdValue: info.thresholdValue,
				enabledFeatures: updatedInfo.enabledFeatures,
				allPreferences: info.allPreferences,
				meetingType,
			});
		}
	};

	// Expose current preferences to parent component (for initial load)
	useEffect(() => {
		if (onUpdatePreferences && !loading) {
			onUpdatePreferences({
				thresholdValue: info.thresholdValue,
				enabledFeatures: info.enabledFeatures,
				allPreferences: info.allPreferences,
				meetingType,
			});
		}
	}, [loading, onUpdatePreferences]);

	if (loading) {
		return (
			<div className="preferences-container">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="preferences-container">
			<div className="preferences-header">
				<button className="preferences-tab-button active">Preferences</button>
			</div>
			<div className="preferences-body">
				<div className="preferences-options-wrapper">
					<div className="preferences-option">
						<div className="preferences-text">
							Smart Questions (Suggestions for follow-up questions)
						</div>
						<Switch
							className="ambient-toggler"
							checked={info.enabledFeatures.smartQuestions}
							onChange={(checked) => handleFeatureToggle('smartQuestions', checked)}
							disabled={updating}
						/>
					</div>
					<div className="preferences-option">
						<div className="preferences-text">
							Instant Answers (Get insights, follow-ups, or next steps instantly)
						</div>
						<Switch
							className="ambient-toggler"
							checked={info.enabledFeatures.instantAnswers}
							onChange={(checked) => handleFeatureToggle('instantAnswers', checked)}
							disabled={updating}
						/>
					</div>
					<div className="preferences-option">
						<div className="preferences-text">Action Suggestions</div>
						<Switch
							className="ambient-toggler"
							checked={info.enabledFeatures.actionSuggestions}
							onChange={(checked) =>
								handleFeatureToggle('actionSuggestions', checked)
							}
							disabled={updating}
						/>
					</div>
					{/* <div className="preferences-option">
						<div className="preferences-text">Get File according to Context</div>
						<Switch
							className="ambient-toggler"
							checked={info.enabledFeatures.contextFilePulls}
							onChange={(checked) => handleFeatureToggle('contextFilePulls', checked)}
							disabled={updating}
						/>
					</div> */}
				</div>
				{/* <div className="preference-threshold">
					<div className="threshold-title">Response Intensity Threshold</div>
					<Slider
						min={2}
						max={10}
						step={2}
						value={sliderValue}
						onChange={handleThresholdChange}
						onChangeComplete={handleThresholdChangeComplete}
						disabled={updating}
						marks={{
							0: '',
							2: '',
							4: '',
							6: '',
							8: '',
							10: '',
						}}
					/>
					<div className="threshold-subtext">
						<span className="threshold-subtext-icon">i</span>
						<div className="threshold-subtext-content">{stepsHint[sliderValue]}</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default CreateModalPreferences;
