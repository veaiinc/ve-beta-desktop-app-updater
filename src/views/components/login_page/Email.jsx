import React, { memo, useEffect, useState } from 'react';
import validator from 'validator';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import {
	checkAccountExistsUsingEmail,
	createAccountUsingEmail,
} from '../../../services/authServices/authServices';
import { getLocationsDetails } from '../../../helpers';
import { message } from 'antd';
import Spinner from '../loaders/Spinner';

const Email = ({ loginPageInfo, setLoginPageInfo }) => {
	const navigate = useNavigate();
	const urlDetails = useLocation();

	const [info, setInfo] = useState({
		isHovering: false,
		isEmailValid: false,
		isLoading: false,
	});

	useEffect(() => {
		if (urlDetails?.pathname === '/signup') {
			const email = urlDetails?.search?.split('=')[1];
			if (email) {
				handleCreateAccountWithEmail(email);
			}
		} else if (urlDetails?.pathname === '/login') {
			const email = urlDetails?.search?.split('=')[1];
			if (email) {
				handleContinueWithEmail();
			}
		}
	}, [urlDetails?.pathname]);

	useEffect(() => {
		validateEmail(loginPageInfo?.email);
	}, [loginPageInfo?.email]);

	const handleCreateAccountWithEmail = async (email) => {
		const locationDetails = await getLocationsDetails();
		const response = await createAccountUsingEmail(email, locationDetails);
		if (response?.ok) {
			message?.info('Account created successfully! Please verify your email.', 1.5);
			setTimeout(() => {
				setLoginPageInfo((prev) => ({
					...prev,
					activeStage: 'verificationCode',
				}));
			}, 1500);
		} else {
			message?.error(response?.message);
		}
	};

	const handleGoogleLogin = () => {
		console.log('google login');
	};

	const validateEmail = (email) => {
		const isValid = validator.isEmail(email);
		setInfo((prev) => ({
			...prev,
			isEmailValid: isValid,
		}));
	};

	const handleSetEmail = (e) => {
		const email = e?.target?.value;
		setLoginPageInfo((prev) => ({
			...prev,
			email: email,
		}));
	};

	const handleContinueWithEmail = async () => {
		setInfo((prev) => ({ ...prev, isLoading: true }));
		try {
			const response = await checkAccountExistsUsingEmail(loginPageInfo?.email);
			if (response?.ok) {
				if (response?.accountExists) {
					if (urlDetails?.pathname === '/login') {
						setLoginPageInfo((prev) => ({
							...prev,
							activeStage: 'verificationCode',
							emailVerified: response?.emailVerified,
							accountExists: response?.accountExists,
						}));
					} else {
						message?.info(
							'This email is already registered, redirecting to login!',
							1.5,
						);
						setTimeout(() => {
							navigate('/login?loginemail=' + loginPageInfo?.email);
						}, 1500);
					}
				} else if (!response?.accountExists) {
					if (urlDetails?.pathname === '/login') {
						message?.info('This email is not registered, redirecting to signup!', 1.5);
						setTimeout(() => {
							navigate('/signup?signupemail=' + loginPageInfo?.email);
						}, 1500);
					} else if (urlDetails?.pathname === '/signup') {
						handleCreateAccountWithEmail(loginPageInfo?.email);
					}
				}
			} else {
				message?.error(response?.message);
			}
		} catch (error) {
			console.error('Failed to check email:', error.message);
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && info.isEmailValid && !info.isLoading) {
			handleContinueWithEmail();
		}
	};

	return (
		<>
			<h1 className="login-page-title">
				Access <span>to your</span> workspace
			</h1>
			<div className="login-button-container">
				<button className="google-login-button" onClick={handleGoogleLogin}>
					<GoogleLogo />
					<p>Continue with Google</p>
				</button>
				<div className="or-divider">
					<div className="line"></div>
					<span>Or</span>
					<div className="line"></div>
				</div>
				<div className="email-input-container">
					<input
						value={loginPageInfo?.email}
						onChange={handleSetEmail}
						onKeyDown={handleKeyDown}
						autoFocus={true}
						type="email"
						placeholder="work@gmail.com"
					/>
					<button
						disabled={!info.isEmailValid || info.isLoading}
						style={{
							cursor:
								!info.isEmailValid || info.isLoading ? 'not-allowed' : 'pointer',
							background: !info.isEmailValid ? 'rgba(255, 255, 255, 0.1)' : '',
						}}
						onMouseEnter={() => setInfo({ ...info, isHovering: true })}
						onMouseLeave={() => setInfo({ ...info, isHovering: false })}
						onClick={handleContinueWithEmail}
					>
						{info.isLoading ? (
							<Spinner width="20px" height="20px" />
						) : info?.isHovering ? (
							<span>
								<UpArrowBlackHover />
							</span>
						) : (
							<span>
								<UpArrowGrey />
							</span>
						)}
					</button>
				</div>
			</div>
		</>
	);
};

export default memo(Email);
