import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import validator from 'validator';
// import '../../../assets/scss/login_page/index.scss';
import '../../../assets/scss/login_page/email.scss';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/login_page/google.svg';
import { ReactComponent as DesktopImage } from '../../../assets/svg/login_page/desktopImageNew.svg';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import { ReactComponent as EmailIcon } from '../../../assets/svg/footer/email.svg';
import { ReactComponent as AgentsIcon } from '../../../assets/svg/login_page/newAgents.svg';
import { ReactComponent as InfinityIcon } from '../../../assets/svg/login_page/infinityIcon.svg';
import Context from '../../../context/context';
import { getLocationsDetails } from '../../../helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from '../globalComponents/CustomToast';
import gsap from 'gsap';
import Spinner from '../loaders/Spinner';

const Email = ({
	email,
	setEmail,
	setActiveStage,
	setEmailVerified,
	lastOtpEmail,
	setLastOtpEmail,
}) => {
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
		setInfo((prev) => ({ ...prev, isHostnameVeDotAi, googleLoading: false }));

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
		if (e?.key !== 'Enter' && type !== 'click') {
			return;
		}

		const currentEmail = email || invitedUserEmail;

		if (currentEmail === lastOtpEmail) {
			setActiveStage('verificationCode');
			return;
		}

		if ((info?.isEmailValid && !info?.isLoading) || invitedUserEmail) {
			setInfo((prev) => ({ ...prev, isLoading: true }));
			try {
				const response = await checkAccountExistsUsingEmail(currentEmail);
				if (response[0] === true) {
					if (response?.[1]?.accountExists) {
						if (response?.[1]?.emailVerified) {
							if (referralCode && info?.referrerUserDetails?.isValidReferralCode) {
								message.warning(
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
						const createResponse = referralCode
							? await handleCreateAccountWithEmail(currentEmail, referralCode)
							: await handleCreateAccountWithEmail(currentEmail);
						if (createResponse[0] === true) {
							setLastOtpEmail(currentEmail);
						}
					}
					setLastOtpEmail(currentEmail);
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
		<div className="verify-user-container">
			<div className="login-page-content">
				{info?.referrerUserDetails?.isValidReferralCode && (
					<h1 className="referral-message">
						<EmailIcon className="email-icon" />
						<span className="referrer-name">{`Invited by ${info?.referrerUserDetails?.referrerName}`}</span>
					</h1>
				)}
				<div className="login-page-title">
					{/* <span className="title-one">AI.&nbsp; </span> */}
					<span className="meetVeIndicator">MEET VE</span>
					<div className="titleContainer">
						<span className="title-two">Your Living Intelligence </span>
						<span className="title-three">OS for work</span>
					</div>
					<span className="login-page-subtitle">
						An always-on, Real time, Proactive AI
					</span>
				</div>
			</div>
			<div className="loginOptionsViewer">
				<div className="eachLoginOption">
					<div className="eachOptionIcon">
						<DesktopImage />
					</div>
					<div className="eachOptionDetails">
						<div className="eachOptionTitle">Meeting & Desktop intelligence</div>
						<div className="eachOptionDesc">
							Sees what’s said. Remembers what matters.
						</div>
					</div>
				</div>
				<div className="eachLoginOption">
					<div className="eachOptionIcon">
						<AgentsIcon />
					</div>
					<div className="eachOptionDetails">
						<div className="eachOptionTitle">Super Agent</div>
						<div className="eachOptionDesc">
							Tasks, risks, and insights appear as you work.
						</div>
					</div>
				</div>
				<div className="eachLoginOption">
					<div className="eachOptionIcon">
						<InfinityIcon />
					</div>
					<div className="eachOptionDetails">
						<div className="eachOptionTitle">Ambient Cards</div>
						<div className="eachOptionDesc">Plans, builds, and acts end to end.</div>
					</div>
				</div>
			</div>
			{info?.isHostnameVeDotAi && (
				<>
					<div className="service-container">
						<div
							disabled={info?.googleLoading}
							className="google-login-button"
							onClick={handleContinueWithGoogle}
						>
							<div className="google-logo-container">
								<GoogleLogo />
								<p>Continue with Google</p>
							</div>
							{info?.googleLoading && (
								<Spinner
									width="18px"
									height="18px"
									color="var(--primary-button)"
									borderTopColor="transparent"
									borderWidth={1.5}
								/>
							)}
						</div>
					</div>
					<div className="or-divider">
						<div className="line"></div>
						<span className="or-text">OR</span>
					</div>
				</>
			)}

			<div className="login-content-wrapper">
				<div className="login-button-container">
					<div className="email-input-container">
						<input
							value={email}
							onChange={handleSetEmail}
							onKeyDown={handleContinueWithEmail}
							autoFocus
							type="email"
							placeholder="Enter your Email Address"
							className="email-input"
						/>
						<button
							disabled={!info.isEmailValid || info.isLoading}
							onClick={() => handleContinueWithEmail(null, 'click')}
							className="email-input-button"
						>
							{info.isLoading ? (
								<Spinner
									width="10px"
									height="10px"
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
									<UpArrowGrey className="arrow-icon" />
								</span>
							)}
						</button>
					</div>
				</div>
			</div>
			<div className="acknowledge-container">
				<p className="acknowledge-text">
					By signing in, you agree to our{' '}
					<span
						className="acknowledge-text-link"
						onClick={() => window.open('/terms-of-service', '_blank')}
					>
						Terms & Conditions
					</span>{' '}
					and{' '}
					<span
						className="acknowledge-text-link"
						onClick={() => window.open('/privacy-policy', '_blank')}
					>
						Privacy Policy
					</span>
				</p>
			</div>
		</div>
	);
};

export default memo(Email);
