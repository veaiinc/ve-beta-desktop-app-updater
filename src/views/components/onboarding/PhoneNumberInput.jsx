import { memo } from 'react';
import Spinner from '../loaders/Spinner';
import Skeleton from 'react-loading-skeleton';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as GreenTick } from '../../../assets/svg/onboarding/green-tick.svg';

const PhoneNumberInput = ({
	otpSent,
	phoneNumber,
	otp,
	handleSetOTP,
	verifyOtpLoader,
	handleResendOtp,
	resendOtpLoading,
	handleSetOTPSentToFalse,
	userDetailsLoading,
	isPhoneNumberVerified,
	handleSetPhoneNumber,
	handleVerifyPhoneNumber,
	verifyPhoneNumberLoading,
}) => {
	return otpSent ? (
		<div className="otpInputContainer">
			<p className="question">Enter the OTP that was sent to {phoneNumber}</p>
			<input
				className={`otpInput ${otpSent && 'animate'}`}
				value={otp}
				placeholder="0000"
				onChange={handleSetOTP}
				type="text"
			/>
			{verifyOtpLoader && (
				<div className="spinnerContainer">
					<Spinner width={'16px'} height={'16px'} />
				</div>
			)}
			<button
				onClick={handleResendOtp}
				className="resendOtpBtn"
				style={{
					opacity: resendOtpLoading ? 0.5 : 1,
					cursor: resendOtpLoading ? 'not-allowed' : 'pointer',
				}}
				disabled={resendOtpLoading}
			>
				{resendOtpLoading ? 'Resending...' : 'Resend OTP'}
			</button>
			<button onClick={handleSetOTPSentToFalse} className="changePhoneNumberBtn">
				Change Phone Number
			</button>
		</div>
	) : (
		<div className="phoneInputContainer">
			<p className="question">Enter your phone number</p>
			<div className="phoneInputContain">
				{userDetailsLoading ? (
					<span style={{ width: '100%' }}>
						<Skeleton
							width="100%"
							height="41px"
							style={{
								'--highlight-color': 'gray',
								'--base-color': 'transparent',
								borderRadius: '8px',
							}}
						/>
					</span>
				) : (
					<PhoneInput
						placeholder="Enter phone number"
						value={phoneNumber}
						onChange={handleSetPhoneNumber}
						defaultCountry={(() => {
							try {
								const locationDetails = JSON.parse(
									localStorage.getItem('locationDetails'),
								);
								return locationDetails?.countryCode || 'US';
							} catch {
								return 'US';
							}
						})()}
						className="phoneInputNumber"
						countryCallingCodeEditable={true}
						autoComplete="tel"
						disabled={isPhoneNumberVerified}
					/>
				)}
				{isPhoneNumberVerified ? (
					<div className="phoneNumberVerifiedContainer">
						<GreenTick />
					</div>
				) : (
					phoneNumber && (
						<button
							onClick={handleVerifyPhoneNumber}
							className="verifyPhoneNumberBtn"
							style={{
								opacity: verifyPhoneNumberLoading ? 0.5 : 1,
								cursor: verifyPhoneNumberLoading ? 'not-allowed' : 'pointer',
							}}
							disabled={verifyPhoneNumberLoading}
						>
							{verifyPhoneNumberLoading ? 'Verifying...' : 'Verify now'}
						</button>
					)
				)}
			</div>
		</div>
	);
};

export default memo(PhoneNumberInput);
