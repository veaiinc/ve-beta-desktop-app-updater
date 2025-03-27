import { memo } from 'react';
import '../../../assets/scss/onboarding/index.scss';

const progressSteps = Array.from({ length: 4 }, (_, index) => index + 1);

const ProgressBar = ({ stage }) => {
	return (
		<div className="progressBar">
			{progressSteps?.map((step) => (
				<div className={`progressStep ${stage === step ? 'active' : ''}`} key={step}></div>
			))}
		</div>
	);
};

export default memo(ProgressBar);
