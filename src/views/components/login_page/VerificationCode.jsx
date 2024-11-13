import React, { memo, useState, useEffect, useRef } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/login_page/left-arrow-back-btn.svg';
import { ReactComponent as OutlookLogo } from '../../../assets/svg/login_page/outlook.svg';
import { ReactComponent as GmailLogo } from '../../../assets/svg/login_page/gmail.svg';
import { verifyEmailVerificationCode } from '../../../services/authServices/authServices';
import { message } from 'antd';
import { getLocationsDetails } from '../../../helpers';
import {
	createAccountUsingEmail,
	checkAccountExistsUsingEmail,
} from '../../../services/authServices/authServices';

const VerificationCode = ({ email, emailVerified, setLoginPageInfo }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		otp: '',
		otpError: '',
		isLoading: false,
	});
	const otpContainerRef = useRef(null);

	useEffect(() => {
		const container = otpContainerRef?.current;
		if (container) {
			container?.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			if (container) {
				container?.removeEventListener('keydown', handleKeyDown);
			}
		};
	}, [info?.otp, info?.isLoading]);

	useEffect(() => {
		if (info?.otp?.length === 6) {
			handleVerifyEmailVerificationCode();
		} else {
			setInfo((prev) => ({ ...prev, otpError: '' }));
		}
	}, [info?.otp]);

	const handleKeyDown = (e) => {
		if (e?.key === 'Enter' && info?.otp?.length === 6 && !info?.isLoading) {
			handleVerifyEmailVerificationCode();
		}
	};

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

	const handleResendCode = async () => {
		setInfo((prev) => ({ ...prev, isLoading: true }));
		try {
			const response = await checkAccountExistsUsingEmail(email);
			if (response?.ok) {
				message?.success('Code resent successfully! Check your email.');
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
					await handleCreateAccountWithEmail(email);
				}
			} else {
				message?.error(response?.message);
			}
		} catch (error) {
			console.error('Failed to check email:', error.message);
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
	};

	const handleVerifyEmailVerificationCode = async () => {
		setInfo((prev) => ({ ...prev, isLoading: true }));
		const response = await verifyEmailVerificationCode(email, info?.otp, emailVerified);
		if (response?.ok) {
			if (emailVerified) {
				if (response?.hasWorkspaces) {
					if (response?.isOnboard) navigate('/home');
					else navigate('/early-access');
				} else {
					navigate('/onboarding');
				}
			} else if (response?.hasWorkspaces) {
				navigate('/home');
			} else {
				navigate('/onboarding');
			}
		} else {
			setInfo((prev) => ({ ...prev, otpError: response?.message }));
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
	};

	return (
		<div className="verification-code-container">
			<div className="back-btn-container">
				<span
					onClick={() => setLoginPageInfo((prev) => ({ ...prev, activeStage: 'email' }))}
				>
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
				<div ref={otpContainerRef}>
					<OtpInput
						value={info?.otp}
						onChange={(otp) => setInfo({ ...info, otp })}
						numInputs={6}
						renderInput={(props) => <input {...props} />}
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
						isInputNum={true}
						placeholder="000000"
						shouldAutoFocus={true}
					/>
				</div>
				<p className="otp-error-message">{info?.otpError}</p>
			</div>
			<p className="resend-code-text" onClick={handleResendCode}>
				Resend code
			</p>
		</div>
	);
};

export default memo(VerificationCode);
