import React, { useState, useEffect, useRef } from 'react';
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

import { verifyAccountExistsUsingEmail } from '../../../controllers/login';
var validator = require('validator');
const SignIn = () => {
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
	const [stage, setStage] = useState('verifyUser');
	const [usersData, setUsersData] = useState({
		emailId: '',
		password: '',
		name: '',
		verifyCode: '',
	});

	const [errorStates, setErrorState] = useState({
		emailId: false,
		password: false,
		name: false,
		verifyCode: false,
	});

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
			}));
		}
	};

	const handleUserExists = async () => {
		if (usersData['emailId'] && validator.isEmail(usersData['emailId'])) {
			let response = await verifyAccountExistsUsingEmail(usersData['emailId']);

			if (response[0]) {
				setStage('signIn');
			}
		} else {
			setErrorState((prevState) => ({
				...prevState,
				emailId: true,
			}));
		}
	};

	const verifyUserStep = (isActive) => {
		return (
			<div className={`stepOne ${isActive ? 'activeStep' : ''}`}>
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
				<div className="continueContainer active" onClick={() => handleUserExists()}>
					<p>Continue</p>
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

	const userSignUp = (isActive) => {
		return (
			<div className={`stepOne ${isActive ? 'activeStep' : ''}`}>
				<p className="heading">
					Welcome to <VE /> <span>AI</span>
				</p>
				<p className="description">Your AI assistant for work</p>

				<div className="userSignUp">
					<div className="inputContainer">
						<input type="email" placeholder="work@email.com" />
					</div>
					<div className="inputContainer">
						<input type="name" placeholder="Type your Name here.." />
					</div>
					<div className="inputContainer inputContainerPassword">
						<input type="password" placeholder="Add a Password here.." />
						<EyeOpen />
					</div>
					<div className="continueButtonSplit">
						<div className="backButton " onClick={() => setStage('verifyUser')}>
							<p>Back</p>
						</div>
						<div
							className="continueContainer active"
							onClick={() => setStage('verifyEmailCode')}
						>
							<p>Continue</p>
						</div>
					</div>
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

	const verifyEmailCode = () => {
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
						value={usersData['verifyCode']}
					/>
				</div>

				<div className="continueButtonSplit">
					<div className="backButton " onClick={() => setStage('signIn')}>
						<p>Back</p>
					</div>
					<div
						className="continueContainer active"
						onClick={() => setStage('businessDetails')}
					>
						<p>Continue</p>
					</div>
				</div>
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

				<div className="continueContainer active" onClick={() => setStage('signIn')}>
					<p>Continue</p>
				</div>
			</div>
		);
	};

	return (
		<div className="container">
			<div className="topContainer">
				<div className="topLeftContainer">
					<div>
						{stage === 'verifyUser' && verifyUserStep(true)}
						{stage === 'signIn' && userSignUp(true)}
						{stage === 'verifyEmailCode' && verifyEmailCode(true)}
						{stage === 'businessDetails' && getBusinessDetails(true)}
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
