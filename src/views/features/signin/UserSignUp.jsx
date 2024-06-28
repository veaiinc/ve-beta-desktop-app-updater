import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Context from '../../../context/context';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as EyeOpen } from '../../../assets/svg/password-eye-open.svg';
import axios from 'axios';
const UserSignUp = ({
	handleInput,
	usersData,
	isLoading,
	errorStates,
	setLoading,
	setStage,
	setErrorState,
	passwordView,
	setPasswordView,
	goBack,
	secondStageButtonActive,
}) => {
	let {
		userLogin: { createUsersAccount },
	} = useContext(Context);

	const [geoGraphicData, setGeoGraphData] = useState(null);

	useEffect(() => {
		getGeoGraphicData();
	}, []);

	const getGeoGraphicData = useCallback(async () => {
		const response = await axios.get('https://ipapi.co/json/');
		setGeoGraphData(response?.data);
	}, []);

	const handleUserSignUp = async () => {
		if (secondStageButtonActive) {
			setLoading(true);
			let json = {
				firstName: usersData['name'],
				email: usersData['emailId'],
				password: usersData['password'],
				country: geoGraphicData?.country_name || 'India', // remove this
				timezone: geoGraphicData?.timezone || 'Asia/Kolkata', // remove this
				currency: geoGraphicData?.currency || 'INR', // remove this
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
						className={`continueContainer ${secondStageButtonActive ? 'active' : ''}`}
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

export default UserSignUp;
