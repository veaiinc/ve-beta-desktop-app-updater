import React, { memo, useEffect, useRef, useState } from 'react';
import validator from 'validator';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import {
	checkAccountExistsUsingEmail,
	createAccountUsingEmail,
	continueWithGoogle,
} from '../../../services/authServices/authServices';
import { getLocationsDetails } from '../../../helpers';
import { message } from 'antd';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';

const Email = ({ loginPageInfo, setLoginPageInfo }) => {
	const arrowRef = useRef(null);

	const [info, setInfo] = useState({
		isHovering: false,
		isEmailValid: false,
		isLoading: false,
	});

	useEffect(() => {
		if (arrowRef.current && info.isEmailValid) {
			gsap.to(arrowRef.current, {
				rotation: 90,
				duration: 0.5,
				ease: 'power2.out',
			});
		} else if (arrowRef.current && !info.isEmailValid) {
			gsap.to(arrowRef.current, {
				rotation: 0,
				duration: 0.5,
				ease: 'power2.out',
			});
		}
	}, [info.isEmailValid]);

	useEffect(() => {
		validateEmail(loginPageInfo?.email);
	}, [loginPageInfo?.email]);

	const handleCreateAccountWithEmail = async (email) => {
		const locationDetails = await getLocationsDetails();
		const response = await createAccountUsingEmail(email, locationDetails);
		if (response?.ok) {
			setLoginPageInfo((prev) => ({
				...prev,
				activeStage: 'verificationCode',
			}));
		} else {
			message?.error(response?.message);
		}
	};

	const handleContinueWithGoogle = async () => {
		const locationDetails = await getLocationsDetails();
		continueWithGoogle(locationDetails);
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
					if (response?.emailVerified) {
						setLoginPageInfo((prev) => ({
							...prev,
							emailVerified: true,
							activeStage: 'verificationCode',
						}));
					} else {
						setLoginPageInfo((prev) => ({
							...prev,
							emailVerified: false,
							activeStage: 'verificationCode',
						}));
					}
				} else {
					await handleCreateAccountWithEmail(loginPageInfo?.email);
					handleContinueWithEmail();
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
				<button className="google-login-button" onClick={handleContinueWithGoogle}>
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
							background: !info.isEmailValid ? 'rgba(255, 255, 255, 0.1)' : 'white',
						}}
						onMouseEnter={() => setInfo({ ...info, isHovering: true })}
						onMouseLeave={() => setInfo({ ...info, isHovering: false })}
						onClick={handleContinueWithEmail}
					>
						{info.isLoading ? (
							<Spinner width="20px" height="20px" />
						) : info?.isEmailValid ? (
							<span ref={arrowRef}>
								<UpArrowBlackHover />
							</span>
						) : (
							<span ref={arrowRef}>
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
