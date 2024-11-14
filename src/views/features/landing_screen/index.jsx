import React from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';

const LandingPage = () => {
	return (
		<div className="landing-page-container">
			<ul className="nav-container">
				<li>
					<VeAiLogo />
				</li>
				<li>
					<button className="login-button">Log in</button>
				</li>
			</ul>
		</div>
	);
};

export default LandingPage;
