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
import jwtDecode from 'jwt-decode';
import PhoneNumber from '../../components/onboarding/PhoneNumber';
import VerifyPhoneNumberViaOTP from '../../components/onboarding/VerifyPhoneNumberViaOTP';

const tl1 = gsap.timeline();
const tl2 = gsap.timeline();

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

const Onboarding = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');
	const pathname = location?.pathname;
	const usertoken = localStorage.getItem('usertoken');
	let createWorkspaceUsername = '';
	if (pathname === '/create-workspace') {
		createWorkspaceUsername = jwtDecode(usertoken)?.userName;
	}
	const progressBar =
		createWorkspaceUsername || (invitedWorkspaceId && invitedUserEmail)
			? [{ id: 1 }, { id: 2 }, { id: 3 }]
			: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

	const {
		authInfo: { updateUserDetails, createWorkspace },
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
		phoneNumber: '',
		phoneNumberError: '',
	});

	useEffect(() => {
		if (!usertoken) {
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
		console.log('step', info?.step);
		if (info?.step === 2) {
			if (invitedWorkspaceId && invitedUserEmail) {
				animateStep2Enter();
				return;
			}
			if (!createWorkspaceUsername) {
				animateStep2EnterAndExit();
			}
		}
		if (info?.step === 3) {
			if (invitedWorkspaceId && invitedUserEmail) {
				animateStep3EnterForInvitedUser();
				return;
			}
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
		if (info?.step === 7) {
			animateStep7Enter();
		}
		if (info?.step === 8) {
			animateStep8Enter();
		}
	}, [info?.step]);

	useEffect(() => {
		console.log('stage', info?.stage);

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

	// const handleInvitedUserUsername = async () => {
	// 	const userDetailsResponse = await updateUserDetails(info?.username);
	// 	if (userDetailsResponse[0] === true) {
	// 		navigate('/home');
	// 	} else {
	// 		message.error(userDetailsResponse?.message);
	// 	}
	// };

	const handleOnboarding = async () => {
		try {
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
		} catch (error) {
			console.error('Error creating new workspace', error);
			throw error;
		}
	};

	const updateUserNameAndPhoneNumber = async () => {
		const userDetailsResponse = await updateUserDetails(info?.username, info?.phoneNumber);
		if (userDetailsResponse?.[0] === true) {
			message?.success('Otp sent successfully to the entered mobile number!');
			if (invitedWorkspaceId && invitedUserEmail) {
				animateStage2AndStep2Exit();
			} else animateStage5AndStep6Exit();
		} else {
			message?.error(userDetailsResponse?.[1]?.message);
			setInfo((prev) => ({
				...prev,
				phoneNumberError: userDetailsResponse?.[1]?.message,
			}));
		}
	};

	const handleSetPhoneNumber = (phoneNumber) => {
		if (phoneNumber)
			setInfo((prev) => ({
				...prev,
				phoneNumber,
			}));
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
				if (invitedWorkspaceId && invitedUserEmail) {
					incrementStage();
				}
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
		if (invitedWorkspaceId && invitedUserEmail) {
			tl2?.fromTo(
				'.stage2',
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
			);
		} else {
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
		}
	};

	const animateStep2Enter = () => {
		tl2?.fromTo(
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

	const animateStep3EnterForInvitedUser = () => {
		tl2?.fromTo(
			'.step3',
			{
				opacity: 0,
				scale: 0.5,
				y: 30,
			},
			{
				opacity: 1,
				scale: 1,
				y: 0,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStage(); // stage 3
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
					incrementStage();
				},
			},
		);
	};

	const animateStep7Enter = () => {
		tl2?.fromTo(
			'.step7',
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
					incrementStage();
				},
			},
		);
	};

	const animateStep8Enter = () => {
		tl2?.fromTo(
			'.step8',
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
					createWorkspaceUsername && handleOnboarding();
				},
			},
		);
	};

	const animateStage5AndStep6Exit = () => {
		tl1?.to('.step6', {
			opacity: 0,
			scale: 0.5,
			duration: 1,
			ease: 'power2.inOut',
		});
		tl2?.fromTo(
			'.stage5',
			{
				opacity: 1,
				scale: 1,
			},
			{
				opacity: 0,
				scale: 0.5,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStep();
				},
			},
		);
	};

	const animateStage2AndStep2Exit = () => {
		tl1?.to('.step2', {
			opacity: 0,
			scale: 0.5,
			duration: 1,
			ease: 'power2.inOut',
		});
		tl2?.fromTo(
			'.stage2',
			{
				opacity: 1,
				scale: 1,
			},
			{
				opacity: 0,
				scale: 0.5,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStep();
				},
			},
		);
	};

	const jumpToStep8AndHandleOnboarding = () => {
		setInfo((prev) => ({
			...prev,
			step: 8,
		}));
	};

	const AiIntro = createWorkspaceUsername
		? {
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
								{info?.workspaceHandle || 'workspace-name'}
							</b>
							<b className="workspace-handle">.ve.ai</b>
							<span
								style={{
									opacity:
										info?.isWorkspaceHandleAvailable &&
										!info?.isCheckingWorkspaceHandle
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
		  }
		: invitedWorkspaceId && invitedUserEmail
		? {
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
					<div className="step2 invited-onborading">
						<h1>Enter your mobile number</h1>
						<h2>
							This will be a one time process. You can also change it later anytime.
							We will reach out to you on this number.
						</h2>
					</div>
				),
				3: (
					<div className="step3 invited-onborading">
						<h1>We Sent You a Code</h1>
						<h2 className="otp-message">
							A 6-digit verification code has been sent to {info?.phoneNumber} Please
							enter it to continue.
						</h2>
					</div>
				),
		  }
		: {
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
								{info?.workspaceHandle || 'workspace-name'}
							</b>
							<b className="workspace-handle">.ve.ai</b>
							<span
								style={{
									opacity:
										info?.isWorkspaceHandleAvailable &&
										!info?.isCheckingWorkspaceHandle
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
				6: (
					<div className="step6">
						<h1>Enter your mobile number</h1>
						<h2>
							This will be a one time process. You can also change it later anytime.
							We will reach out to you on this number.
						</h2>
					</div>
				),
				7: (
					<div className="step7">
						<h1>We Sent You a Code</h1>
						<h2>
							A 6-digit verification code has been sent to {info?.phoneNumber} Please
							enter it to continue.
						</h2>
					</div>
				),
		  };

	const onboardingStages =
		invitedWorkspaceId && invitedUserEmail
			? {
					1: (
						<Username
							step={info?.step}
							username={info?.username}
							setUsername={setUsername}
							animateStage1AndStep1Exit={animateStage1AndStep1Exit}
						/>
					),
					2: (
						<PhoneNumber
							invitedOnboarding={invitedWorkspaceId && invitedUserEmail}
							phoneNumber={info?.phoneNumber}
							handleSetPhoneNumber={handleSetPhoneNumber}
							updateUserNameAndPhoneNumber={updateUserNameAndPhoneNumber}
							animateStage5AndStep6Exit={animateStage5AndStep6Exit}
							phoneNumberError={info?.phoneNumberError}
						/>
					),
					3: (
						<VerifyPhoneNumberViaOTP
							phoneNumber={info?.phoneNumber}
							incrementStep={incrementStep}
							handleOnboarding={handleOnboarding}
							invitedOnboarding={invitedWorkspaceId && invitedUserEmail}
						/>
					),
			  }
			: {
					1: (
						<Username
							step={info?.step}
							username={info?.username}
							setUsername={setUsername}
							animateStage1AndStep1Exit={animateStage1AndStep1Exit}
							invitedWorkspaceId={invitedWorkspaceId ?? false}
							invitedUserEmail={invitedUserEmail ?? false}
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
							createWorkspaceUsername={createWorkspaceUsername}
							jumpToStep8AndHandleOnboarding={jumpToStep8AndHandleOnboarding}
						/>
					),
					5: (
						<PhoneNumber
							phoneNumber={info?.phoneNumber}
							handleSetPhoneNumber={handleSetPhoneNumber}
							updateUserNameAndPhoneNumber={updateUserNameAndPhoneNumber}
							animateStage5AndStep6Exit={animateStage5AndStep6Exit}
							phoneNumberError={info?.phoneNumberError}
						/>
					),
					6: (
						<VerifyPhoneNumberViaOTP
							phoneNumber={info?.phoneNumber}
							incrementStep={incrementStep}
							handleOnboarding={handleOnboarding}
						/>
					),
					// 7: <CreatingNewWorkspace profession={info?.profession} />,
			  };

	return (
		<div className="onboarding-container">
			{info?.step !== 8 ? (
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
					{info?.step >= 1 && info?.step <= 7 && (
						<div className="right-container">
							<div className="right-container-content"></div>
						</div>
					)}
				</>
			) : (
				<div className="ai-intro step8-container">
					<h1 className="step8">Setting up your workspace</h1>
				</div>
			)}
		</div>
	);
};

export default memo(Onboarding);
