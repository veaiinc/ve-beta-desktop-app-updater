import { memo, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/login_page/verification_code.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/login_page/left-arrow-back-btn.svg';
import { message } from '../globalComponents/CustomToast';
import { getLocationsDetails } from '../../../helpers';
import Context from '../../../context/context';
import Spinner from '../loaders/Spinner';
import CustomOtp from '../globalComponents/CustomOtp';
import '../../../assets/scss/otp_input/otp_input.scss';

const VerificationCode = ({ email, emailVerified, setEmailVerified, setActiveStage }) => {
	const navigate = useNavigate();
	const {
		authInfo: {
			createAccountUsingEmail,
			checkAccountExistsUsingEmail,
			verifyEmailVerificationCode,
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
	});
	const [otpArray, setOtpArray] = useState(Array(4).fill(''));
	const otpContainerRef = useRef(null);

	useEffect(() => {
		handleLocationDetailsData();

		return () => {
			clearInterval(info?.resendTimerInterval);
		};
	}, []);

	useEffect(() => {
		if (info?.otp?.length === 4) {
			verifyCode(info?.otp);
		} else {
			setInfo((prev) => ({ ...prev, otpError: '' }));
		}
	}, [info?.otp]);

	const verifyCode = async (otp) => {
		if (info?.isLoading) return;
		setInfo((prev) => ({ ...prev, isLoading: true }));
		const response = await verifyEmailVerificationCode(email, otp, emailVerified);

		if (response[0] === true) {
			if (invitedWorkspaceId && invitedUserEmail) {
				await getWorkSpaceInfo(invitedWorkspaceId);
				navigate(
					`/onboarding?invitedWorkspaceId=${invitedWorkspaceId}&inviteeEmail=${invitedUserEmail}`,
				);
			} else if (emailVerified) {
				if (response?.[1]?.hasWorkspaces) {
					if (response?.[1]?.isOnboard) {
						// let locationDetails = JSON.parse(localStorage?.getItem('locationDetails'));
						// if (!locationDetails) {
						// 	locationDetails = await getLocationsDetails();
						// }
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
			setInfo((prev) => ({ ...prev, otpError: response?.[1]?.message }));
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
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
		try {
			if (!info?.canResend) return;
			setInfo((prev) => ({ ...prev, isLoading: true, canResend: false, resendTimer: 60 }));
			const response = await checkAccountExistsUsingEmail(email);
			if (response[0] === true) {
				message?.success('Code resent successfully! Check your email.');
				setInfo((prev) => ({ ...prev, isLoading: false }));
				if (response?.[1]?.accountExists) {
					if (response?.[1]?.emailVerified) {
						setEmailVerified(true);
						setActiveStage('verificationCode');
					} else {
						setEmailVerified(false);
						setActiveStage('verificationCode');
					}
				} else {
					await handleCreateAccountWithEmail(email);
				}
			} else {
				message?.error(response?.[1]?.message);
			}
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
			console.error('Failed to check email:', error.message);
		}
	};

	const handleLocationDetailsData = useCallback(async () => {
		let locationDetails;
		locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		if (!locationDetails) {
			locationDetails = await getLocationsDetails();
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
						A 4-digit verification code has been sent to {email}.
					</p>
				</div>
				<div className="verification-code-input-container-wrapper">
					<div className="verification-code-input-container" ref={otpContainerRef}>
						<CustomOtp
							otp={otpArray}
							setOtp={setOtpArray}
							onComplete={(otpStr) => setInfo((prev) => ({ ...prev, otp: otpStr }))}
							error={info?.otpError}
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
								<span>Change Email ?</span>
							</div>
						</>
					)}
				</div>
			</div>
			<div className="acknowledge-container">
				<span className="acknowledge-text">
					By continuing, you acknowledge that you understand and agree to the{' '}
				</span>
				<span
					className="acknowledge-text-link"
					onClick={() => window.open('/terms-of-service', '_blank')}
				>
					Terms & Conditions
				</span>{' '}
				<span className="acknowledge-text">and</span>{' '}
				<span
					className="acknowledge-text-link"
					onClick={() => window.open('/privacy-policy', '_blank')}
				>
					Privacy Policy
				</span>
			</div>
		</div>
	);
};

export default memo(VerificationCode);
