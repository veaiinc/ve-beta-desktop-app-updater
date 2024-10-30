import React, { memo, useState, useEffect } from 'react';
import gsap from 'gsap';
import '../../../assets/scss/onboarding/index.scss';
import Username from '../../components/onboarding/Username';
import WorkspaceHandleName from '../../components/onboarding/WorkspaceHandleName';
import { useRef } from 'react';

const tl = gsap.timeline();
const tl2 = gsap.timeline();

const Onboarding = () => {
	const [info, setInfo] = useState({
		stage: 0,
		step: 0,
		username: '',
	});

	const aiIntroRef = useRef(null);

	const AiIntro = {
		0: (
			<>
				<h1>Hi! I am VE</h1>
				<h2>Your AI companion</h2>
			</>
		),
		1: <h1>What can I call you ?</h1>,
	};

	const onboardingStages = {
		1: <Username onboardingInfo={info} setOnboardingInfo={setInfo} />,
		2: <WorkspaceHandleName />,
	};

	useEffect(() => {
		if (info?.step === 0 && aiIntroRef?.current) {
			animateAiIntro();
		} else if (info?.step === 1 && aiIntroRef?.current) {
			animateRightContainer();
		} else if (info?.step === 2 && aiIntroRef?.current) {
			animateUsername();
		}
	}, [info?.step, aiIntroRef?.current]);

	const animateAiIntro = () => {
		tl?.fromTo(
			aiIntroRef?.current,
			{
				zoom: 2,
				opacity: 0,
			},
			{
				zoom: 1,
				opacity: 1,
				duration: 1,
				ease: 'power2.out',
				delay: 1,
			},
		);
		tl?.to(aiIntroRef?.current, {
			opacity: 0,
			duration: 1,
			ease: 'power2.out',
			delay: 1,
			onComplete: () => {
				setTimeout(() => {
					setInfo((prev) => ({
						...prev,
						step: prev?.step + 1,
						stage: prev?.stage + 1,
					}));
				}, 500);
			},
		});
	};

	const animateRightContainer = () => {
		tl.fromTo(
			[aiIntroRef?.current],
			{
				opacity: 0,
				y: 20,
			},
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out',
			},
		);
		tl2.fromTo(
			'.right-container-content',
			{
				zoom: 0,
			},
			{
				zoom: 1,
				duration: 1,
				ease: 'power2.out',
			},
		);
	};

	const animateUsername = () => {
		tl.fromTo(
			aiIntroRef?.current,
			{
				y: 0,
			},
			{
				y: -20,
				duration: 1,
				ease: 'power2.out',
			},
		);
	};

	return (
		<div className="onboarding-container">
			<div className="left-container">
				<div ref={aiIntroRef} className="ai-intro">
					{AiIntro[info?.step]}
					{onboardingStages[info?.stage]}
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
