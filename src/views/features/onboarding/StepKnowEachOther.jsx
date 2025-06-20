import React, { useContext, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import '../../../assets/scss/onboarding/stepKnowEachOther.scss';
import ProgressBar from '../../components/onboarding/ProgressBar';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';

const StepKnowEachOther = ({ data = {}, onNext, onBack }) => {
	const {
		aiSetup: { updateAiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		role: data.role || '',
		company: data.company || '',
		workspaceName: data.workspaceName || '',
		additionalGoals: data.additionalGoals || '',
		linkedin: data.linkedin || '',
		loading: false,
	});

	const updateState = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleChange = (e) => {
		updateState({ [e.target.name]: e.target.value });
	};

	const continueDisabled = !info.role || !info.company || !info.workspaceName;

	const handleContinue = async () => {
		if (continueDisabled) return;

		updateState({ loading: true });

		try {
			// Save "What's should we focus on together?" as goal type
			if (info.additionalGoals) {
				const goalResponse = await updateAiSetupData(
					{
						type: 'goal',
						heading: "What's should we focus on together?",
						description: info.additionalGoals,
					},
					false,
				); // false for user data, not workspace

				if (!goalResponse?.[0]) {
					message?.error('Failed to save focus goals');
					updateState({ loading: false });
					return;
				}
			}

			// Save LinkedIn as focus type
			if (info.linkedin) {
				const focusResponse = await updateAiSetupData(
					{
						type: 'focus',
						heading: 'LinkedIn',
						description: info.linkedin,
					},
					false,
				); // false for user data, not workspace

				if (!focusResponse?.[0]) {
					message?.error('Failed to save LinkedIn information');
					updateState({ loading: false });
					return;
				}
			}

			// If both API calls are successful or if no data to save, proceed
			message?.success('Information saved successfully');
			onNext({
				role: info.role,
				company: info.company,
				workspaceName: info.workspaceName,
				additionalGoals: info.additionalGoals,
				linkedin: info.linkedin,
			});
		} catch (error) {
			console.error('Error saving onboarding data:', error);
			message?.error('Failed to save information. Please try again.');
		} finally {
			updateState({ loading: false });
		}
	};

	return (
		<div className="knowEachOtherStepContainer">
			<div className="stepHeader">
				<div className="stepProgressContainer">
					<ProgressBar currentStep={3} totalSteps={4} />
					<div className="stepProgress">Step 1 of 2</div>
				</div>
				<div className="stepHeaderContent">
					<h1 className="stepTitle">Let's get to know each other</h1>
					<p className="stepDesc">
						The more I understand your role and goals, the better I can prioritize,
						remember, and act on your behalf like a partner who never drops the thread.
					</p>
				</div>
			</div>
			<div className="stepForm">
				<div className="inlineSentenceInputs">
					<span className="inlineLabel">I'm</span>
					<input
						className="inlineInput"
						name="role"
						value={info.role}
						onChange={handleChange}
						placeholder="solo creator"
						autoComplete="off"
					/>
					<span className="inlineLabel">At</span>
					<input
						className="inlineInput"
						name="company"
						value={info.company}
						onChange={handleChange}
						placeholder="a media brand"
						autoComplete="off"
					/>
					<span className="inlineLabel">Called</span>
					<input
						className="inlineInput"
						name="workspaceName"
						value={info.workspaceName}
						onChange={handleChange}
						placeholder="HiveMind"
						autoComplete="off"
					/>
				</div>
				<div className="formRow">
					<label className="formLabel">What's should we focus on together?</label>
					<textarea
						className="formInput"
						name="additionalGoals"
						value={info.additionalGoals}
						onChange={handleChange}
						placeholder="Tell me your goals so I can remember and help you get there"
					/>
				</div>
				<div className="formRow">
					<label className="formLabel">
						LinkedIn? <span className="optional">(optional)</span>
					</label>
					<input
						className="formInput"
						name="linkedin"
						value={info.linkedin}
						onChange={handleChange}
						placeholder="linkedin.com/in/yourname"
					/>
				</div>
			</div>
			<div className="btnsContainer">
				<button className="backBtn" onClick={onBack}>
					Back
				</button>
				<button
					className="continueBtn"
					onClick={handleContinue}
					disabled={continueDisabled || info.loading}
					style={{
						opacity: continueDisabled || info.loading ? 0.4 : 1,
						cursor: continueDisabled || info.loading ? 'not-allowed' : 'pointer',
					}}
				>
					{info.loading ? 'Saving...' : "Alright, What's The Mission?"}
				</button>
			</div>
		</div>
	);
};

export default StepKnowEachOther;
