import { memo } from 'react';
import '../../../assets/scss/onboarding/index.scss';

const ProgressBar = ({ stage, pathname }) => {
	const progressStepLength = pathname === '/create-workspace' ? 1 : 2;
	const progressSteps = Array.from(
		{ length: progressStepLength },
		(_, index) => index + (pathname === '/create-workspace' ? 2 : 1),
	);

	return (
		<div className="progressBar">
			{progressSteps?.map((step) => (
				<div className={`progressStep ${stage === step ? 'active' : ''}`} key={step}></div>
			))}
		</div>
	);
};

export default memo(ProgressBar);
