import React, { memo, useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/onboarding/index.scss';
import Username from '../../components/onboarding/Username';
import WorkspaceHandleName from '../../components/onboarding/WorkspaceHandleName';
import { useRef } from 'react';
import WorkspaceType from '../../components/onboarding/WorkspaceType';
import Profession from '../../components/onboarding/Profession';
import Context from '../../../context/context';
import { message } from 'antd';
import CreatingNewWorkspace from '../../components/onboarding/CreatingNewWorkspace';
import { getLocationsDetails } from '../../../helpers';

const tl = gsap.timeline();
const tl2 = gsap.timeline();

const Onboarding = () => {
	const {
		authInfo: { updateUserDetails, createWorkspace, createAccountViaInvite },
	} = useContext(Context);

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
		businessName: '',
	});

	const navigate = useNavigate();
	const location = useLocation();

	const aiIntroRef = useRef(null);
	const step1Ref = useRef(null);
	const step2Ref = useRef(null);
	const step4Ref = useRef(null);
	const step5Ref = useRef(null);
	const step6Ref = useRef(null);
	const step7Ref = useRef(null);

	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');
	const createWorkspaceUsername = params?.get('username');

	useEffect(() => {
		if (invitedWorkspaceId && invitedUserEmail) {
			localStorage.clear();
			return;
		}
		if (!localStorage?.getItem('usertoken')) {
			navigate('/');
		}
		if (localStorage?.getItem('isOnboard') === 'true' && !createWorkspaceUsername) {
			navigate('/home');
		}
	}, []);

	useEffect(() => {
		if (info?.step === 1 && info?.stage === 1) {
			if (createWorkspaceUsername) {
				setInfo((prev) => ({
					...prev,
					username: createWorkspaceUsername,
				}));
			}
		}
	}, [info?.step, info?.stage]);

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
			animateStep6Enter();
		} else if (info?.step === 7 && aiIntroRef?.current) {
			animateStep7Enter();
		}
	}, [info?.step, aiIntroRef?.current]);

	const handleInvitedUser = async () => {
		const locationDetails = await getLocationsDetails();
		const response = await createAccountViaInvite(
			info?.username,
			invitedUserEmail,
			invitedWorkspaceId,
			locationDetails,
		);
		if (response?.[0] === true) {
			navigate('/home');
		} else {
			message.error(response?.message);
			navigate('/');
		}
	};

	const handleOnboarding = async () => {
		const userDetailsResponse = await updateUserDetails(info?.username);
		if (userDetailsResponse[0] === true) {
			const workspaceResponse = await createWorkspace(
				info?.workspaceHandle,
				info?.workspaceType,
				info?.profession,
				info?.businessName,
			);
			if (workspaceResponse[0] === true) {
				if (workspaceResponse?.[1]?.isOnboard) {
					navigate('/home');
				} else {
					navigate('/early-access');
				}
			} else {
				message.error(workspaceResponse?.message);
			}
		} else {
			message.error(userDetailsResponse?.message);
		}
	};

	const setUsername = (username) => {
		setInfo((prev) => ({
			...prev,
			username,
		}));
	};

	const setWorkspaceHandleAndBusinessName = (workspaceHandle) => {
		setInfo((prev) => ({
			...prev,
			workspaceHandle,
			businessName: workspaceHandle,
		}));
	};

	const setIsWorkspaceHandleAvailable = (isWorkspaceHandleAvailable) => {
		setInfo((prev) => ({
			...prev,
			isWorkspaceHandleAvailable,
		}));
	};

	const setWorkspaceType = (workspaceType) => {
		setInfo((prev) => ({
			...prev,
			workspaceType,
		}));
	};

	const setProfession = (profession) => {
		setInfo((prev) => ({
			...prev,
			profession,
		}));
	};

	const incrementStep = () => {
		setInfo((prev) => ({
			...prev,
			step: prev?.step + 1,
		}));
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
					tl2?.to(aiIntroRef?.current, {
						opacity: 1,
						duration: 1,
						ease: 'power2.out',
					});
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
			},
		);
		tl2?.to(aiIntroRef?.current, {
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

	const animateStep5Enter = () => {
		tl2?.to(aiIntroRef?.current, {
			opacity: 1,
			duration: 0.5,
			ease: 'power2.out',
		});
		tl2?.fromTo(
			step5Ref?.current,
			{
				opacity: 0,
				zoom: 0.5,
			},
			{
				opacity: 1,
				zoom: 1,
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

	const animateStep6Enter = () => {
		tl2?.fromTo(
			step6Ref?.current,
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
				onComplete: () => {
					setInfo((prev) => ({
						...prev,
						stage: prev?.stage + 1,
					}));
				},
			},
		);
	};

	const animateStep7Enter = () => {
		tl2.to(step6Ref?.current, {
			opacity: 0,
			duration: 1,
			ease: 'power2.out',
		});
		tl2?.fromTo(
			aiIntroRef?.current,
			{
				opacity: 0,
				zoom: 0.5,
			},
			{
				opacity: 1,
				zoom: 1,
				duration: 1,
				ease: 'power2.out',
				onComplete: () => {
					const timeout = setTimeout(() => {
						handleOnboarding();
					}, 500);
					return () => clearTimeout(timeout);
				},
			},
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
				username={info?.username}
				setUsername={setUsername}
				animateStep1Exit={animateStep1Exit}
				handleInvitedUser={handleInvitedUser}
				createAccountViaInvite={invitedWorkspaceId && invitedUserEmail}
				createWorkspaceUsername={createWorkspaceUsername}
			/>
		),
		2: (
			<WorkspaceHandleName
				workspaceHandle={info?.workspaceHandle}
				isWorkspaceHandleAvailable={info?.isWorkspaceHandleAvailable}
				setWorkspaceHandleAndBusinessName={setWorkspaceHandleAndBusinessName}
				setIsWorkspaceHandleAvailable={setIsWorkspaceHandleAvailable}
				incrementStep={incrementStep}
				animateStep4Enter={animateStep4Enter}
			/>
		),
		3: <WorkspaceType setWorkspaceType={setWorkspaceType} incrementStep={incrementStep} />,
		4: (
			<Profession
				workspaceType={info?.workspaceType}
				setProfession={setProfession}
				incrementStep={incrementStep}
				step6Ref={step6Ref}
			/>
		),
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
