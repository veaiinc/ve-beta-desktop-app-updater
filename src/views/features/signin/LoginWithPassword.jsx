import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EyeOpen } from '../../../assets/svg/password-eye-open.svg';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
const LoginWithPassword = ({
	handleInput,
	usersData,
	isLoading,
	errorStates,
	passwordView,
	setPasswordView,
	goBack,
	setLoading,
	setErrorState,
	loginPasswordStageActive,
	setStage,
}) => {
	const navigate = useNavigate();
	let {
		userLogin: { userLogin, sendEmailOtpRequest, restePasswordEmailOtpRequest },
	} = useContext(Context);

	useEffect(() => {
		if (!usersData['emailId']?.length) {
			goBack('verify-user');
		}
	}, []);

	const handleUserLogin = async (event, type) => {
		if (event?.key === 'Enter' || type === 'click') {
			if (loginPasswordStageActive) {
				if (isLoading) {
					return;
				}
				setLoading(true);

				let json = {
					email: usersData['emailId'],
					password: usersData['password'],
				};
				let response = await userLogin(json);

				if (response?.[0]) {
					if (response?.[1] === 'redirect') {
						const payload = { email: usersData['emailId'] };
						setLoading(false);
						setStage('verify-email-code');
						sendEmailOtpRequest(payload);
						return;
					}
					if (response?.[1] === 'createWorkspace') {
						setLoading(false);
						setStage('create-workspace');
						return;
					}
					localStorage.removeItem('locationDetails');
					navigate('/sales');
					setLoading(false);
				} else {
					setLoading(false);
					setErrorState((prevState) => ({
						...prevState,
						message: response[1],
					}));
				}
			}
		}
	};

	const handleForgotPasswordClick = async () => {
		const payload = { email: usersData['emailId'] };
		setLoading(false);
		setErrorState((prevState) => ({
			...prevState,
			message: '',
		}));
		setStage('forgot-password');
		restePasswordEmailOtpRequest(payload);
	};

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
						onKeyDown={handleUserLogin}
						autoFocus={true}
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
						className={`continueContainer ${loginPasswordStageActive ? 'active' : ''}`}
						onClick={() =>
							loginPasswordStageActive ? handleUserLogin(null, 'click') : ''
						}
					>
						{isLoading ? <p>Loading...</p> : <p>Continue</p>}
					</div>
				</div>
			</div>
			<div className="privacyPolicyContainer privacyPolicyContainerFlexRow">
				<p onClick={handleForgotPasswordClick}>
					<span>Forgot your Password?</span>
				</p>
				<p className="errorMessage">{errorStates['message']}</p>
			</div>
		</div>
	);
};
export default LoginWithPassword;
