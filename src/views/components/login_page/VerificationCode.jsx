import React, { memo, useState, useEffect, useRef, useContext } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/login_page/index.scss';
import { ReactComponent as LeftArrowBackBtn } from '../../../assets/svg/login_page/left-arrow-back-btn.svg';
import { ReactComponent as OutlookLogo } from '../../../assets/svg/login_page/outlook.svg';
import { ReactComponent as GmailLogo } from '../../../assets/svg/login_page/gmail.svg';
import { message } from 'antd';
import { getLocationsDetails } from '../../../helpers';
import Context from '../../../context/context';
import Spinner from '../loaders/Spinner';
import debounce from 'lodash/debounce';
import { useLocation } from 'react-router-dom';

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
	});
	const otpContainerRef = useRef(null);

	useEffect(() => {
		if (info?.otp?.length !== 6) {
			setInfo((prev) => ({ ...prev, otpError: '', isLoading: false }));
			debouncedVerifyCode.cancel();
		} else {
			setInfo((prev) => ({ ...prev, isLoading: true }));
			debouncedVerifyCode(info?.otp);
		}

		return () => {
			debouncedVerifyCode.cancel();
		};
	}, [info?.otp]);

	const verifyCode = async (otp) => {
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

	const debouncedVerifyCode = debounce(verifyCode, 1500);

	const handleCreateAccountWithEmail = async (email) => {
		const locationDetails = await getLocationsDetails();
		const response = await createAccountUsingEmail(email, locationDetails);
		if (response[0] === true) {
			setActiveStage('verificationCode');
		} else {
			message?.error(response?.message);
		}
	};

	const handleResendCode = async () => {
		setInfo((prev) => ({ ...prev, isLoading: true, canResend: false }));
		try {
			if (!info?.canResend) {
				message.info('Please wait 60 seconds before requesting another code');
				return;
			}
			const response = await checkAccountExistsUsingEmail(email);
			if (response[0] === true) {
				message?.success('Code resent successfully! Check your email.');
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
			const timeout = setTimeout(() => {
				setInfo((prev) => ({ ...prev, canResend: true }));
			}, 60000);
			return () => clearTimeout(timeout);
		} catch (error) {
			console.error('Failed to check email:', error.message);
		}
		setInfo((prev) => ({ ...prev, isLoading: false }));
	};

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
					<OtpInput
						value={info?.otp}
						onChange={(otp) => setInfo({ ...info, otp })}
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
						isInputNum={true}
						placeholder="000000"
						shouldAutoFocus={true}
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
				Resend code
			</p>
		</div>
	);
};

export default memo(VerificationCode);
