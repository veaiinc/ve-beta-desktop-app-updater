import { memo } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import PhoneInput from 'react-phone-input-2';
import { ReactComponent as DarkIcon } from '../../../assets/svg/onboarding/dark.svg';
import { ReactComponent as LightIcon } from '../../../assets/svg/onboarding/light.svg';
import { ReactComponent as GreenTick } from '../../../assets/svg/onboarding/green-tick.svg';
import { ReactComponent as UploadIcon } from '../../../assets/svg/onboarding/upload-icon.svg';
import { Tooltip } from 'antd';
import ToolTipContainer from '../popover/ToolTipContainer';
import Skeleton from 'react-loading-skeleton';

const themePreferences = [
	{
		id: 1,
		label: 'System Default',
		icon: null,
		value: 'systemDefault',
	},
	{
		id: 2,
		label: 'Dark',
		icon: <DarkIcon />,
		value: 'dark',
	},
	{
		id: 3,
		label: 'Light',
		icon: <LightIcon />,
		value: 'light',
	},
];

export const customContainerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'var(--card)',
};

export const contentStyling = {
	color: 'var(--primary-font)',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '12px',
	fontStyle: 'normal',
	fontWeight: '500',
	lineHeight: 'normal',
};

const UserDetailsForm = ({
	userDetailsLoading,
	username,
	phoneNumber,
	isPhoneNumberVerified,
	profilePicture,
	handleSetProfilePicture,
	countryCode,
	themePreference,
	handleSetUsername,
	handleSetPhoneNumber,
	handleSetThemePreference,
	handleVerifyPhoneNumber,
	otp,
	handleSetOTP,
	otpSent,
	handleSetOTPSentToFalse,
	handleResendOtp,
	resendOtpLoading,
	verifyPhoneNumberLoading,
}) => {
	return (
		<div className="stage1">
			<header className="header">
				<h1 className="title">Let's get started</h1>
				<h2 className="subtitle">Personalize your experience</h2>
			</header>
			<main className="stage1Content">
				<div className="nameInputContainer">
					<p className="question">What is your name?</p>
					{userDetailsLoading ? (
						<Skeleton width="100%" height="41px" />
					) : (
						<div className="nameInputAndProfilePictureContainer">
							<input
								className="nameInput"
								value={username}
								onChange={handleSetUsername}
								type="text"
								placeholder="Full Name"
								autoFocus
							/>
							<Tooltip
								title={
									<ToolTipContainer
										customContainerStyle={customContainerStyle}
										contentStyling={contentStyling}
										title={''}
										content={'Upload your profile picture'}
										removeClassName={true}
									/>
								}
								arrow={true}
								color={'var(--card)'}
							>
								<div className="profilePictureContainer">
									<label htmlFor="profilePictureInput">
										<input
											id="profilePictureInput"
											type="file"
											accept="image/*"
											onChange={handleSetProfilePicture}
											className="profilePictureInput"
										/>
										{profilePicture ? (
											<img
												src={profilePicture}
												alt={username}
												className="profilePicture"
											/>
										) : (
											<UploadIcon />
										)}
									</label>
								</div>
							</Tooltip>
						</div>
					)}
				</div>
				{otpSent ? (
					<div className="otpInputContainer">
						<p className="question">Enter the OTP that was sent to {phoneNumber}</p>
						<input
							className="otpInput"
							value={otp}
							placeholder="000000"
							onChange={handleSetOTP}
							type="text"
						/>
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
						{userDetailsLoading ? (
							<Skeleton width="100%" height="41px" />
						) : (
							<PhoneInput
								containerClass="phoneContainerClass"
								inputClass="phoneInputClass"
								placeholder="Enter phone number"
								value={phoneNumber}
								onChange={handleSetPhoneNumber}
								country={countryCode}
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
							<button
								onClick={handleVerifyPhoneNumber}
								className="verifyPhoneNumberBtn"
								style={{
									opacity: verifyPhoneNumberLoading ? 0.5 : 1,
									cursor: verifyPhoneNumberLoading ? 'not-allowed' : 'pointer',
								}}
								disabled={verifyPhoneNumberLoading}
							>
								{verifyPhoneNumberLoading ? 'Verifying...' : 'Verify Phone Number'}
							</button>
						)}
					</div>
				)}
				<div className="themeInputContainer">
					<p className="question">Select your theme preference</p>
					{userDetailsLoading ? (
						<Skeleton width="100%" height="41px" />
					) : (
						<div className="themeOptionsContainer">
							{themePreferences?.map((theme) => (
								<button
									className={`themeOption ${
										themePreference === theme?.value ? 'active' : ''
									}`}
									key={theme?.id}
									onClick={() => handleSetThemePreference(theme?.value)}
								>
									{theme?.icon}
									<span className="themeOptionLabel">{theme?.label}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default memo(UserDetailsForm);
