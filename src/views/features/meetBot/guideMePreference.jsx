import { memo, useState, useEffect, useContext } from 'react';
import './guideMePopup.scss';
import { Switch } from 'antd';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';

const GuideMePreference = ({ mode, onUpdatePreferences }) => {
	const {
		notes: { getMeetingPreferences },
	} = useContext(Context);
	const [loading, setLoading] = useState(true);
	const [info, setInfo] = useState({
		thresholdValue: 0,
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
			setInfo((prev) => ({
				...prev,
				thresholdValue: preferences.threshold || 0,
				enabledFeatures: {
					smartQuestions: preferences.askUser || false,
					instantAnswers: preferences.needHelp || false,
					actionSuggestions: preferences.actions || false,
					contextFilePulls: preferences.similarFiles || false,
				},
			}));
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
					setInfo((prev) => ({
						...prev,
						thresholdValue: currentPreferences.threshold || 0,
						enabledFeatures: {
							smartQuestions: currentPreferences.askUser || false,
							instantAnswers: currentPreferences.needHelp || false,
							actionSuggestions: currentPreferences.actions || false,
							contextFilePulls: currentPreferences.similarFiles || false,
						},
					}));
				}
			}
		} catch (error) {
			console.error('Error fetching meeting preferences:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleThresholdChange = (value) => {
		setInfo((prev) => ({
			...prev,
			thresholdValue: value,
		}));
	};

	const handleFeatureToggle = (feature, checked) => {
		setInfo((prev) => ({
			...prev,
			enabledFeatures: {
				...prev.enabledFeatures,
				[feature]: checked,
			},
		}));
	};

	// Expose current preferences to parent component
	useEffect(() => {
		if (onUpdatePreferences) {
			onUpdatePreferences({
				thresholdValue: info.thresholdValue,
				enabledFeatures: info.enabledFeatures,
				allPreferences: info.allPreferences,
				meetingType,
			});
		}
	}, [
		info.thresholdValue,
		info.enabledFeatures,
		info.allPreferences,
		meetingType,
		onUpdatePreferences,
	]);

	// Calculate the percentage for the slider background
	const sliderPercentage = (info.thresholdValue / 10) * 100;

	if (loading) {
		return (
			<div className="guideMePreference">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="guideMePreference">
			<div className="guideMePreferenceHeader">
				<div className="guideMePreferenceTitle">Response Intensity Threshold</div>
				<div className="guideMePreferenceDescription">
					<div className="thresholdDescription">
						<div className="thresholdOption">
							<div className="thresholdHeading">Low Threshold:</div>
							<div className="thresholdSubtext">
								You'll see a wider range of suggestions, Ideal for brainstorming or
								discovery — shows all types of input.
							</div>
						</div>
						<div className="thresholdOption">
							<div className="thresholdHeading">High Threshold:</div>
							<div className="thresholdSubtext">
								Only top-priority actions and insights will appear best for focused,
								high-impact meetings.
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="thresholdSliderContainer">
				<div className="customSlider">
					<input
						type="range"
						min="0"
						max="10"
						value={info.thresholdValue}
						onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
						className="thresholdSlider"
						style={{
							background:
								info.thresholdValue === 0
									? '#2c2d2e'
									: `linear-gradient(to right, #79ecc9 0%, #79ecc9 ${sliderPercentage}%, #2c2d2e ${sliderPercentage}%, #2c2d2e 100%)`,
							marginLeft: '12px',
						}}
					/>
					<div
						className="sliderThumb"
						style={{
							left: `${sliderPercentage}%`,
							transform: 'translateX(-50%)',
						}}
					>
						{info.thresholdValue}
					</div>
				</div>
			</div>

			<div className="guideMePreferenceBody">
				<div className="guideMePreferenceBodyItem">
					<div className="guideMePreferenceBodyItemHeader">
						<div className="guideMePreferenceBodyItemHeaderTitle">
							Smart Questions (Ask user)
						</div>
						<Switch
							checked={info.enabledFeatures.smartQuestions}
							onChange={(checked) => handleFeatureToggle('smartQuestions', checked)}
						/>
					</div>
				</div>

				<div className="guideMePreferenceBodyItem">
					<div className="guideMePreferenceBodyItemHeader">
						<div className="guideMePreferenceBodyItemHeaderTitle">
							Instant Answers (Need help)
						</div>
						<Switch
							checked={info.enabledFeatures.instantAnswers}
							onChange={(checked) => handleFeatureToggle('instantAnswers', checked)}
						/>
					</div>
				</div>

				<div className="guideMePreferenceBodyItem">
					<div className="guideMePreferenceBodyItemHeader">
						<div className="guideMePreferenceBodyItemHeaderTitle">
							Action Suggestions
						</div>
						<Switch
							checked={info.enabledFeatures.actionSuggestions}
							onChange={(checked) =>
								handleFeatureToggle('actionSuggestions', checked)
							}
						/>
					</div>
				</div>

				<div className="guideMePreferenceBodyItem">
					<div className="guideMePreferenceBodyItemHeader">
						<div className="guideMePreferenceBodyItemHeaderTitle">
							Context File Pulls
						</div>
						<Switch
							checked={info.enabledFeatures.contextFilePulls}
							onChange={(checked) => handleFeatureToggle('contextFilePulls', checked)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GuideMePreference);
