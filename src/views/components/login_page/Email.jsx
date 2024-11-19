import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import validator from 'validator';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import Context from '../../../context/context';
import { getLocationsDetails } from '../../../helpers';
import { message } from 'antd';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';
import debounce from 'lodash/debounce';

const locationDetails = await getLocationsDetails();

const Email = ({ loginPageInfo, setLoginPageInfo }) => {
	const arrowRef = useRef(null);

	let {
		authInfo: { checkAccountExistsUsingEmail, createAccountUsingEmail, continueWithGoogle },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isEmailValid: false,
		isLoading: false,
		googleLoading: false,
		enterPressed: false,
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
		if (info?.enterPressed) return;
		setInfo((prev) => ({ ...prev, isLoading: true, enterPressed: true }));
		const response = await createAccountUsingEmail(email, locationDetails);
		if (response[0] === true) {
			setLoginPageInfo((prev) => ({
				...prev,
				activeStage: 'verificationCode',
			}));
		} else {
			message?.error(response?.[1]?.message);
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
		return response;
	};

	const debouncedCreateAccount = debounce(handleCreateAccountWithEmail, 1000);

	const handleContinueWithGoogle = async () => {
		setInfo((prev) => ({ ...prev, googleLoading: true }));
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
		if (info?.enterPressed) return;
		setInfo((prev) => ({ ...prev, isLoading: true, enterPressed: true }));
		try {
			const response = await checkAccountExistsUsingEmail(loginPageInfo?.email);
			if (response[0] === true) {
				if (response?.[1]?.accountExists) {
					if (response?.[1]?.emailVerified) {
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
					await debouncedCreateAccount(loginPageInfo?.email);
				}
			} else {
				message?.error(response?.[1]?.message);
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
			<div className="login-page-content">
				<h2 className="login-page-subtitle">Welcome to the home of</h2>
				<h1 className="login-page-title">AI workers who mind your business.</h1>
			</div>
			<div className="login-button-container">
				<button
					disabled={info?.googleLoading}
					className="google-login-button"
					onClick={handleContinueWithGoogle}
				>
					<GoogleLogo />
					<p>Continue with Google</p>
					{info?.googleLoading && (
						<Spinner
							width="20px"
							height="20px"
							color="black"
							borderTopColor="transparent"
						/>
					)}
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
						onClick={handleContinueWithEmail}
					>
						{info.isLoading ? (
							<Spinner
								width="20px"
								height="20px"
								borderTopColor="transparent"
								color="black"
							/>
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
