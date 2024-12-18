import React, { useRef, useState, useEffect, useContext } from 'react';
import OtpInput from 'react-otp-input';
import '../../../assets/scss/onboarding/index.scss';
import Spinner from '../loaders/Spinner';
import Context from '../../../context/context';
import { message } from 'antd';

const VerifyPhoneNumberViaOTP = ({ phoneNumber, incrementStep, handleOnboarding }) => {
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
				handleOnboarding();
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
					<OtpInput
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

export default VerifyPhoneNumberViaOTP;
