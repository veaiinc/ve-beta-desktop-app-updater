import React, { useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import '../../../assets/scss/onboarding/stepGoalsMission.scss';
import ProgressBar from '../../components/onboarding/ProgressBar';

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
	const [otherGoals, setOtherGoals] = useState(data.otherGoals || '');

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
					<div className="goalCard" key={idx}>
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
					value={otherGoals}
					onChange={(e) => setOtherGoals(e.target.value)}
					placeholder="Describe any other specific goals or challenge you'd like help with"
				/>
			</div>
			<div className="btnsContainer">
				<button className="backBtn" onClick={onBack}>
					Back
				</button>
				<button
					className="continueBtn"
					onClick={() => onNext({ otherGoals })}
					style={{ opacity: 1, cursor: 'pointer' }}
				>
					Continue
				</button>
			</div>
		</div>
	);
};

export default StepGoalsMission;
