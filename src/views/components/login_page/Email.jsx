import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import validator from 'validator';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import Context from '../../../context/context';
import { getLocationsDetails } from '../../../helpers';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';

const Email = ({ email, setEmail, setActiveStage, setEmailVerified }) => {
	const arrowRef = useRef(null);

	let {
		authInfo: { checkAccountExistsUsingEmail, createAccountUsingEmail, continueWithGoogle },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isEmailValid: false,
		isLoading: false,
		googleLoading: false,
		locationDetails: null,
	});

	const location = useLocation();
	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');

	useEffect(() => {
		if (invitedWorkspaceId && invitedUserEmail) {
			localStorage?.clear();
			localStorage?.setItem('invitedWorkspaceId', invitedWorkspaceId);
			localStorage?.setItem('invitedUserEmail', invitedUserEmail);
			handleSetEmail(null, invitedUserEmail);
		}
		handleLocationDetailsData();
	}, [invitedWorkspaceId, invitedUserEmail]);

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
	}, [info?.isEmailValid]);

	const handleLocationDetailsData = useCallback(async () => {
		let locationDetails;
		locationDetails = localStorage.getItem('locationDetails');
		if (!locationDetails) {
			locationDetails = await getLocationsDetails();
		}
		setInfo((prev) => ({ ...prev, locationDetails }));
	}, []);

	const handleCreateAccountWithEmail = async (email) => {
		if (info?.isLoading) return;
		setInfo((prev) => ({ ...prev, isLoading: true }));
		let locationDetails = JSON.parse(localStorage?.getItem('locationDetails'));
		if (!locationDetails) {
			locationDetails = await getLocationsDetails();
			localStorage?.setItem('locationDetails', JSON.stringify(locationDetails));
		}
		const response = await createAccountUsingEmail(email, locationDetails);
		if (response[0] === true) {
			setActiveStage('verificationCode');
			setEmailVerified(false);
		} else {
			message?.error(response?.[1]?.message);
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
		return response;
	};

	const handleContinueWithGoogle = async () => {
		if (info?.googleLoading) {
			return;
		}
		let locationDetails = JSON.parse(localStorage?.getItem('locationDetails'));
		if (!locationDetails) {
			locationDetails = await getLocationsDetails();
			localStorage?.setItem('locationDetails', JSON.stringify(locationDetails));
		}

		setInfo((prev) => ({ ...prev, googleLoading: true }));
		continueWithGoogle(info?.locationDetails);
	};

	const handleSetEmail = (e, invitedUserEmail = false) => {
		const email = e?.target?.value ?? invitedUserEmail;
		const isValid = validator?.isEmail(email);
		setInfo((prev) => ({
			...prev,
			isEmailValid: isValid,
		}));
		setEmail(email);
		if (invitedUserEmail && isValid) {
			handleContinueWithEmail(null, 'click', email);
		}
	};

	const handleContinueWithEmail = async (e, type, invitedUserEmail = false) => {
		if (
			((e?.key === 'Enter' || type === 'click') && info?.isEmailValid && !info?.isLoading) ||
			invitedUserEmail
		) {
			setInfo((prev) => ({ ...prev, isLoading: true }));
			try {
				const response = await checkAccountExistsUsingEmail(email || invitedUserEmail);
				if (response[0] === true) {
					if (response?.[1]?.accountExists) {
						if (response?.[1]?.emailVerified) {
							setEmailVerified(true);
							setActiveStage('verificationCode');
						} else {
							setEmailVerified(false);
							setActiveStage('verificationCode');
						}
					} else {
						await handleCreateAccountWithEmail(email || invitedUserEmail);
					}
				} else {
					message?.error(response?.[1]?.message);
				}
			} catch (error) {
				console.error('Failed to check email:', error.message);
			}
			setInfo((prev) => ({ ...prev, isLoading: false }));
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
						value={email}
						onChange={handleSetEmail}
						onKeyDown={handleContinueWithEmail}
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
						onClick={() => handleContinueWithEmail(null, 'click')}
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
