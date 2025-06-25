import { memo } from 'react';
import '../../../assets/scss/onboarding/index.scss';

const ProgressBar = ({ progress, currentStep, totalSteps }) => {
	let percent = 0;
	if (typeof progress === 'number') {
		percent = Math.max(0, Math.min(progress * 100, 100));
	} else if (
		typeof currentStep === 'number' &&
		typeof totalSteps === 'number' &&
		totalSteps > 0
	) {
		percent = Math.max(0, Math.min((currentStep / totalSteps) * 100, 100));
	}
	return (
		<div className="onboardingLinearProgressBar">
			<div
				className="onboardingLinearProgressBar-fill"
				style={{ width: `${percent}%` }}
			></div>
		</div>
	);
};

export default memo(ProgressBar);
