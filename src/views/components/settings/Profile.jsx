import React, { useState } from 'react';
import '../../../assets/scss/AccountSettings/myProfile.scss';
import { getInitials } from '../../features/profile_settings/getInitials';
import ToggleSlider from '../../components/input/slider';
import ReusableButtonSettings from '../../features/workspace_settings/ReusableButtonSettings';
import MySettingsChangePasword from '../../features/profile_settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { UploadAvatarPopupComponent } from './ProfilePopups';

// profile details component
export const ProfileDetailsComponent = ({
	handleSubmit,
	handleEditClick,
	isEditMode,
	userDetails,
	errors,
	handleChange,
	userDetailsData,
	showForm,
	handleImageChange,
	handlePopupFormClose,
}) => {
	const [uploadAvatarPopup, setuploadAvatarPopup] = useState(false);

	return (
		<>
			<form onSubmit={handleSubmit} className={`${'formsMain'} `}>
				<div className="profileHeader">
					<div className="imageCircleDiv">
						{!userDetails?.logoURL ? (
							<img
								src={userDetails?.logoURL}
								alt="logo"
								onError={(e) =>
									(e.target.src =
										'https://randomuser.me/api/portraits/men/75.jpg')
								}
							/>
						) : (
							<div className="noImageText">
								{getInitials(
									userDetailsData?.firstName,

									userDetailsData?.lastName,
								)}
							</div>
						)}

						<div className="editImage" onClick={() => setuploadAvatarPopup(true)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="15"
								viewBox="0 0 15 14"
								fill="none"
							>
								<path
									d="M3.85354 9.81771H4.41632L9.39683 4.87207L8.83405 4.31323L3.85354 9.25886V9.81771ZM3.19531 10.4713V8.98334L9.4943 2.71878C9.5624 2.64973 9.63569 2.60058 9.71417 2.57134C9.79265 2.54201 9.87489 2.52734 9.96088 2.52734C10.047 2.52734 10.1291 2.54104 10.2073 2.56845C10.2856 2.59585 10.3615 2.64437 10.4348 2.714L11.0025 3.27285C11.0727 3.34567 11.1223 3.42108 11.1515 3.4991C11.1807 3.57711 11.1953 3.65743 11.1953 3.74006C11.1953 3.82813 11.18 3.91218 11.1492 3.9922C11.1184 4.07223 11.0695 4.14539 11.0025 4.21167L4.69379 10.4713H3.19531ZM9.1105 4.59756L8.83405 4.31323L9.39683 4.87207L9.1105 4.59756Z"
									fill="#E8EAED"
								/>
							</svg>
						</div>
					</div>
					<div className="details">
						<div>
							<div className="full_name_div">
								<p>{userDetails?.fullName || ''}</p>

								<span className="point"></span>
								<p className="role">{userDetails?.fullName || ''}</p>
							</div>

							<p>{userDetails?.email}</p>
						</div>
					</div>
				</div>

				<div className="profileBody">
					<div className="name_phone_container">
						<div className="iconAlignclass">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 18 18"
									fill="none"
								>
									<path
										d="M8.99999 1C4.5816 1 1 4.5816 1 8.99999C1 13.4184 4.5816 17 8.99999 17C13.4184 17 17 13.4184 17 8.99999C17 4.5816 13.4184 1 8.99999 1Z"
										stroke="#E4E5E6"
										stroke-width="0.875"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M2.81641 14.0721C2.81641 14.0721 4.5996 11.7953 8.9996 11.7953C13.3996 11.7953 15.1836 14.0721 15.1836 14.0721M8.9996 8.99531C9.63612 8.99531 10.2466 8.74245 10.6967 8.29236C11.1467 7.84228 11.3996 7.23183 11.3996 6.59531C11.3996 5.95879 11.1467 5.34834 10.6967 4.89826C10.2466 4.44817 9.63612 4.19531 8.9996 4.19531C8.36308 4.19531 7.75263 4.44817 7.30255 4.89826C6.85246 5.34834 6.5996 5.95879 6.5996 6.59531C6.5996 7.23183 6.85246 7.84228 7.30255 8.29236C7.75263 8.74245 8.36308 8.99531 8.9996 8.99531Z"
										stroke="#E4E5E6"
										stroke-width="0.875"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>

							<input
								type="text"
								placeholder={'Enter the Name'}
								value={userDetails?.fullName}
								required
							/>
						</div>

						<div className="iconAlignclass  phoneDiv">
							{/* <span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 18 18"
									fill="none"
								>
									<path
										d="M8.99999 1C4.5816 1 1 4.5816 1 8.99999C1 13.4184 4.5816 17 8.99999 17C13.4184 17 17 13.4184 17 8.99999C17 4.5816 13.4184 1 8.99999 1Z"
										stroke="#E4E5E6"
										stroke-width="0.875"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M2.81641 14.0721C2.81641 14.0721 4.5996 11.7953 8.9996 11.7953C13.3996 11.7953 15.1836 14.0721 15.1836 14.0721M8.9996 8.99531C9.63612 8.99531 10.2466 8.74245 10.6967 8.29236C11.1467 7.84228 11.3996 7.23183 11.3996 6.59531C11.3996 5.95879 11.1467 5.34834 10.6967 4.89826C10.2466 4.44817 9.63612 4.19531 8.9996 4.19531C8.36308 4.19531 7.75263 4.44817 7.30255 4.89826C6.85246 5.34834 6.5996 5.95879 6.5996 6.59531C6.5996 7.23183 6.85246 7.84228 7.30255 8.29236C7.75263 8.74245 8.36308 8.99531 8.9996 8.99531Z"
										stroke="#E4E5E6"
										stroke-width="0.875"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span> */}

							<PhoneInput
								defaultCountry={'IN'}
								placeholder={'Enter Phone Number'}
								value={userDetails?.phoneNumber || ''}
								// onChange={(e) => onChange({ target: { name: name, value: e } })}
								// disabled={}
							/>
						</div>
					</div>
					<div>
						<div className="iconAlignclass">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M3.7563 15.5846C3.38116 15.5846 3.06407 15.4551 2.80505 15.1959C2.54602 14.9367 2.4165 14.6194 2.4165 14.244V5.75193C2.4165 5.37651 2.54602 5.06033 2.80505 4.80339C3.06407 4.54644 3.38116 4.41797 3.7563 4.41797H16.2434C16.6185 4.41797 16.9356 4.54755 17.1946 4.80672C17.4537 5.06588 17.5832 5.38318 17.5832 5.75859V14.2507C17.5832 14.6261 17.4537 14.9423 17.1946 15.1992C16.9356 15.4562 16.6185 15.5846 16.2434 15.5846H3.7563ZM9.99984 10.6328L3.49984 6.80734V14.2448C3.49984 14.3197 3.52387 14.3812 3.57192 14.4292C3.61998 14.4773 3.68143 14.5013 3.7563 14.5013H16.2434C16.3182 14.5013 16.3797 14.4773 16.4278 14.4292C16.4758 14.3812 16.4998 14.3197 16.4998 14.2448V6.80734L9.99984 10.6328ZM9.99984 9.23047L16.3717 5.5013H3.62796L9.99984 9.23047ZM3.49984 6.80734V5.5013V14.2448C3.49984 14.3197 3.52387 14.3812 3.57192 14.4292C3.61998 14.4773 3.68143 14.5013 3.7563 14.5013H3.49984V6.80734Z"
										fill="#E4E5E6"
									/>
								</svg>
							</span>

							<input
								type="text"
								placeholder={'Enter the Name'}
								value={userDetails?.email}
								required
							/>

							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M8.92154 12.7128L13.6074 8.04776L12.8334 7.2738L8.92154 11.1648L7.15071 9.41484L6.37675 10.1888L8.92154 12.7128ZM10.0015 17.5846C8.9621 17.5846 7.98147 17.3873 7.05966 16.9926C6.13786 16.5978 5.33105 16.0547 4.63925 15.3632C3.94744 14.6716 3.40404 13.8652 3.00904 12.9438C2.61418 12.0224 2.41675 11.0421 2.41675 10.0028C2.41675 8.94943 2.61411 7.96533 3.00883 7.05047C3.40355 6.13561 3.94668 5.33227 4.63821 4.64047C5.32973 3.94866 6.13619 3.40526 7.05758 3.01026C7.97897 2.6154 8.95932 2.41797 9.99862 2.41797C11.052 2.41797 12.0361 2.61533 12.9509 3.01005C13.8658 3.40477 14.6691 3.9479 15.3609 4.63943C16.0527 5.33096 16.5961 6.13394 16.9911 7.04839C17.386 7.96283 17.5834 8.94665 17.5834 9.99984C17.5834 11.0393 17.3861 12.0199 16.9913 12.9417C16.5966 13.8635 16.0535 14.6703 15.362 15.3621C14.6704 16.0539 13.8674 16.5973 12.953 16.9923C12.0386 17.3872 11.0547 17.5846 10.0015 17.5846ZM10.0001 16.5013C11.8056 16.5013 13.3404 15.8694 14.6042 14.6055C15.8681 13.3416 16.5001 11.8069 16.5001 10.0013C16.5001 8.19575 15.8681 6.66102 14.6042 5.39714C13.3404 4.13325 11.8056 3.5013 10.0001 3.5013C8.19453 3.5013 6.6598 4.13325 5.39591 5.39714C4.13203 6.66102 3.50008 8.19575 3.50008 10.0013C3.50008 11.8069 4.13203 13.3416 5.39591 14.6055C6.6598 15.8694 8.19453 16.5013 10.0001 16.5013Z"
										fill="#006B25"
										fill-opacity="0.64"
									/>
								</svg>
							</span>
						</div>
					</div>
				</div>
			</form>

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}

			<UploadAvatarPopupComponent
				userDetails={userDetails}
				userDetailsData={userDetailsData}
				uploadAvatarPopup={uploadAvatarPopup}
				setuploadAvatarPopup={setuploadAvatarPopup}
			/>
		</>
	);
};

