import React, { useState, useEffect } from 'react';
import Stages from '../../components/onboarding/Stages';
import StepIntro from './StepIntro';
import StepKnowEachOther from './StepKnowEachOther';
import StepGoalsMission from './StepGoalsMission';
import PricingPage from '../pricingPlans/pricingPage';
import ProgressBar from '../../components/onboarding/ProgressBar';
import LiveIntelligence from './LiveIntelligence';

const initialData = {
	userWorkspaceDetails: {},
	knowEachOther: {},
	goals: {},
};

const OnboardingStepper = ({ onStepChange }) => {
	const [step, setStep] = useState(() => {
		// Initialize step from localStorage, default to 1 if not found
		const savedStep = localStorage.getItem('onboardingStep');
		return savedStep ? parseInt(savedStep, 10) : 1;
	});
	const [data, setData] = useState(initialData);

	useEffect(() => {
		// Save step to localStorage whenever it changes
		localStorage.setItem('onboardingStep', step);
		onStepChange?.(step);
		// Clear localStorage when onboarding is complete (step 5 or beyond)
		if (step > 5) {
			localStorage.removeItem('onboardingStep');
		}
	}, [step, onStepChange]);

	const handleNext = (stepData) => {
		setData((prev) => ({ ...prev, ...stepData }));
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	let content;
	let showProgressBar = false;
	let progress = 0;

	switch (step) {
		case 1:
			content = (
				<Stages onNext={(stepData) => handleNext({ userWorkspaceDetails: stepData })} />
			);
			break;
		case 2:
			content = <StepIntro onNext={() => setStep(3)} onBack={handleBack} />;
			break;
		case 3:
			content = <LiveIntelligence onNext={() => setStep(4)} onBack={handleBack} />;
			break;
		// case 3:
		// 	showProgressBar = true;
		// 	progress = 0.5;
		// 	content = (
		// 		<StepKnowEachOther
		// 			data={data.knowEachOther}
		// 			onNext={(stepData) => handleNext({ knowEachOther: stepData })}
		// 			onBack={handleBack}
		// 		/>
		// 	);
		// 	break;
		// case 4:
		// 	showProgressBar = true;
		// 	progress = 1;
		// 	content = (
		// 		<StepGoalsMission
		// 			data={data.goals}
		// 			onNext={(stepData) => handleNext({ goals: stepData })}
		// 			onBack={handleBack}
		// 		/>
		// 	);
		// 	break;
		case 4:
			content = <PricingPage />;
			break;
		default:
			content = <div>Onboarding Complete!</div>;
			// Clear localStorage when onboarding is complete
			localStorage.removeItem('onboardingStep');
	}

	return (
		<>
			{/* {showProgressBar && <ProgressBar progress={progress} />} */}
			{content}
		</>
	);
};

export default OnboardingStepper;
