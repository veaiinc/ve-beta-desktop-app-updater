import { memo, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/login_page/verification_code.scss';
import { message } from '../globalComponents/CustomToast';
import Context from '../../../context/context';
import Spinner from '../loaders/Spinner';
import CustomOtp from '../globalComponents/CustomOtp';
import '../../../assets/scss/otp_input/otp_input.scss';
import { getLocationsDetails } from '../../../helpers';

const VerificationCode = ({ email, emailVerified, setEmailVerified, setActiveStage }) => {
	const navigate = useNavigate();
	const {
		authInfo: {
			createAccountUsingEmail,
			checkAccountExistsUsingEmail,
			verifyEmailVerificationCode,
			// getLocationDetails,
		},
		profileInfo: { getWorkSpaceInfo },
	} = useContext(Context);

	const location = useLocation();
	const params = new URLSearchParams(location?.search);
	const invitedWorkspaceId = params?.get('invitedWorkspaceId');
	const invitedUserEmail = params?.get('inviteeEmail');

	const [info, setInfo] = useState({
		otp: '',
		otpError: '',
		isLoading: false,
		canResend: true,
		resendTimer: 60,
		resendTimerInterval: null,
		locationDetails: null,
		failedAttempts: 0, // Track failed attempts
		blockUntil: null, // Timestamp when block ends
	});

	const [otpArray, setOtpArray] = useState(Array(4).fill(''));
	const otpContainerRef = useRef(null);

	// Restore block state from localStorage on mount
	useEffect(() => {
		const savedBlock = localStorage.getItem('otpBlock');
		const now = Date.now();

		if (savedBlock) {
			const { email: blockedEmail, blockUntil } = JSON.parse(savedBlock);
			if (blockedEmail === email && now < blockUntil) {
				setInfo((prev) => ({
					...prev,
					failedAttempts: 3,
					blockUntil,
					otpError: info?.otpError || `Too many failed attempts. Try again in 1 hour.`,
				}));
			} else if (now >= blockUntil) {
				// Block expired, clean up
				localStorage.removeItem('otpBlock');
			}
		}

		return () => {
			clearInterval(info?.resendTimerInterval);
		};
	}, [email, info?.resendTimerInterval]);

	useEffect(() => {
		if (info?.otp?.length === 4) {
			verifyCode(info?.otp);
		} else {
			setInfo((prev) => ({ ...prev, otpError: '' }));
		}
	}, [info?.otp]);

	const verifyCode = async (otp) => {
		const now = Date.now();

		// Check if user is currently blocked
		if (info.blockUntil && now < info.blockUntil) {
			const minutesLeft = Math.ceil((info.blockUntil - now) / 60000);
			setInfo((prev) => ({
				...prev,
				otpError: `Too many failed attempts. Try again in ${minutesLeft} minute${
					minutesLeft > 1 ? 's' : ''
				}.`,
			}));
			setOtpArray(Array(4).fill(''));
			return;
		}

		if (info?.isLoading) return;

		setInfo((prev) => ({ ...prev, isLoading: true }));

		const response = await verifyEmailVerificationCode(email, otp, emailVerified);

		if (response[0] === true) {
			// ✅ Success: Reset failed attempts and block
			setInfo((prev) => ({
				...prev,
				failedAttempts: 0,
				blockUntil: null,
				otpError: '',
				isLoading: false,
			}));
			setOtpArray(Array(4).fill(''));

			// Clear block from localStorage if exists
			const savedBlock = localStorage.getItem('otpBlock');
			if (savedBlock && JSON.parse(savedBlock).email === email) {
				localStorage.removeItem('otpBlock');
			}

			// Navigation logic
			if (invitedWorkspaceId && invitedUserEmail) {
				await getWorkSpaceInfo(invitedWorkspaceId);
				navigate(
					`/onboarding?invitedWorkspaceId=${invitedWorkspaceId}&inviteeEmail=${invitedUserEmail}`,
				);
			} else if (emailVerified) {
				if (response?.[1]?.hasWorkspaces) {
					if (response?.[1]?.isOnboard) {
						await getWorkSpaceInfo(response?.[1]?.workspaceId);
						navigate('/home');
					} else {
						navigate('/early-access');
					}
				} else {
					navigate('/onboarding');
				}
			} else if (response?.[1]?.hasWorkspaces) {
				navigate('/home');
			} else {
				navigate('/onboarding');
			}
		} else {
			const newFailedAttempts = info.failedAttempts + 1;
			const MAX_ATTEMPTS = 3;
			let newBlockUntil = null;
			setInfo((prev) => ({ ...prev, otpError: response?.[1]?.message }));

			if (newFailedAttempts >= MAX_ATTEMPTS) {
				newBlockUntil = now + 60 * 60 * 1000; // 1 hour in milliseconds
				const blockData = { email, blockUntil: newBlockUntil };
				localStorage.setItem('otpBlock', JSON.stringify(blockData));

				setInfo((prev) => ({
					...prev,
					failedAttempts: newFailedAttempts,
					blockUntil: newBlockUntil,
					// otpError: info?.otpError || 'Too many failed attempts. Try again in 1 hour.',
					isLoading: false,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					failedAttempts: newFailedAttempts,
					// otpError: info?.otpError || 'Invalid code. Try again.',
					isLoading: false,
				}));
			}

			// setOtpArray(Array(4).fill('')); // Clear OTP input after failure
		}
	};

	const handleCreateAccountWithEmail = async (email) => {
		if (!info?.locationDetails) {
			await handleLocationDetailsData();
		}
		const response = await createAccountUsingEmail(email, info?.locationDetails);
		if (response[0] === true) {
			setActiveStage('verificationCode');
		} else {
			message?.error(response?.message);
		}
	};

	const handleResendCode = async () => {
		const now = Date.now();

		// Prevent resend if blocked
		if (info.blockUntil && now < info.blockUntil) {
			const minutesLeft = Math.ceil((info.blockUntil - now) / 60000);
			message?.error(`Too many failed attempts. Cannot resend for ${minutesLeft} minutes.`);
			return;
		}

		if (!info?.canResend || info?.isLoading) return;

		setInfo((prev) => ({
			...prev,
			isLoading: true,
			canResend: false,
			resendTimer: 60,
		}));

		try {
			const response = await checkAccountExistsUsingEmail(email);
			if (response[0] === true) {
				message?.success('Code resent successfully! Check your email.');
				setInfo((prev) => ({ ...prev, isLoading: false }));

				if (response?.[1]?.accountExists) {
					setEmailVerified(response?.[1]?.emailVerified);
					setActiveStage('verificationCode');
				} else {
					await handleCreateAccountWithEmail(email);
				}
			} else {
				message?.error(response?.[1]?.message);
			}

			// Reset failed attempts on resend (optional: improves UX)
			setInfo((prev) => ({ ...prev, failedAttempts: 0, otpError: '' }));
			localStorage.removeItem('otpBlock'); // Clear block if any

			const interval = setInterval(() => {
				setInfo((prev) => {
					if (prev.resendTimer > 0) {
						return { ...prev, resendTimer: prev.resendTimer - 1 };
					} else {
						clearInterval(interval);
						return { ...prev, canResend: true, isLoading: false };
					}
				});
			}, 1000);

			setInfo((prev) => ({ ...prev, resendTimerInterval: interval }));
		} catch (error) {
			console.error('Failed to resend code:', error.message);
			message?.error('Failed to resend code. Please try again.');
			setInfo((prev) => ({ ...prev, isLoading: false, canResend: true }));
		}
	};

	const handleLocationDetailsData = useCallback(async () => {
		let locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		if (!locationDetails) {
			const response = await getLocationsDetails();
			if (response?.[0] === true) {
				locationDetails = response?.[1];
			} else {
				message?.error(response?.[1]?.message);
			}
			// Optionally save it
			localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
		}
		setInfo((prev) => ({ ...prev, locationDetails }));
	}, []);

	return (
		<div className="verification-code-container">
			<div className="verification-code-header-container">
				<div className="verification-code-title-container">
					<h1 className="verification-code-title">
						We sent you a <span className="verification-code-title-span">code</span>
					</h1>
					<p className="verification-code-subtitle">
						A 4-digit verification code has been sent to <span>{email}</span>.
					</p>
				</div>

				<div className="verification-code-input-container-wrapper">
					<div className="verification-code-input-container" ref={otpContainerRef}>
						<CustomOtp
							otp={otpArray}
							setOtp={setOtpArray}
							onComplete={(otpStr) => setInfo((prev) => ({ ...prev, otp: otpStr }))}
							error={info?.otpError}
							disabled={info.blockUntil && Date.now() < info.blockUntil}
						/>
					</div>

					{info?.isLoading ? (
						<Spinner width={'32px'} height={'32px'} cssstyle={{ padding: '4px' }} />
					) : (
						<>
							<p
								className={`resend-code-text ${!info?.canResend ? 'disabled' : ''}`}
								onClick={handleResendCode}
								style={{
									cursor: info?.canResend ? 'pointer' : 'not-allowed',
									opacity: info?.canResend ? 1 : 0.5,
								}}
							>
								{!info?.canResend
									? `Resend code in ${info?.resendTimer} seconds`
									: 'Resend code'}
							</p>

							<div
								className="back-btn-container"
								onClick={() => setActiveStage('email')}
							>
								<span>Change Email?</span>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="acknowledge-container">
				<p className="acknowledge-text">
					By continuing, you acknowledge that you understand
					<br />
					{' and agree to the '}
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

export default memo(VerificationCode);
