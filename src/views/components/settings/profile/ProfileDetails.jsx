import React, { memo, useContext, useState } from 'react';
import { getInitials } from '../../../../helpers/index';
import MySettingsChangePasword from '../../../features/settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as GreenTickSvg } from '../../../../assets/svg/Settings/TickCirclegree.svg';
import { ReactComponent as PencilkSvg } from '../../../../assets/svg/Settings/pencilwhite.svg';
import UploadAvatarPopupComponent from './UploadAvatarPopup';
import UploadFileProiflePopup from './UploadFileProiflePopup';
import Cropper from 'react-easy-crop';
import Context from '../../../../context/context';
import UserSvg from '../../../../assets/svg/Settings/UserSvg';
import EmailSvg from '../../../../assets/svg/Settings/EmailSvg';

// profile details component
const ProfileDetailsComponent = ({
	fullNameRef,
	userDetails,
	errors,
	handleUsernameAndPhoneNumberUpdate,
	userDetailsData,
	showForm,
	updateProfileImage,
	handlePopupFormClose,
	role,
	setUserDetails,
	setlogoFile,
	updateDpThemeHandler,
}) => {
	const [uploadAvatarPopup, setuploadAvatarPopup] = useState({ theme: false, file: false });
	const {
		themeInfo: { theme },
	} = useContext(Context);

	const handleImageChange = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUserDetails({
					...userDetails,
					logoURL: reader.result,
				});
			};
			reader.readAsDataURL(file);

			setuploadAvatarPopup((prev) => ({ ...prev, theme: false, file: true }));
			setlogoFile(file);
		}
	};

	return (
		<>
			<div className={`${'formsMain'} `}>
				<h2 className="profile-title">My Profile </h2>
				<div className="profileHeader">
					<div className="imageCircleDiv">
						{userDetails?.logoURL ? (
							<div className="crop-container">
								<Cropper
									image={userDetails?.logoURL} // Image URL to crop
									crop={userDetails?.cropSettings?.crop}
									zoom={userDetails?.cropSettings?.zoom}
									showGrid={false}
									onCropChange={(e) => ''}
									onCropComplete={(e) => ''}
									onZoomChange={(e) => ''}
								/>
							</div>
						) : (
							<div
								className="noImageText"
								style={{
									background: userDetails?.cropSettings?.profileDpColor || '',
								}}
							>
								{getInitials(userDetailsData?.firstName, userDetailsData?.lastName)}
							</div>
						)}

						<div
							className="editImage"
							onClick={() =>
								setuploadAvatarPopup((prev) => ({ ...prev, theme: true }))
							}
						>
							<PencilkSvg />
						</div>
					</div>
					{/* <div className="details">
						<div>
							<div className="full_name_div">
								<p>{userDetails?.fullName || ''}</p>

								<span className="point"></span>
								<p className="role">{role || ''}</p>
							</div>

							<p>{userDetails?.email}</p>
						</div>
					</div> */}

					<div className="profileBody">
						<div>
							<div className="iconAlignclass">
								<UserSvg />
								<div className="input-container">
									<input
										ref={fullNameRef}
										type="text"
										placeholder={'Enter Your Full Name'}
										value={userDetails?.fullName}
										name="fullName"
										className="role-input"
										onChange={(e) =>
											handleUsernameAndPhoneNumberUpdate({
												type: 'fullName',
												value: e?.target?.value,
											})
										}
										required
									/>
									<p className="role">{role || ''}</p>
								</div>
							</div>
							{errors?.fullName && <p className="errorMessage">{errors?.fullName}</p>}
						</div>

						<div>
							<div className="iconAlignclass  phoneDiv">
								<PhoneInput
									defaultCountry={'IN'}
									placeholder={'Enter Phone Number'}
									value={userDetails?.phoneNumber || ''}
									name="phoneNumber"
									className="PhoneInput"
									onChange={(phoneNumber) =>
										handleUsernameAndPhoneNumberUpdate({
											type: 'phoneNumber',
											value: phoneNumber,
										})
									}
								/>
							</div>
							{errors?.phoneNumber && (
								<p className="errorMessage">{errors?.phoneNumber}</p>
							)}
						</div>
						<div>
							<div className="iconAlignclass">
								<EmailSvg />

								<input
									type="text"
									// placeholder={'Enter the Name'}
									value={userDetails?.email}
									disabled={true}
									readOnly={true}
									required
									className="profileEmailInput"
								/>

								<GreenTickSvg />
							</div>
						</div>
					</div>
				</div>
			</div>

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}

			<UploadAvatarPopupComponent
				userDetails={userDetails}
				userDetailsData={userDetailsData}
				uploadAvatarPopup={uploadAvatarPopup}
				setuploadAvatarPopup={setuploadAvatarPopup}
				handleImageChange={handleImageChange}
				updateDpThemeHandler={updateDpThemeHandler}
			/>

			<UploadFileProiflePopup
				userDetails={userDetails}
				userDetailsData={userDetailsData}
				uploadAvatarPopup={uploadAvatarPopup}
				setuploadAvatarPopup={setuploadAvatarPopup}
				updateProfileImage={updateProfileImage}
			/>
		</>
	);
};

export default memo(ProfileDetailsComponent);
