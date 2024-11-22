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
		username: '',
		workspaceHandle: '',
		isWorkspaceHandleAvailable: false,
		workspaceType: '',
		profession: '',
		phoneNumber: '',
		isOnboard: false,
		businessName: '',
	});

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
	}, [info?.step]);

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

	const incrementStage = () => {
		setInfo((prev) => ({
			...prev,
			stage: prev?.stage + 1,
		}));
	};

	// Animations
	const animateAiIntro = () => {
		console.log('animateAiIntro');
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
		console.log('animateAiIntroForExistingUser');
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
				duration: 1,
				ease: 'power2.inOut',
			},
			'+=0',
		);
	};

	const animateStage1AndStep1Exit = () => {
		console.log('animateStage1AndStep1Exit');
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

	const animateStep2EnterAndExit = () => {
		console.log('animateStep2EnterAndExit');
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

	const animateStep3Enter = () => {
		console.log('animateStep3Enter');
		tl2.fromTo(
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
		4: <h1 className="step4">{info?.workspaceHandle}.ve.ai</h1>,
		5: <h1 className="step5">What will be the workspace type ?</h1>,
		6: <h1 className="step6">What is your profession ?</h1>,
		7: <h1 className="step7">Setting up your workspace</h1>,
	};

	const onboardingStages = {
		1: (
			<Username
				username={info?.username}
				setUsername={setUsername}
				incrementStep={incrementStep}
				incrementStage={incrementStage}
				animateStage1AndStep1Exit={animateStage1AndStep1Exit}
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
			/>
		),
		3: <WorkspaceType setWorkspaceType={setWorkspaceType} incrementStep={incrementStep} />,
		4: (
			<Profession
				workspaceType={info?.workspaceType}
				setProfession={setProfession}
				incrementStep={incrementStep}
			/>
		),
		5: <CreatingNewWorkspace profession={info?.profession} />,
	};

	return (
		<div className="onboarding-container">
			<div className="left-container">
				<div className="progress-bar-container">
					{progressBar?.map((bar) => (
						<div
							style={{
								background:
									info?.stage - 1 === bar?.id
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
			{info?.step >= 1 && (
				<div className="right-container">
					<div className="right-container-content"></div>
				</div>
			)}
		</div>
	);
};

export default memo(Onboarding);
