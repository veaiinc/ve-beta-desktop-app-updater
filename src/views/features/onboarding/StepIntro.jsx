// import React from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import '../../../assets/scss/onboarding/stepIntro.scss';

const StepIntro = ({ onNext }) => {
	return (
		<div className="introStepContainer">
			<div className="introContent">
				<div className="introBadge">Ambient AI</div>
				<h1 className="introTitle">
					We remember. We act.
					<br />
					We evolve with you
				</h1>
				<p className="introDesc">
					Ambient AI learns your pattern, anticipates your needs, and takes action before
					you even realise you need it.
				</p>
			</div>
			<button className="continueBtn" onClick={onNext}>
				Start Ambient Experience
			</button>
		</div>
	);
};

export default StepIntro;
