import React, { useState, useEffect, useContext, useRef } from 'react';
import '../../../assets/scss/signin.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as EyeOpen } from '../../../assets/svg/password-eye-open.svg';
import GoogleLogo from '../../../assets/images/googleLogo.png';
import Marquee from 'react-fast-marquee';

import Restaurateur from '../../../assets/images/login/restaurateur.png';
import Photographer from '../../../assets/images/login/photographer.png';
import Architecture from '../../../assets/images/login/architecture.png';
import SalonAndSpa from '../../../assets/images/login/salon-and-spa.png';
import InteriorDesigner from '../../../assets/images/login/interior-designer.png';
import BusinessCoach from '../../../assets/images/login/business-coach.png';
import Consultant from '../../../assets/images/login/consultant.png';
import EventManagement from '../../../assets/images/login/event-management.png';
import FashionDesigner from '../../../assets/images/login/fashion-designer.png';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

var validator = require('validator');

const SignIn = (props) => {
	const creatorCards = [
		{ image: '', profession: 'Make up Artist', name: 'Simmy' },
		{ image: Consultant, profession: 'Consultant', name: 'Alexa' },
		{ image: SalonAndSpa, profession: 'Salon & Spa', name: 'Suzane' },
		{ image: Architecture, profession: 'Architecture', name: 'Jack' },
		{ image: Photographer, profession: 'Photographer', name: 'Danny' },
		{ image: FashionDesigner, profession: 'Fashion Designer', name: 'Suzi' },
		{ image: EventManagement, profession: 'Event Management', name: 'Katrina' },
		{ image: InteriorDesigner, profession: 'Interior Designer', name: 'Melissa' },
		{ image: BusinessCoach, profession: 'Business Coach', name: 'Adam' },
		{ image: Restaurateur, profession: 'Restaurateur', name: 'Ahaan' },
	];
	const navigate = useNavigate();
	const firstRender = useRef(true);

	const [stage, setStage] = useState(props.stage);
	const [isLoading, setLoading] = useState(false);
	const [secondStageButtonActive, setSecondStageButtonActive] = useState(false);
	const [thirdStageButtonActive, setThirdStageButtonActive] = useState(false);
	const [loginPasswordStageActive, setLoginPasswordStageActive] = useState(false);
	const [passwordView, setPasswordView] = useState(true);

	const [usersData, setUsersData] = useState({
		emailId: '',
		password: '',
		name: '',
		verifyCode: '',
	});

	let {
		userLogin: {
			verifyAccountExistsUsingEmail,
			createUsersAccount,
			verifyUserEmailCode,
			userLogin,
		},
	} = useContext(Context);

	const [errorStates, setErrorState] = useState({
		emailId: false,
		password: false,
		name: false,
		verifyCode: false,
		message: '',
	});

	const goBack = (stage) => {
		setStage(stage);
		setErrorState((prevState) => ({
			...prevState,
			message: '',
		}));
	};

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			navigate(`/${stage}`, { replace: true });
		}
	}, [stage, navigate]);

	useEffect(() => {
		const isValidEmail = usersData['emailId'] && validator.isEmail(usersData['emailId']);
		const isValidName = usersData['name'].trim().length > 0;
		const isValidPassword = usersData['password'].length >= 8;

		setSecondStageButtonActive(isValidEmail && isValidName && isValidPassword);
	}, [usersData.emailId, usersData.name, usersData.password]);

	useEffect(() => {
		const isValidCode = usersData['verifyCode'].trim().length === 6;

		setThirdStageButtonActive(isValidCode);
	}, [usersData.verifyCode]);

	useEffect(() => {
		const isValidCode = usersData['password'].trim().length >= 8;

		setLoginPasswordStageActive(isValidCode);
	}, [usersData.password]);

	const handleInput = (event) => {
		const { name, value } = event.target;

		if (name !== 'verifyCode' || (name === 'verifyCode' && /^[0-9]*$/.test(value))) {
			setUsersData((prevState) => ({
				...prevState,
				[name]: value,
			}));

			setErrorState((prevState) => ({
				...prevState,
				[name]: false,
				message: '',
			}));
		}
	};

	const handleUserExists = async () => {
		if (usersData['emailId'] && validator.isEmail(usersData['emailId'])) {
			setLoading(true);
			let response = await verifyAccountExistsUsingEmail(usersData['emailId']);

			if (response[0] && response[1]?.isAccountExist) {
				setStage('login-with-password');
				setLoading(false);
			} else if (response[0] && response[1]?.isAccountExist == false) {
				setStage('signup-user');
				setLoading(false);
			}
		} else {
			setLoading(false);
			setErrorState((prevState) => ({
				...prevState,
				emailId: true,
			}));
		}
	};

	const handleUserSignUp = async () => {
		if (secondStageButtonActive) {
			setLoading(true);
			let json = {
				firstName: usersData['name'],
				email: usersData['emailId'],
				phoneNumber: '+919941933191', // remove this
				password: usersData['password'],
				country: 'India', // remove this
				timezone: 'Asia/Kolkata', // remove this
				currency: 'INR', // remove this
				region: 'ap-south-1', // remove this
			};
			let response = await createUsersAccount(json);

			if (response[0]) {
				setLoading(false);
				setStage('verify-email-code');
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					message: response[1]?.message,
				}));
			}
		}
	};

	const handleEmailVerifyCode = async () => {
		if (thirdStageButtonActive) {
			setLoading(true);
			let json = {
				email: usersData['emailId'],
				verificationCode: '202406', // usersData['verifyCode']
			};
			let response = await verifyUserEmailCode(json);

			if (response[0]) {
				setLoading(false);
				setStage('create-workspace');
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					message: response[1]?.message,
				}));
			}
		}
	};

	const handleUserLogin = async () => {
		if (loginPasswordStageActive) {
			setLoading(true);
			let json = {
				email: usersData['emailId'],
				password: usersData['password'],
			};
			let response = await userLogin(json);

			if (response?.[0]) {
				navigate('/sales');
				setLoading(false);
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					message: response[1]?.message,
				}));
			}
		}
	};

	const verifyUserStep = () => {
		return (
			<div className={`stepOne`}>
				<p className="heading">
					Welcome to <VE /> <span>AI</span>
				</p>
				<p className="description">Your AI assistant for work</p>

				<div className="signinWithGoogle">
					<img src={GoogleLogo} alt={'G'} />
					<p>Continue with Google</p>
				</div>

				<p className="or">or</p>

				<div className="inputContainer">
					<input
						type="email"
						placeholder="work@email.com"
						onChange={handleInput}
						name="emailId"
						value={usersData['emailId']}
						className={errorStates['emailId'] ? 'error' : ''}
					/>
				</div>
				<div
					className={`continueContainer ${
						validator.isEmail(usersData['emailId']) && isLoading == false
							? 'active'
							: ''
					}`}
					onClick={() => (isLoading ? '' : handleUserExists())}
				>
					{isLoading ? <p>Loading...</p> : <p>Continue</p>}
				</div>
				<p className="errorMessage">{errorStates['message']}</p>
				<div className="privacyPolicyContainer">
					<p>By signing up to create an account, I accept Company’s</p>
					<p>
						<span>Terms of Use</span> & <span>Privacy Policy</span>
					</p>
				</div>
			</div>
		);
	};

	const userSignUp = () => {
		return (
			<div className={`stepOne`}>
				<p className="heading">
					Welcome to <VE /> <span>AI</span>
				</p>
				<p className="description">Your AI assistant for work</p>

				<div className="userSignUp">
					<div className="inputContainer">
						<input
							type="email"
							placeholder="work@email.com"
							onChange={handleInput}
							name="emailId"
							value={usersData['emailId']}
							className={errorStates['emailId'] ? 'error' : ''}
							readOnly={true}
						/>
					</div>
					<div className="inputContainer">
						<input
							type="text"
							placeholder="Type your Name here.."
							onChange={handleInput}
							name="name"
							value={usersData['name']}
							className={errorStates['name'] ? 'error' : ''}
						/>
					</div>
					<div className="inputContainer inputContainerPassword">
						<input
							type="password"
							placeholder="Add a Password here.."
							onChange={handleInput}
							name="password"
							value={usersData['password']}
							className={errorStates['password'] ? 'error' : ''}
						/>
						<EyeOpen />
					</div>
					<div className="continueButtonSplit">
						<div className="backButton " onClick={() => goBack('verify-user')}>
							<p>Back</p>
						</div>
						<div
							className={`continueContainer ${
								secondStageButtonActive ? 'active' : ''
							}`}
							onClick={() => (secondStageButtonActive ? handleUserSignUp() : '')}
						>
							{isLoading ? <p>Loading...</p> : <p>Continue</p>}
						</div>
					</div>
					<p className="errorMessage">{errorStates['message']}</p>
				</div>
				<div className="privacyPolicyContainer">
					<p>By signing up to create an account, I accept Company’s</p>
					<p>
						<span>Terms of Use</span> & <span>Privacy Policy</span>
					</p>
				</div>
			</div>
		);
	};

	const verifyEmailCode = (screenType) => {
		return (
			<div className="stepOne" style={{ paddingTop: '40%' }}>
				<p className="heading">We sent you a code</p>
				<p className="description">ve simplify your sales</p>

				<div className="inputContainer inputContainerCode">
					<input
						type="text"
						placeholder="000000"
						maxlength="6"
						pattern="[0-9]*"
						onChange={handleInput}
						name="verifyCode"
						value={usersData['verifyCode']}
					/>
				</div>

				<div className="continueButtonSplit">
					<div
						className="backButton "
						onClick={() =>
							screenType === 'verify-email-code'
								? goBack('signup-user')
								: screenType === 'forgot-password'
								? goBack('login-with-password')
								: ''
						}
					>
						<p>Back</p>
					</div>
					<div
						className={`continueContainer ${thirdStageButtonActive ? 'active' : ''}`}
						onClick={() => (thirdStageButtonActive ? handleEmailVerifyCode() : '')}
					>
						{isLoading ? <p>Loading...</p> : <p>Continue</p>}
					</div>
				</div>
				<p className="errorMessage">{errorStates['message']}</p>
			</div>
		);
	};

	const getBusinessDetails = () => {
		return (
			<div className="stepOne">
				<p className="heading">Let’s get Started</p>
				<p className="description businessDescription">
					Tailor our services to match your preferences
				</p>

				<div className="inputContainer">
					<input type="text" placeholder="What is your Business Name" />
				</div>
				<div className="inputContainer">
					<input type="name" placeholder="Type your Name here.." />
				</div>

				<div className="continueContainer active" onClick={() => setStage('signup-user')}>
					<p>Continue</p>
				</div>
				<p className="errorMessage">{errorStates['message']}</p>
			</div>
		);
	};

	const loginWithPassword = () => {
		return (
			<div className={`stepOne`}>
				<p className="heading">
					Sign In to <VE /> <span>AI</span>
				</p>
				<p className="description">Your AI assistant for work</p>

				<div className="userSignUp">
					<div className="inputContainer">
						<input
							type="email"
							placeholder="work@email.com"
							onChange={handleInput}
							name="emailId"
							value={usersData['emailId']}
							className={errorStates['emailId'] ? 'error' : ''}
							readOnly={true}
						/>
					</div>
					<div className="inputContainer2 inputContainerPassword">
						<input
							type={passwordView ? 'password' : 'text'}
							placeholder="Add a Password here.."
							onChange={handleInput}
							name="password"
							value={usersData['password']}
							className={errorStates['password'] ? 'error' : ''}
							style={{ borderRadius: 0, border: 'none', height: 'auto' }}
						/>
						<span onClick={() => setPasswordView((prev) => !prev)}>
							<EyeOpen />
						</span>
					</div>
					<div className="continueButtonSplit">
						<div className="backButton " onClick={() => goBack('verify-user')}>
							<p>Back</p>
						</div>
						<div
							className={`continueContainer ${
								loginPasswordStageActive ? 'active' : ''
							}`}
							onClick={() => (loginPasswordStageActive ? handleUserLogin() : '')}
						>
							{isLoading ? <p>Loading...</p> : <p>Continue</p>}
						</div>
					</div>
				</div>
				<div className="privacyPolicyContainer privacyPolicyContainerFlexRow">
					<p onClick={() => setStage('forgot-password')}>
						<span>Forgot your Password?</span>
					</p>
					<p className="errorMessage">{errorStates['message']}</p>
				</div>
			</div>
		);
	};

	const resetPassword = () => {
		return (
			<div className={`stepOne`}>
				<p className="heading">Reset Password</p>

				<div className="userSignUp">
					<div className="inputContainer inputContainerPassword">
						<input
							type="password"
							placeholder="Add a Password here.."
							onChange={handleInput}
							name="password"
							value={usersData['password']}
							className={errorStates['password'] ? 'error' : ''}
						/>
						<EyeOpen />
					</div>
					<div className="continueButtonSplit">
						<div className="backButton " onClick={() => goBack('verify-user')}>
							<p>Back</p>
						</div>
						<div
							className={`continueContainer ${
								loginPasswordStageActive ? 'active' : ''
							}`}
							onClick={() => (loginPasswordStageActive ? handleUserLogin() : '')}
						>
							{isLoading ? <p>Loading...</p> : <p>Continue</p>}
						</div>
					</div>
				</div>
				<div className="privacyPolicyContainer privacyPolicyContainerFlexRow">
					<p onClick={() => setStage('forgot-password')}>
						<span>Forgot your Password?</span>
					</p>
					<p className="errorMessage">{errorStates['message']}</p>
				</div>
			</div>
		);
	};

	return (
		<div className="container">
			<div className="topContainer">
				<div className="topLeftContainer">
					<div>
						{stage === 'verify-user' && verifyUserStep(true)}
						{stage === 'signup-user' && userSignUp(true)}
						{stage === 'verify-email-code' && verifyEmailCode('verify-email-code')}
						{stage === 'create-workspace' && getBusinessDetails(true)}
						{stage === 'login-with-password' && loginWithPassword(true)}
						{stage === 'forgot-password' && verifyEmailCode('forgot-password')}
						{stage === 'reset-password' && resetPassword()}
					</div>
				</div>
				<div className="topRightContainer">
					<p>
						Choose your <span>AI Type</span>
					</p>
					<p>& Tools Built for</p>
					<p>
						Each <span>Role and Profession</span>
					</p>
				</div>
			</div>

			<div className="marqueeContainer">
				<Marquee pauseOnHover={true} delay={1}>
					{creatorCards.map((item, index) => (
						<div
							key={index}
							style={{
								backgroundImage: `url(${item.image})`,
							}}
							className="creatorsCard"
						>
							<p>{item.profession}</p>
							<div className="creatorName">
								<span>{item.name}</span>
							</div>
						</div>
					))}
				</Marquee>
			</div>
		</div>
	);
};

export default SignIn;
