import { memo, useState } from 'react';
import '../../../assets/scss/onboarding/index.scss';

const aboutVe = `Hi! Welcome to VEAI, you can give me access to everything from your Slack, Google Drive files, Calendar, Notion documents, and Salesforce. I'll help you get answers from data you don't have the time or energy to go through, help find connections between points in multiple different documents, record and summarize meetings you join (or the ones you skip).`;
const progressStep = Array.from({ length: 4 }, (_, index) => index + 1);

const Onboarding = () => {
	const [info, setInfo] = useState({
		progressStep: 1, // total 4 steps
	});

	return (
		<div className="onboardingContainer">
			<main className="mainContent">
				<section className="leftSection">
					<div className="progressBar">
						{progressStep?.map((step) => (
							<div
								className={`progressStep ${
									info?.progressStep === step ? 'active' : ''
								}`}
								key={step}
							></div>
						))}
					</div>
					<header className="header">
						<h1 className="title">Let's get started</h1>
						<h2 className="subtitle">Personalize your experience</h2>
					</header>
				</section>
				<section className="rightSection">
					<p className="title">{aboutVe}</p>
				</section>
			</main>
		</div>
	);
};

export default memo(Onboarding);
