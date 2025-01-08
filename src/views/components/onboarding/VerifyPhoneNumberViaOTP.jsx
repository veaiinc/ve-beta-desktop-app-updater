import React, { useRef, useState, useEffect, useContext, memo } from 'react';
import '../../../assets/scss/onboarding/index.scss';
import Spinner from '../loaders/Spinner';
import Context from '../../../context/context';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
const VerifyPhoneNumberViaOTP = ({
	phoneNumber,
	incrementStep,
	handleOnboarding,
	invitedOnboarding = false,
}) => {
	const navigate = useNavigate();
	const {
		authInfo: { verifyMobileOtpCode, requestResendOTPToMobile },
	} = useContext(Context);
	const otpContainerRef = useRef();
	const [info, setInfo] = useState({
		otp: '',
		otpError: '',
		isLoading: false,
	});

	useEffect(() => {
		if (info?.otp?.length === 6) {
			if (!info?.isLoading && !info?.otpError) verifyCode(info?.otp);
		} else {
			setInfo((prev) => ({ ...prev, otpError: '' }));
		}
	}, [info?.otp]);

	const verifyCode = async () => {
		setInfo((prev) => ({
			...prev,
			isLoading: true,
		}));
		const response = await verifyMobileOtpCode(phoneNumber, info?.otp);
		let otpErr = '';
		if (response?.[0] === true) {
			message?.success('Mobile number verified successfully!');
			setTimeout(() => {
				incrementStep();
				if (invitedOnboarding) {
					navigate('/home');
				} else handleOnboarding();
			}, 1000);
		} else {
			otpErr = response?.[1]?.message;
		}
		setInfo((prev) => ({
			...prev,
			isLoading: false,
			otpError: otpErr,
		}));
	};

	const handleResendOTPToMobile = async () => {
		try {
			const response = await requestResendOTPToMobile();
			if (response?.[0] === true) {
				message?.success('OTP resend to mobile successfully!');
			} else {
				message?.error(response?.[1]?.message);
			}
		} catch (error) {
			message?.error('An unexpected error occured. Please try again!');
		}
	};

	return (
		<div className="verify-otp-container stage6">
			<div className="verification-code-input-container">
				<div className="otp-input-container" ref={otpContainerRef}>
					<Input.OTP
						id="otpContainer"
						value={info?.otp}
						onChange={(otp) => {
							const lastChar = otp.slice(-1);
							if (otp === '' || /^[0-9]$/.test(lastChar)) {
								setInfo((prev) => ({ ...prev, otp: otp }));
							}
						}}
						autoFocus
						length={6}
						inputType="number"
						inputMode="numeric"
						pattern="[0-9]*"
					/>
					{info?.isLoading && <Spinner />}
				</div>
				<p className="otp-error-message">{info?.otpError}</p>
			</div>
			<span onClick={handleResendOTPToMobile} className="resendCode">
				Resend Code
			</span>
		</div>
	);
};

export default memo(VerifyPhoneNumberViaOTP);
