import { memo, useMemo, useState } from 'react';
import Spinner from '../loaders/Spinner';
import Skeleton from 'react-loading-skeleton';
import PhoneInput from 'react-phone-number-input';
import CustomOtp from '../globalComponents/CustomOtp';
import '../../../assets/scss/otp_input/otp_input.scss';
import InfoToolTip from './InfoToolTip';
const infoText = 'No spam. Just for setup, updates, and important notifications';

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
}) => {
	const otpArray = useMemo(() => otp?.split('')?.concat(Array(4).fill(''))?.slice(0, 4), [otp]);
	return (
		<div className={`phoneNumberInputContainer ${!isPhoneNumberVerified ? 'show' : ''}`}>
			<div className={`phoneInputContainer ${otpSent ? 'disabled' : ''}`}>
				<p className="question">
					Enter your phone number <InfoToolTip text={infoText} />
				</p>
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
							disabled={otpSent}
						/>
					)}
				</div>
			</div>

			<div className={`phoneInputOtpInputContainer  ${otpSent ? 'show' : ''}`}>
				<p className="otpContainerText">
					<span className="infoIcon">i</span>A 4-digit verification code has been sent to
					<span className="phoneNumberHighlight">{phoneNumber}</span>
				</p>
				<div className="verification-code-input-container">
					<CustomOtp
						otp={otpArray}
						setOtp={(otpArray) => handleSetOTP(otpArray.join(''))}
						error={''}
					/>
				</div>
				<div className="otpActionsContainer">
					{verifyOtpLoader ? (
						<Spinner width={'32px'} height={'32px'} cssstyle={{ margin: '0px auto' }} />
					) : (
						<>
							<button
								className="otpResendBtn"
								onClick={handleResendOtp}
								style={{
									opacity: resendOtpLoading ? 0.5 : 1,
									cursor: resendOtpLoading ? 'not-allowed' : 'pointer',
								}}
								disabled={resendOtpLoading}
							>
								{resendOtpLoading ? 'Resending...' : 'Resend code'}
							</button>
							<button className="changeNumberBtn" onClick={handleSetOTPSentToFalse}>
								Change number?
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(PhoneNumberInput);