// theme preference component
export const ThemePreferenceComponent = ({ setActiveTheme, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme performance</h4>
			<div>
				<button
					className={activeTheme === 'system' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('system')}
				>
					Follow system preferences
				</button>
				<button
					className={activeTheme === 'light' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('light')}
				>
					Light
				</button>
				<button
					className={activeTheme === 'dark' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('dark')}
				>
					Dark
				</button>
			</div>
		</div>
	);
};

// update password component
export const UpdatePasswordComponent = ({ handleFormPopUp }) => {
	return (
		<div className={'accessContainer'}>
			<div className={'accessInfo'}>
				<h4>Strengthen your Account Security</h4>
				<p>
					As you've signed up through Google, we suggest adding a password for extra
					security.
				</p>
				{/* <button>Update my password</button> */}
				<ReusableButtonSettings
					text={'Update my password'}
					func={() => handleFormPopUp()}
				/>
			</div>
		</div>
	);
};

// two factor authentication component
export const TwoFactorAuthenticationComponent = ({ toggleEnable, userDetails, qrcode }) => {
	return (
		<div className={'twoFactorAuthMain'}>
			<div className={'twoFactorAuthText'}>
				<h4>Two Factor Authentication</h4>
				<p>
					Boost your account security effortlessly with two-factor authentication (2FA).
					Simply use your password along with a code from your phone or an app. This extra
					step makes it tough for hackers to break in, ensuring your peace of mind.
				</p>
			</div>
			<div className={'switchStep'}>
				<div className={'switchToggle'}>
					<p>Enable Two Factor Authentication</p>
					<ToggleSlider onChange={toggleEnable} value={userDetails?.is2FAEnabled} />
				</div>

				{userDetails?.is2FAEnabled ? (
					<div className={'toggleOptions'}>
						<div className={`${'step'} ${'stepOne'}`}>
							<h4>STEP 1</h4>
							<p>Install an authenticator app on your mobile device</p>
						</div>
						<div className={`${'step'} ${'stepTwo'}`}>
							<h4>STEP 2</h4>
							<div>
								<p>Scan the following QR code in your authenticator app</p>

								<img src={qrcode?.qrCode} alt="" />
							</div>
						</div>
						<div className={`${'step'} `}>
							<h4>STEP 3</h4>
							<div className={'stepThree'}>
								<p>Enter the code from your authenticator app below</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
						<div className={`${'step'}`}>
							<h4>STEP 4</h4>
							<div className={'stepFour'}>
								<p>Install an authenticator app on your mobile device</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export const LeaveWorkspaceComponent = () => {
	return (
		<div className={'accessContainer'}>
			<div className={'leaveComponent'}>
				<h4>Do you want to leave your workspace?</h4>
				<p>
					When you leave your workspace, your work will be lost, and your team will be
					notified. Select a workspace you would like to leave
				</p>
			</div>
		</div>
	);
};
