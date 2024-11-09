import React, { memo, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/onboarding/index.scss';
import Username from '../../components/onboarding/Username';
import WorkspaceHandleName from '../../components/onboarding/WorkspaceHandleName';
import { useRef } from 'react';
import WorkspaceType from '../../components/onboarding/WorkspaceType';
import Profession from '../../components/onboarding/Profession';
import { updateUserDetails, createWorkspace } from '../../../services/authServices/authServices';
import { message } from 'antd';
import CreatingNewWorkspace from '../../components/onboarding/CreatingNewWorkspace';

const tl = gsap.timeline();
const tl2 = gsap.timeline();

const Onboarding = () => {
	const [info, setInfo] = useState({
		stage: 0,
		step: 0,
		username: '',
		workspaceHandle: '',
		isWorkspaceHandleAvailable: false,
		workspaceType: '',
		profession: '',
		phoneNumber: '',
		isOnboard: false,
	});

	const navigate = useNavigate();

	const aiIntroRef = useRef(null);
	const step1Ref = useRef(null);
	const step2Ref = useRef(null);
	const step4Ref = useRef(null);
	const step5Ref = useRef(null);
	const step6Ref = useRef(null);
	const step7Ref = useRef(null);

	useEffect(() => {
		if (!localStorage?.getItem('usertoken')) {
			navigate('/');
		} else if (localStorage?.getItem('isOnboard')) {
			navigate('/home');
		}
	}, []);

	useEffect(() => {
		if (info?.step === 0 && aiIntroRef?.current) {
			animateAiIntro();
		} else if (info?.step === 1 && aiIntroRef?.current) {
			animateRightContainer();
		} else if (info?.step === 2 && aiIntroRef?.current) {
			animateStep2Enter();
		} else if (info?.step === 3 && aiIntroRef?.current) {
			animateStep3Enter();
		} else if (info?.step === 4 && aiIntroRef?.current) {
			animateStep4Enter();
		} else if (info?.step === 5 && aiIntroRef?.current) {
			animateStep5Enter();
		} else if (info?.step === 6 && aiIntroRef?.current) {
			// animateStep6Enter();
		} else if (info?.step === 7 && aiIntroRef?.current) {
			handleOnboarding();
			// animateStep7Enter();
		}
	}, [info?.step, aiIntroRef?.current]);

	const handleOnboarding = async () => {
		const userDetailsResponse = await updateUserDetails(info?.username);
		if (userDetailsResponse?.ok) {
			const workspaceResponse = await createWorkspace(
				info?.workspaceHandle,
				info?.workspaceType,
				info?.profession,
			);
			if (workspaceResponse?.ok) {
				setInfo((prev) => ({
					...prev,
					step: prev?.step + 1,
					isOnboard: workspaceResponse?.isOnboard,
				}));
				localStorage.setItem('isOnboard', workspaceResponse?.isOnboard);
				handleNavigate();
			} else {
				message.error(workspaceResponse?.message);
			}
		} else {
			message.error(userDetailsResponse?.message);
		}
	};

	const handleNavigate = () => {
		const route = localStorage.getItem('isOnboard') ? '/home' : '/early-access';
		navigate(route);
	};

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

	const animateStep1Exit = () => {
		tl.to(step1Ref?.current, {
			zoom: 0.5,
			color: 'rgba(255, 255, 255, 0.1)',
			opacity: 0,
			duration: 1,
			ease: 'power2.out',
			onComplete: () => {
				setInfo((prev) => ({
					...prev,
					step: prev?.step + 1,
				}));
			},
		});
	};

	const animateStep2Enter = () => {
		tl2?.fromTo(
			step2Ref?.current,
			{
				y: 20,
				zoom: 0.5,
				color: 'rgba(255, 255, 255, 0.1)',
				opacity: 0,
			},
			{
				y: 0,
				zoom: 1,
				color: 'white',
				opacity: 1,
				duration: 1,
				delay: 1,
				ease: 'power2.out',
			},
		);
		tl2?.to(step2Ref?.current, {
			opacity: 0,
			duration: 1,
			ease: 'power2.out',
			delay: 1,
			onComplete: () => {
				setInfo((prev) => ({
					...prev,
					step: prev?.step + 1,
				}));
			},
		});
	};

	const animateStep3Enter = () => {
		tl2?.fromTo(
			aiIntroRef?.current,
			{
				y: 20,
				zoom: 0.5,
				opacity: 0,
			},
			{
				y: 0,
				zoom: 1,
				opacity: 1,
				duration: 1,
				delay: 1,
				ease: 'power2.out',
				onComplete: () => {
					setInfo((prev) => ({
						...prev,
						stage: prev?.stage + 1,
					}));
				},
			},
		);
	};

	const animateStep4Enter = () => {
		tl2?.fromTo(
			aiIntroRef?.current,
			{
				y: 20,
				zoom: 0.5,
				opacity: 0,
			},
			{
				y: 0,
				zoom: 1,
				opacity: 1,
				duration: 1,
				delay: 1,
				ease: 'power2.out',
				onComplete: () => {
					tl2?.to(step4Ref?.current, {
						opacity: 0,
						duration: 1,
						ease: 'power2.out',
					});
					setInfo((prev) => ({
						...prev,
						step: prev?.step + 1,
						stage: prev?.stage + 1,
					}));
				},
			},
		);
	};

	const animateStep5Enter = () => {
		tl2?.fromTo(
			step5Ref?.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 1, delay: 1, ease: 'power2.out' },
		);
	};

	const AiIntro = {
		0: (
			<>
				<h1>Hi! I am VE</h1>
				<h2>Your AI companion</h2>
			</>
		),
		1: <h1 ref={step1Ref}>What can I call you ?</h1>,
		2: <h1 ref={step2Ref}>Hey {info?.username}, nice to meet you.</h1>,
		3: (
			<div style={{ position: 'relative' }}>
				<h1>Let's setup your workspace handle</h1>
				<h2>{info?.workspaceHandle || 'workspacename'}.ve.ai</h2>
				{info?.workspaceHandle?.length > 1 && (
					<span
						style={{
							position: 'absolute',
							bottom: 0,
							left: '34px',
							fontSize: '12px',
							color: info?.isWorkspaceHandleAvailable
								? 'rgb(152, 255, 152)'
								: 'rgb(255, 111, 97)',
						}}
					>
						{info?.isWorkspaceHandleAvailable
							? 'This handle is available'
							: 'This handle is already taken'}
					</span>
				)}
			</div>
		),
		4: <h1 ref={step4Ref}>{info?.workspaceHandle}.ve.ai</h1>,
		5: <h1 ref={step5Ref}>What will be the workspace type ?</h1>,
		6: <h1 ref={step6Ref}>What is your profession ?</h1>,
		7: <h1 ref={step7Ref}>Setting up your workspace</h1>,
	};

	const onboardingStages = {
		1: (
			<Username
				onboardingInfo={info}
				setOnboardingInfo={setInfo}
				animateStep1Exit={animateStep1Exit}
			/>
		),
		2: (
			<WorkspaceHandleName
				onboardingInfo={info}
				setOnboardingInfo={setInfo}
				animateStep4Enter={animateStep4Enter}
			/>
		),
		3: <WorkspaceType setOnboardingInfo={setInfo} />,
		4: <Profession onboardingInfo={info} setOnboardingInfo={setInfo} />,
		5: <CreatingNewWorkspace profession={info?.profession} />,
	};

	return (
		<div className="onboarding-container">
			<div className="left-container">
				<div ref={aiIntroRef} className="ai-intro">
					{AiIntro[info?.step]}
					{onboardingStages[info?.stage]}
				</div>
			</div>
			{info?.step >= 1 && (
				<div className="right-container">
					<div className="right-container-content"></div>
				</div>
			)}
		</div>
	);
};

export default memo(Onboarding);
