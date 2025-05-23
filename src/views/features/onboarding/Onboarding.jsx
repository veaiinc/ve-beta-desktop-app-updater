import { memo, useContext, useEffect } from 'react';
import '../../../assets/scss/onboarding/index.scss';
import Stages from '../../components/onboarding/Stages';
import { ReactComponent as DarkModeGradient } from '../../../assets/svg/onboarding/dark-mode-gradient.svg';
import { ReactComponent as LightModeGradient } from '../../../assets/svg/onboarding/light-mode-gradient.svg';
import Context from '../../../context/context';

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

	const isDarkMode =
		theme === 'systemDefault'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: theme === 'dark';

	useEffect(() => {
		const selector = '.mainContent';
		animateFadeIn(selector);
	}, []);

	return (
		<div className="onboardingContainer">
			<div className="gradientContainer">
				{isDarkMode ? <DarkModeGradient /> : <LightModeGradient />}
			</div>
			<main className="mainContent">
				<section className="leftSection">
					<Stages />
				</section>
				<section className="rightSection">
					<p className="aboutVe">{aboutVe}</p>
				</section>
			</main>
		</div>
	);
};

export default memo(Onboarding);
