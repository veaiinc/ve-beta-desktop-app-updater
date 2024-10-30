import React, { memo, useState, useEffect } from 'react';
import gsap from 'gsap';
import '../../../assets/scss/onboarding/index.scss';
import Username from '../../components/onboarding/Username';

const AiIntro = {
	0: (
		<div className="message-1">
			<h1>Hi! I am VE</h1>
			<h2>Your AI companion</h2>
		</div>
	),
	1: (
		<div className="message-2">
			<h1>What can I call you ?</h1>
		</div>
	),
};

const tl = gsap?.timeline();

const animateAiIntro = () => {
	tl?.fromTo(
		'.ai-intro',
		{
			zoom: 2,
			opacity: 0,
			y: 20,
		},
		{
			zoom: 1,
			opacity: 1,
			y: 0,
			duration: 2,
			ease: 'power2.out',
			delay: 0.5,
		},
	);
};

const animateUsernameInput = () => {
	tl?.fromTo('.username-input-container', { opacity: 0 }, { opacity: 1, duration: 1 });
	tl?.from('.username-input-container', { bottom: 0, duration: 1 });
};

const Onboarding = () => {
	const [info, setInfo] = useState({
		step: 0,
	});

	useEffect(() => {
		if (info?.step === 0) {
			animateAiIntro();
			setInfo((prev) => ({ ...prev, step: prev.step + 1 }));
		} else if (info?.step === 1) {
			// animateUsernameInput();
		}
	}, [info?.step]);

	const onboardingSteps = {
		1: <Username />,
	};

	return (
		<div className="onboarding-container">
			<div className="left-container">
				<div className="ai-intro">
					{AiIntro[info?.step]}
					{onboardingSteps[info?.step]}
				</div>
			</div>
			{info?.step === 1 && (
				<div className="right-container">
					<div className="right-container-content"></div>
				</div>
			)}
		</div>
	);
};

export default memo(Onboarding);
