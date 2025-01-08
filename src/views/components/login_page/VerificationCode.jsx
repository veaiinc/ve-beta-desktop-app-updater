import React, { memo, useState, useEffect, useRef, useContext, useCallback } from 'react';
// import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/login_page/left-arrow-back-btn.svg';
import { ReactComponent as OutlookLogo } from '../../../assets/svg/login_page/outlook.svg';
import { ReactComponent as GmailLogo } from '../../../assets/svg/login_page/gmail.svg';
import { message } from 'antd';
import { getLocationsDetails } from '../../../helpers';
import Context from '../../../context/context';
import Spinner from '../loaders/Spinner';
import { useLocation } from 'react-router-dom';
import { Input } from 'antd';

const VerificationCode = ({ email, emailVerified, setEmailVerified, setActiveStage }) => {
	const navigate = useNavigate();
	const {
		authInfo: {
			createAccountUsingEmail,
			checkAccountExistsUsingEmail,
			verifyEmailVerificationCode,
		},
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
	const otpContainerRef = useRef(null);

	useEffect(() => {
		handleLocationDetailsData();

		return () => {
			clearInterval(info?.resendTimerInterval);
		};
	}, []);

	useEffect(() => {
		if (info?.otp?.length === 6) {
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
				navigate(
					`/onboarding?invitedWorkspaceId=${invitedWorkspaceId}&inviteeEmail=${invitedUserEmail}`,
				);
			} else if (emailVerified) {
				if (response?.[1]?.hasWorkspaces) {
					if (response?.[1]?.isOnboard) {
						const locationDetails = JSON.parse(
							localStorage?.getItem('locationDetails'),
						);
						if (!locationDetails) {
							locationDetails = await getLocationsDetails();
						}
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
						setInfo((prev) => ({ ...prev, canResend: true, isLoading: false }));
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
			<div className="back-btn-container">
				<span onClick={() => setActiveStage('email')}>
					<LeftArrowBackBtn />
				</span>
				<span>Back</span>
			</div>
			<h1 className="verification-code-title">
				<b>We sent you a code</b>
			</h1>
			<p className="verification-code-subtitle">
				A 6-digit verification code has been sent to {email}. <br />
				<br />
				<br />
				Please enter it to continue.
			</p>
			<div className="open-email-container">
				<p>Open in</p>
				<div className="email-logo-container">
					<GmailLogo />
					<OutlookLogo />
				</div>
			</div>
			<div className="verification-code-input-container">
				<div className="otp-input-container" ref={otpContainerRef}>
					{/* <OtpInput
						value={info?.otp}
						onChange={(otp) => setInfo((prev) => ({ ...prev, otp }))}
						numInputs={6}
						renderInput={(props) => {
							return <input {...props} />;
						}}
						inputStyle={{
							display: 'flex',
							width: '49px',
							height: '49px',
							padding: '20px',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '10px',
							borderRadius: '100px',
							background: 'rgba(255, 255, 255, 0.05)',
							outline: 'none',
							border: 'none',
							color: '#fff',
							userSelect: 'none',
						}}
						containerStyle={{ display: 'flex', gap: '6px' }}
						inputType="number"
						placeholder="000000"
						shouldAutoFocus={true}
					/> */}
					<Input.OTP
						id="otpContainer"
						inputRender={({ inputElement, index }) => {
							return React.cloneElement(inputElement, {
								placeholder: '0',
							});
						}}
						defaultValue={info?.otp}
						onChange={(otp) => {
							setInfo((prev) => ({ ...prev, otp: otp }));
						}}
						formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
						autoFocus
						length={6}
						placeholder="000000"
					/>

					{info?.isLoading && <Spinner />}
				</div>
				<p className="otp-error-message">{info?.otpError}</p>
			</div>
			<p
				className={`resend-code-text ${!info?.canResend ? 'disabled' : ''}`}
				onClick={handleResendCode}
				style={{
					cursor: info?.canResend ? 'pointer' : 'not-allowed',
					opacity: info?.canResend ? 1 : 0.5,
				}}
			>
				{!info?.canResend ? `Resend code in ${info?.resendTimer} seconds` : 'Resend code'}
			</p>
		</div>
	);
};

export default memo(VerificationCode);
