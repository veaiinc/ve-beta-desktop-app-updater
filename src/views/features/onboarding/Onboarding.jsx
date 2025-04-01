import { memo, useEffect } from 'react';
import '../../../assets/scss/onboarding/index.scss';
import Stages from '../../components/onboarding/Stages';

const aboutVe = `Hi! Welcome to VEAI, you can give me access to everything from your Slack, Google Drive files, Calendar, Notion documents, and Salesforce. I'll help you get answers from data you don't have the time or energy to go through, help find connections between points in multiple different documents, record and summarize meetings you join (or the ones you skip).`;
export const animateFadeIn = (selector) => {
	const element = document.querySelector(selector);
	if (element) {
		element.style.opacity = '1';
	}
};

const Onboarding = () => {
	useEffect(() => {
		const selector = '.mainContent';
		animateFadeIn(selector);
	}, []);

	return (
		<div className="onboardingContainer">
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
