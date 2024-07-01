import React, { useState, useEffect, useContext, useRef } from 'react';
import '../../../assets/scss/signin.scss';
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
import MakeUpArtist from '../../../assets/images/login/makeup-artist.png';
import { useNavigate } from 'react-router-dom';
import VerifyUserStep from './VerifyUserStep';
import UserSignUp from './UserSignUp';
import VerifyEmailCode from './VerifyEmailCode';
import GetBusinessDetails from './GetBusinessDetails';
import LoginWithPassword from './LoginWithPassword';

var validator = require('validator');

const SignIn = (props) => {
	const creatorCards = [
		{ image: MakeUpArtist, profession: 'Make up Artist', name: 'Simmy' },
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
		newPassword: '',
	});

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
		setLoading(false);
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

	const mapper = {
		'verify-user': (
			<VerifyUserStep
				handleInput={handleInput}
				usersData={usersData}
				isLoading={isLoading}
				errorStates={errorStates}
				setLoading={setLoading}
				setStage={setStage}
				setErrorState={setErrorState}
			/>
		),
		'signup-user': (
			<UserSignUp
				handleInput={handleInput}
				usersData={usersData}
				isLoading={isLoading}
				errorStates={errorStates}
				setLoading={setLoading}
				setStage={setStage}
				setErrorState={setErrorState}
				secondStageButtonActive={secondStageButtonActive}
				goBack={goBack}
				setPasswordView={setPasswordView}
				passwordView={passwordView}
			/>
		),
		'verify-email-code': (
			<VerifyEmailCode
				screenType="verify-email-code"
				handleInput={handleInput}
				usersData={usersData}
				isLoading={isLoading}
				errorStates={errorStates}
				setLoading={setLoading}
				setStage={setStage}
				goBack={goBack}
				setErrorState={setErrorState}
				thirdStageButtonActive={thirdStageButtonActive}
				setPasswordView={setPasswordView}
				passwordView={passwordView}
			/>
		),
		'create-workspace': (
			<GetBusinessDetails
				errorStates={errorStates}
				setStage={setStage}
				setLoading={setLoading}
				isLoading={isLoading}
				setErrorState={setErrorState}
			/>
		),
		'login-with-password': (
			<LoginWithPassword
				handleInput={handleInput}
				usersData={usersData}
				isLoading={isLoading}
				errorStates={errorStates}
				loginPasswordStageActive={loginPasswordStageActive}
				setStage={setStage}
				setLoading={setLoading}
				setPasswordView={setPasswordView}
				passwordView={passwordView}
				goBack={goBack}
				setErrorState={setErrorState}
			/>
		),
		'forgot-password': (
			<VerifyEmailCode
				screenType="forgot-password"
				handleInput={handleInput}
				usersData={usersData}
				isLoading={isLoading}
				errorStates={errorStates}
				setLoading={setLoading}
				setStage={setStage}
				goBack={goBack}
				setErrorState={setErrorState}
				thirdStageButtonActive={thirdStageButtonActive}
				setPasswordView={setPasswordView}
				passwordView={passwordView}
			/>
		),
	};

	return (
		<div className="container">
			<div className="topContainer">
				<div className="topLeftContainer">
					<div>{mapper?.[stage]}</div>
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
