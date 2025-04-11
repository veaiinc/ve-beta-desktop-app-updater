import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import validator from 'validator';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import Context from '../../../context/context';
import { getLocationsDetails } from '../../../helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from '../globalComponents/CustomToast';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';

const Email = ({ email, setEmail, setActiveStage, setEmailVerified }) => {
	const navigate = useNavigate();
	const arrowRef = useRef(null);

	const {
		authInfo: {
			checkAccountExistsUsingEmail,
			createAccountUsingEmail,
			continueWithGoogle,
			getUsernameDetailsViaReferralCode,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		isHostnameVeDotAi: false,
		isEmailValid: false,
		isLoading: false,
		googleLoading: false,
		locationDetails: null,
		referrerUserDetails: null,
	});

	const location = useLocation();

	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');
	const referralCode = location?.pathname?.startsWith('/referral/')
		? location?.pathname?.split('/referral/')[1]
		: false;

	useEffect(() => {
		const isHostnameVeDotAi =
			typeof window !== 'undefined' && window.location.hostname.endsWith('ve.ai');
		setInfo((prev) => ({ ...prev, isHostnameVeDotAi }));

		if (referralCode) {
			handleGetAndSetReferrerUserName();
		}
		handleLocationDetailsData();
		const isValid = validator?.isEmail(email);
		setInfo((prev) => ({
			...prev,
			isEmailValid: isValid,
		}));

		return () => {
			setInfo((prev) => ({
				...prev,
				googleLoading: false,
			}));
		};
	}, []);

	useEffect(() => {
		if (invitedWorkspaceId && invitedUserEmail && info?.locationDetails) {
			localStorage?.clear();
			localStorage?.setItem('invitedWorkspaceId', invitedWorkspaceId);
			localStorage?.setItem('invitedUserEmail', invitedUserEmail);
			handleSetEmail(null, invitedUserEmail);
		}
	}, [invitedWorkspaceId, invitedUserEmail, info?.locationDetails]);

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

	const handleGetAndSetReferrerUserName = async () => {
		const response = await getUsernameDetailsViaReferralCode(referralCode);
		if (response?.[0] === true) {
			setInfo((prev) => ({ ...prev, referrerUserDetails: response?.[1] }));
			if (response?.[1]?.isValidReferralCode) {
				message?.success(`Referral code: ${referralCode} applied successfully`);
			} else {
				message?.error('Invalid referral code');
			}
		} else {
			message?.error(response?.[1]?.message);
		}
	};

	const handleLocationDetailsData = useCallback(async () => {
		let locationDetails;
		locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		if (!locationDetails) {
			locationDetails = await getLocationsDetails();
		}
		setInfo((prev) => ({ ...prev, locationDetails }));
		return locationDetails;
	}, []);

	const handleCreateAccountWithEmail = async (email, referralCode = false) => {
		if (info?.isLoading) return;
		setInfo((prev) => ({ ...prev, isLoading: true }));

		let locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		if (!locationDetails) {
			locationDetails = await handleLocationDetailsData();
		}

		const response = referralCode
			? await createAccountUsingEmail(email, info?.locationDetails, referralCode)
			: await createAccountUsingEmail(email, info?.locationDetails);
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
		}

		setInfo((prev) => ({ ...prev, googleLoading: true }));
		if (info?.referrerUserDetails?.isValidReferralCode) {
			continueWithGoogle(locationDetails, referralCode);
		} else {
			continueWithGoogle(locationDetails);
		}
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
							if (referralCode && info?.referrerUserDetails?.isValidReferralCode) {
								message?.info(
									'An account with this email already exists. Referral cannot be applied.',
								);
							}
							setEmailVerified(true);
							setActiveStage('verificationCode');
						} else {
							setEmailVerified(false);
							setActiveStage('verificationCode');
						}
					} else {
						referralCode
							? await handleCreateAccountWithEmail(
									email || invitedUserEmail,
									referralCode,
							  )
							: await handleCreateAccountWithEmail(email || invitedUserEmail);
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
				{info?.referrerUserDetails?.isValidReferralCode && (
					<h1 className="referral-message">
						<span className="referrer-name">{`${info?.referrerUserDetails?.referrerName}`}</span>{' '}
						invited you to join
					</h1>
				)}
				<h1 className="login-page-title">
					<span className="title-one">AI.&nbsp; </span>
					<span className="title-two">truly yours</span>
				</h1>
				<h2 className="login-page-subtitle">
					AI that deeply cares about your Goals & strives to be helpful
				</h2>
			</div>
			<div className="login-button-container">
				{info?.isHostnameVeDotAi && (
					<>
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
									color="var(--background-color)"
									borderTopColor="transparent"
								/>
							)}
						</button>
						<div className="or-divider">
							<div className="line"></div>
							<span>Or</span>
							<div className="line"></div>
						</div>
					</>
				)}
				<div className="email-input-container">
					<input
						value={email}
						onChange={handleSetEmail}
						onKeyDown={handleContinueWithEmail}
						autoFocus
						type="email"
						placeholder="example@acme.com"
					/>
					<button
						disabled={!info.isEmailValid || info.isLoading}
						style={{
							cursor:
								!info.isEmailValid || info.isLoading ? 'not-allowed' : 'pointer',
							background: !info.isEmailValid
								? 'var(--card-hover)'
								: 'var(--primary-button)',
						}}
						onClick={() => handleContinueWithEmail(null, 'click')}
					>
						{info.isLoading ? (
							<Spinner
								width="20px"
								height="20px"
								borderTopColor="transparent"
								color="var(--background-color)"
							/>
						) : info?.isEmailValid ? (
							<span ref={arrowRef}>
								<UpArrowBlackHover
									style={{
										stroke: 'var(--primary-font)',
									}}
								/>
							</span>
						) : (
							<span ref={arrowRef}>
								<UpArrowGrey
									style={{
										stroke: 'var(--card-over-card)',
									}}
								/>
							</span>
						)}
					</button>
				</div>
				<p className="disclaimer">
					By continuing, you accept our
					<br />
					<b onClick={() => navigate('/terms-of-service')} className="link">
						Terms of Service
					</b>
					,{' '}
					<b onClick={() => navigate('/privacy-policy')} className="link">
						Privacy Policy
					</b>{' '}
					and{' '}
					<b onClick={() => navigate('/cookie-policy')} className="link">
						Cookie Policy
					</b>
					.
				</p>
			</div>
		</>
	);
};

export default memo(Email);
