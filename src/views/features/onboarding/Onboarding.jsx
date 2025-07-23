import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/index.scss';
import OnboardingStepper from './OnboardingStepper';
import { ReactComponent as DarkModeGradient } from '../../../assets/svg/onboarding/dark-mode-gradient.svg';
import { ReactComponent as LightModeGradient } from '../../../assets/svg/onboarding/light-mode-gradient.svg';
import Context from '../../../context/context';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import LoginDescription from '../../components/login_page/LoginDescription';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import useLogout from '../../../hooks/useLogout';

const aboutVe = `Hi! Welcome to VEAI, you can give me access to everything from your Slack, Google Drive files, Calendar, Notion documents, and Salesforce. I'll help you get answers from data you don't have the time or energy to go through, help find connections between points in multiple different documents, record and summarize meetings you join (or the ones you skip).`;

export const animateFadeIn = (selector) => {
	const element = document.querySelector(selector);
	if (element) {
		element.style.opacity = '1';
	}
};

const Onboarding = () => {
	const {
		themeInfo: { theme },
	} = useContext(Context);
	const logoutFunc = useLogout();
	const [currentStep, setCurrentStep] = useState(1);

	const isDarkMode =
		theme === 'systemDefault'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: theme === 'dark';
	const handleLogout = () => {
		logoutFunc();
	};

	useEffect(() => {
		const selector = '.mainContent';
		animateFadeIn(selector);
	}, []);

	return (
		<div className={`onboardingContainer`}>
			<div className="onboarding-header">
				<div className="logo">
					<VeLogo />
				</div>
				<div className="logout-btn" onClick={handleLogout}>
					<LogoutRedSvg />
				</div>
			</div>
			<div className="onboarding-main">
				<div className="main-content-container" style={{ padding: '180px 20px 0 120px;' }}>
					<div className="email-section">
						<div className="stages-container">
							<OnboardingStepper onStepChange={setCurrentStep} />
						</div>
					</div>
					{/* <div className="description-section">
						<LoginDescription />
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default memo(Onboarding);
