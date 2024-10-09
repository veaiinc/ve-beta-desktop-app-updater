import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Context from '../../../context/context';
import { ReactComponent as EyeOpen } from '../../../assets/svg/password-eye-open.svg';
import { useNavigate } from 'react-router-dom';
const VerifyEmailCode = ({
	screenType,
	handleInput,
	usersData,
	isLoading,
	errorStates,
	setLoading,
	setStage,
	setErrorState,
	thirdStageButtonActive,
	goBack,
	passwordView,
	setPasswordView,
}) => {
	const navigate = useNavigate();
	let {
		userLogin: { verifyUserEmailCode, verifyResetPasswordCode, updatePassword },
	} = useContext(Context);

	const [newPassowrdView, setNewPassowrdView] = useState({
		takeNewPassowrd: false,
		newPassword: '',
	});

	const handleEmailVerifyCode = async () => {
		if (thirdStageButtonActive) {
			if (isLoading) {
				return;
			}
			setLoading(true);
			let json = {
				email: usersData['emailId'],
				verificationCode: usersData['verifyCode'], // usersData['verifyCode']
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

	const handleResetPasswordCode = async () => {
		if (isLoading) {
			return;
		}
		setLoading(true);
		let json = {
			email: usersData['emailId'],
			verificationCode: usersData['verifyCode'],
		};
		const response = await verifyResetPasswordCode(json);
		if (response?.[0]) {
			setLoading(false);
			setNewPassowrdView((prev) => ({ ...prev, takeNewPassowrd: true }));
		} else {
			setLoading(false);
			setErrorState((prevState) => ({
				...prevState,
				message: response[1],
			}));
		}
	};

	const handleOnclick = async () => {
		if (screenType === 'verify-email-code') {
			handleEmailVerifyCode();
		} else {
			handleResetPasswordCode();
		}
	};

	const handleChangePassword = async () => {
		if (!usersData['newPassword'].trim().length >= 8) {
			return setErrorState((prevState) => ({
				...prevState,
				message: 'passsword must be at least 8 characters',
			}));
		}
		if (isLoading) {
			return;
		}
		setLoading(true);

		const json = {
			password: usersData?.['newPassword'],
		};
		const response = await updatePassword(json);

		if (response?.[0]) {
			if (response?.[1] === 'createWorkspace') {
				setLoading(false);
				setStage('create-workspace');
				return;
			}
			// localStorage.removeItem('locationDetails');
			navigate('/sales');
			setLoading(false);
		} else {
			setLoading(false);
			setErrorState((prevState) => ({
				...prevState,
				message: response[1],
			}));
		}
	};
	return (
		<div className="stepOne">
			<p className="heading">We sent you a code</p>
			<p className="description">ve simplify your sales</p>

			{newPassowrdView?.takeNewPassowrd ? (
				<>
					<div className="inputContainer2 inputContainerPassword">
						<input
							type={passwordView ? 'password' : 'text'}
							placeholder="Add a Password here.."
							onChange={handleInput}
							name="newPassword"
							value={usersData['newPassword']}
							className={errorStates['password'] ? 'error' : ''}
							style={{ borderRadius: 0, border: 'none', height: 'auto' }}
						/>
						<span onClick={() => setPasswordView((prev) => !prev)}>
							<EyeOpen />
						</span>
					</div>
					<div className="continueButtonSplit">
						<div className="backButton " onClick={() => goBack('login-with-password')}>
							<p>Back</p>
						</div>
						<div
							className={`continueContainer ${
								thirdStageButtonActive ? 'active' : ''
							}`}
							onClick={handleChangePassword}
						>
							{isLoading ? <p>Loading...</p> : <p>Continue</p>}
						</div>
					</div>
					<p className="errorMessage">{errorStates['message']}</p>
				</>
			) : (
				<>
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
							className={`continueContainer ${
								thirdStageButtonActive ? 'active' : ''
							}`}
							onClick={() => (thirdStageButtonActive ? handleOnclick() : '')}
						>
							{isLoading ? <p>Loading...</p> : <p>Continue</p>}
						</div>
					</div>
					<p className="errorMessage">{errorStates['message']}</p>
				</>
			)}
		</div>
	);
};
export default VerifyEmailCode;
