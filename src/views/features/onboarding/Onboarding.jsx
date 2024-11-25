import React, { memo, useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/onboarding/index.scss';
import Username from '../../components/onboarding/Username';
import WorkspaceHandleName from '../../components/onboarding/WorkspaceHandleName';
import WorkspaceType from '../../components/onboarding/WorkspaceType';
import Profession from '../../components/onboarding/Profession';
import Context from '../../../context/context';
import { message } from 'antd';
import CreatingNewWorkspace from '../../components/onboarding/CreatingNewWorkspace';
import { ReactComponent as GreenTick } from '../../../assets/svg/onboarding/green-tick.svg';

const tl1 = gsap.timeline();
const tl2 = gsap.timeline();

const Onboarding = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');
	const createWorkspaceUsername = params?.get('username');
	const progressBar = createWorkspaceUsername
		? [{ id: 1 }, { id: 2 }, { id: 3 }]
		: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

	const {
		authInfo: { updateUserDetails, createWorkspace, createAccountViaInvite },
	} = useContext(Context);

	const [info, setInfo] = useState({
		stage: createWorkspaceUsername ? 2 : 1,
		step: createWorkspaceUsername ? 2 : 1,
		username: createWorkspaceUsername || '',
		workspaceHandle: '',
		isWorkspaceHandleAvailable: false,
		isCheckingWorkspaceHandle: true,
		workspaceType: '',
		profession: '',
		phoneNumber: '',
		isOnboard: false,
		businessName: '',
	});

	useEffect(() => {
		if (!localStorage?.getItem('usertoken')) {
			navigate('/');
		}
		if (
			localStorage?.getItem('isOnboard') === 'true' &&
			!createWorkspaceUsername &&
			!invitedWorkspaceId &&
			!invitedUserEmail
		) {
			navigate('/home');
		}
		createWorkspaceUsername ? animateAiIntroForExistingUser() : animateAiIntro();
	}, []);

	useEffect(() => {
		if (info?.step === 2) {
			if (!createWorkspaceUsername) {
				animateStep2EnterAndExit();
			}
		}
		if (info?.step === 3) {
			animateStep3Enter();
		}
		if (info?.step === 4) {
			animateStep4Enter();
		}
		if (info?.step === 5) {
			animateStep5Enter();
		}
		if (info?.step === 6) {
			animateStep6Enter();
		}
	}, [info?.step]);

	useEffect(() => {
		if (info?.stage === 2) {
			animateStage2Enter();
		}
		if (info?.stage === 3) {
			animateStage3Enter();
		}
		if (info?.stage === 4) {
			animateStage4Enter();
		}
	}, [info?.stage]);

	const handleInvitedUserUsername = async () => {
		const userDetailsResponse = await updateUserDetails(info?.username);
		if (userDetailsResponse[0] === true) {
			navigate('/home');
		} else {
			message.error(userDetailsResponse?.message);
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

	const setIsCheckingWorkspaceHandle = (isCheckingWorkspaceHandle) => {
		setInfo((prev) => ({
			...prev,
			isCheckingWorkspaceHandle,
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

	const incrementStage = () => {
		setInfo((prev) => ({
			...prev,
			stage: prev?.stage + 1,
		}));
	};

	// Animations
	const animateAiIntro = () => {
		tl1.fromTo(
			'.onboarding-container',
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		)
			.fromTo(
				'.step1',
				{
					opacity: 0,
					y: 30,
				},
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power2.inOut',
				},
				'+=0',
			)
			.fromTo(
				'.stage1',
				{
					opacity: 0,
					bottom: 0,
					scale: 1.5,
				},
				{
					opacity: 1,
					bottom: 120,
					scale: 1,
					duration: 1,
					ease: 'power2.inOut',
				},
				'<',
			)
			.fromTo(
				'.right-container',
				{
					opacity: 0,
					scale: 1.5,
				},
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power2.inOut',
				},
				'<',
			)
			.fromTo(
				'.right-container-content',
				{
					opacity: 0,
					scale: 0.1,
				},
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power2.inOut',
				},
				'<',
			)
			.from('.progress-bar-container', {
				top: -10,
			});
	};

	const animateAiIntroForExistingUser = () => {
		tl1.fromTo(
			'.onboarding-container',
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		).fromTo(
			'.step2',
			{
				opacity: 0,
				y: 30,
			},
			{
				opacity: 1,
				y: 0,
				duration: 2,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStep();
				},
			},
			'+=0',
		);
	};

	const animateStage1AndStep1Exit = () => {
		tl1.to('.stage1', {
			opacity: 0,
			duration: 1,
			ease: 'power2.inOut',
		});
		tl2.to('.step1', {
			opacity: 0,
			x: -120,
			y: -30,
			scale: 0.5,
			duration: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				incrementStep();
			},
		});
	};

	const animateStage2AndStep3Exit = () => {
		tl1.to('.stage2', {
			opacity: 0,
			duration: 1,
			ease: 'power2.inOut',
		});
		tl2.to('.step3', {
			opacity: 0,
			x: -120,
			y: -30,
			scale: 0.5,
			duration: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				incrementStep();
			},
		});
	};

	const animateStage3AndStep4Exit = () => {
		tl1.to('.stage3 .workspace-type-option', {
			opacity: 0,
			duration: 1,
			cursor: 'default',
			ease: 'power2.inOut',
		});
		tl2.to('.step4', {
			opacity: 0,
			x: -120,
			y: -30,
			scale: 0.5,
			duration: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				incrementStep();
			},
		});
	};

	const animateStep2EnterAndExit = () => {
		tl2.fromTo(
			'.step2',
			{
				opacity: 0,
				x: -120,
				y: -30,
				scale: 0.5,
			},
			{
				opacity: 1,
				x: 0,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		).to('.step2', {
			opacity: 0,
			x: -120,
			y: -30,
			scale: 0.5,
			duration: 1,
			delay: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				incrementStep();
			},
		});
	};

	const animateStep5AndStage4Exit = () => {
		tl1.to('.step5', {
			opacity: 0,
			x: -120,
			y: -30,
			scale: 0.5,
		});
		tl2.to('.stage4 .profession-option', {
			opacity: 0,
			duration: 1,
			cursor: 'default',
			ease: 'power2.inOut',
			onComplete: () => {
				incrementStep();
			},
		});
	};

	const animateStage2Enter = () => {
		if (createWorkspaceUsername) {
			tl2?.to('.stage2', {
				opacity: 0,
				bottom: 0,
				scale: 1.5,
			});
			return;
		}
		tl2?.fromTo(
			'.stage2',
			{
				opacity: 0,
				bottom: 0,
				scale: 1.5,
			},
			{
				opacity: 1,
				bottom: 120,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		);
	};

	const animateStage2EnterForExistingUser = () => {
		tl2?.to('.stage2', {
			opacity: 1,
			bottom: 120,
			scale: 1,
		});
	};

	const animateStage3Enter = () => {
		tl2?.fromTo(
			'.stage3',
			{
				opacity: 0,
				scale: 0.5,
			},
			{
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		);
	};

	const animateStage4Enter = () => {
		tl2?.fromTo(
			'.stage4',
			{
				opacity: 0,
				scale: 0.5,
			},
			{
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		);
	};

	const animateStep3Enter = () => {
		tl2?.fromTo(
			'.step3',
			{
				opacity: 0,
				y: 30,
			},
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					if (!createWorkspaceUsername) {
						incrementStage(); // stage 2
					} else {
						animateStage2EnterForExistingUser();
					}
				},
			},
		);
	};

	const animateStep4Enter = () => {
		tl2?.fromTo(
			'.step4',
			{
				opacity: 0,
				x: -120,
				y: -30,
				scale: 0.5,
			},
			{
				opacity: 1,
				x: 0,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStage(); // stage 3
				},
			},
		);
	};

	const animateStep5Enter = () => {
		tl2?.fromTo(
			'.step5',
			{
				opacity: 0,
				x: -120,
				y: -30,
				scale: 0.5,
			},
			{
				opacity: 1,
				x: 0,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStage(); // stage 4
				},
			},
		);
	};

	const animateStep6Enter = () => {
		tl2?.fromTo(
			'.step6',
			{
				opacity: 0,
				scale: 0.5,
			},
			{
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					handleOnboarding();
				},
			},
		);
	};

	const AiIntro = {
		1: (
			<h1 className="step1">
				<>
					Hey there,
					<br />
					What can I call you ?
				</>
			</h1>
		),
		2: (
			<h2 className="step2">
				{createWorkspaceUsername
					? `Welcome back ${createWorkspaceUsername}`
					: `Hey ${info?.username}, nice to meet you.`}
			</h2>
		),
		3: (
			<div className="step3" style={{ position: 'relative' }}>
				<h1>Let's setup your workspace handle</h1>
				<p
					className="workspace-handle-text"
					style={{
						color:
							info?.isWorkspaceHandleAvailable ||
							info?.workspaceHandle?.length === 0 ||
							info?.isCheckingWorkspaceHandle
								? 'rgba(255, 255, 255, 0.5)'
								: '#FF646B',
					}}
				>
					{!info?.isWorkspaceHandleAvailable &&
					info?.workspaceHandle?.length > 0 &&
					!info?.isCheckingWorkspaceHandle
						? 'This domain is already taken '
						: 'Your domain will be '}
					<b className="workspace-handle">
						{info?.workspaceHandle || 'workspace-name'}.ve.ai
					</b>
					<span
						style={{
							opacity:
								info?.isWorkspaceHandleAvailable && !info?.isCheckingWorkspaceHandle
									? 1
									: 0,
							transition: 'opacity 0.3s ease',
						}}
					>
						<GreenTick />
					</span>
				</p>
			</div>
		),
		4: <h1 className="step4">What will be your workspace type?</h1>,
		5: <h1 className="step5">What is your profession?</h1>,
	};

	const onboardingStages = {
		1: (
			<Username
				step={info?.step}
				username={info?.username}
				setUsername={setUsername}
				animateStage1AndStep1Exit={animateStage1AndStep1Exit}
				invitedWorkspaceId={invitedWorkspaceId ?? false}
				invitedUserEmail={invitedUserEmail ?? false}
				handleInvitedUserUsername={handleInvitedUserUsername}
			/>
		),
		2: (
			<WorkspaceHandleName
				workspaceHandle={info?.workspaceHandle}
				isCheckingWorkspaceHandle={info?.isCheckingWorkspaceHandle}
				setIsCheckingWorkspaceHandle={setIsCheckingWorkspaceHandle}
				isWorkspaceHandleAvailable={info?.isWorkspaceHandleAvailable}
				setWorkspaceHandleAndBusinessName={setWorkspaceHandleAndBusinessName}
				setIsWorkspaceHandleAvailable={setIsWorkspaceHandleAvailable}
				animateStage2AndStep3Exit={animateStage2AndStep3Exit}
			/>
		),
		3: (
			<WorkspaceType
				setWorkspaceType={setWorkspaceType}
				animateStage3AndStep4Exit={animateStage3AndStep4Exit}
			/>
		),
		4: (
			<Profession
				workspaceType={info?.workspaceType}
				setProfession={setProfession}
				animateStep5AndStage4Exit={animateStep5AndStage4Exit}
			/>
		),
		5: <CreatingNewWorkspace profession={info?.profession} />,
	};

	return (
		<div className="onboarding-container">
			{info?.step !== 6 ? (
				<>
					<div className="left-container">
						<div className="progress-bar-container">
							{progressBar?.map((bar) => (
								<div
									style={{
										background: createWorkspaceUsername
											? info?.stage - 1 === bar?.id
												? 'white'
												: 'rgba(255, 255, 255, 0.1)'
											: info?.stage === bar?.id
											? 'white'
											: 'rgba(255, 255, 255, 0.1)',
										transition: 'background 0.4s ease',
										width: `${100 / progressBar?.length}%`,
									}}
									className="progress-bar"
									key={bar?.id}
								></div>
							))}
						</div>
						<div className="ai-intro">
							{AiIntro[info?.step]}
							{onboardingStages[info?.stage]}
						</div>
					</div>
					{info?.step >= 1 && info?.step <= 5 && (
						<div className="right-container">
							<div className="right-container-content"></div>
						</div>
					)}
				</>
			) : (
				<div className="ai-intro step6-container">
					<h1 className="step6">Setting up your workspace</h1>
				</div>
			)}
		</div>
	);
};

export default memo(Onboarding);
