import React, { useContext, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import '../../../assets/scss/onboarding/stepGoalsMission.scss';
import ProgressBar from '../../components/onboarding/ProgressBar';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';

const goalsData = [
	{
		icon: '📈',
		title: 'Audience Growth',
		description: "Expand HiveMind's reach and attract the right audience across platforms.",
		tags: ['SEO strategy', 'social engagement', 'newsletter opt-ins'],
	},
	{
		icon: '🪄',
		title: 'Content Systems',
		description:
			'Build repeatable workflows to create, schedule, and repurpose content efficiently.',
		tags: ['Editorial calendar', 'repurposing engine', 'automation'],
	},
	{
		icon: '🤝',
		title: 'Creator Partnerships',
		description: 'Find and collaborate with aligned voices to boost reach and credibility.',
		tags: ['Cross-promos', 'guest content', 'podcast swaps'],
	},
];

const StepGoalsMission = ({ data = {}, onNext, onBack }) => {
	const navigate = useNavigate();
	const {
		aiSetup: { updateAiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		selectedGoals: data.selectedGoals || [],
		otherGoals: data.otherGoals || '',
		loading: false,
	});

	const updateState = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleGoalSelection = (goalIndex) => {
		const isSelected = info.selectedGoals.includes(goalIndex);
		if (isSelected) {
			updateState({
				selectedGoals: info.selectedGoals.filter((index) => index !== goalIndex),
			});
		} else {
			updateState({
				selectedGoals: [...info.selectedGoals, goalIndex],
			});
		}
	};

	const handleOtherGoalsChange = (e) => {
		updateState({ otherGoals: e.target.value });
	};

	const handleContinue = async () => {
		updateState({ loading: true });

		try {
			// Save selected goals as one combined entry
			if (info.selectedGoals.length > 0) {
				const selectedGoalsContent = info.selectedGoals
					.map((goalIndex) => {
						const goal = goalsData[goalIndex];
						return `${goal.title}\n\n${goal.description}\n\nTags: ${goal.tags.join(
							', ',
						)}`;
					})
					.join('\n\n---\n\n');

				const goalResponse = await updateAiSetupData(
					{
						type: 'goal',
						heading: 'I want to achieve these goals',
						description: selectedGoalsContent,
					},
					false,
				); // false for user data, not workspace

				if (!goalResponse?.[0]) {
					message?.error('Failed to save selected goals');
					updateState({ loading: false });
					return;
				}
			}

			// Save other goals if provided (separate API call)
			if (info.otherGoals.trim()) {
				const otherGoalsResponse = await updateAiSetupData(
					{
						type: 'goal',
						heading: 'Other goals',
						description: info.otherGoals,
					},
					false,
				); // false for user data, not workspace

				if (!otherGoalsResponse?.[0]) {
					message?.error('Failed to save other goals');
					updateState({ loading: false });
					return;
				}
			}

			// If all API calls are successful, proceed
			if (info.selectedGoals.length > 0 || info.otherGoals.trim()) {
				message?.success('Goals saved successfully');
			}

			onNext({
				selectedGoals: info.selectedGoals,
				otherGoals: info.otherGoals,
			});
		} catch (error) {
			console.error('Error saving goals:', error);
			message?.error('Failed to save goals. Please try again.');
		} finally {
			updateState({ loading: false });
		}
	};

	return (
		<div className="goalsMissionStepContainer">
			<div className="stepHeader">
				<div className="stepProgressContainer">
					<ProgressBar currentStep={4} totalSteps={4} />
					<div className="stepProgress">Step 2 of 2</div>
				</div>
				<h1 className="stepTitle">What do you want to achieve?</h1>
				<p className="stepDesc">Select the goals that matters most to right now.</p>
			</div>
			<div className="goalsCardsContainer">
				{goalsData.map((goal, idx) => (
					<div
						className={`goalCard ${info.selectedGoals.includes(idx) ? 'selected' : ''}`}
						key={idx}
						onClick={() => handleGoalSelection(idx)}
						style={{
							cursor: 'pointer',
							border: info.selectedGoals.includes(idx)
								? '2px solid var(--primary-button)'
								: '1px solid var(--stroke)',
							background: info.selectedGoals.includes(idx)
								? 'var(--card-over-card)'
								: 'var(--card)',
						}}
					>
						<div className="goalCardContent">
							<div className="goalIcon">{goal.icon}</div>
							<div className="goalTitle">{goal.title}</div>
						</div>
						<div className="goalDesc">{goal.description}</div>
						<div className="goalTags">
							{goal.tags.map((tag, i) => (
								<span className="goalTag" key={i}>
									{tag}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="formRow">
				<label className="formLabel">Other goals? Tell us more:</label>
				<textarea
					className="formInput"
					value={info.otherGoals}
					onChange={handleOtherGoalsChange}
					placeholder="Describe any other specific goals or challenge you'd like help with"
				/>
			</div>
			<div className="btnsContainer">
				<button className="backBtn" onClick={onBack}>
					Back
				</button>
				<button
					className="continueBtn"
					onClick={handleContinue}
					disabled={info.loading}
					style={{
						opacity: info.loading ? 0.4 : 1,
						cursor: info.loading ? 'not-allowed' : 'pointer',
					}}
				>
					{info.loading ? 'Saving...' : 'Continue'}
				</button>
			</div>
		</div>
	);
};

export default StepGoalsMission;
