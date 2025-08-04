import React, { memo, useContext, useState } from 'react';
import MySettingsChangePasword from '../../../features/settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as GreenTickSvg } from '../../../../assets/svg/Settings/TickCirclegree.svg';
import UserSvg from '../../../../assets/svg/Settings/UserSvg';
import EmailSvg from '../../../../assets/svg/Settings/EmailSvg';
import { ReactComponent as ProfessionSvg } from '../../../../assets/svg/Settings/profession.svg';
import Cropper from 'react-easy-crop';
import { ReactComponent as PencilkSvg } from '../../../../assets/svg/pencilSimple.svg';
import UploadAvatarPopupComponent from './UploadAvatarPopup';
import UploadFileProiflePopup from './UploadFileProiflePopup';

// profile details component
const ProfileDetailsComponent = ({
	fullNameRef,
	userDetails,
	errors,
	handleUsernameAndPhoneNumberUpdate,
	showForm,
	handlePopupFormClose,
	role,
	workspaceName,
	userDetailsData,
	updateProfileImage,
	setUserDetails,
	setlogoFile,
	updateDpThemeHandler,
}) => {
	const [uploadAvatarPopup, setuploadAvatarPopup] = useState({ theme: false, file: false });
	const [logoFile, setlogoFileLocal] = useState(null);

	const getInitials = (firstName, lastName) => {
		const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
		const lastNameInitial = lastName ? lastName?.charAt(0) : '';
		const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
		return initials;
	};

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
			setlogoFileLocal(file);
			setlogoFile(file);
		}
	};

	const handleZoom = (zoom) => {
		setUserDetails((prev) => {
			return {
				...prev,
				cropSettings: {
					...prev.cropSettings,
					zoom,
				},
			};
		});
	};

	const handleCrop = (crop) => {
		setUserDetails((prev) => {
			return {
				...prev,
				cropSettings: {
					...prev.cropSettings,
					crop,
				},
			};
		});
	};

	return (
		<>
			<div className="formsMain">
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
										autoComplete="off"
										autofill="off"
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
							<div className="iconAlignclass phoneDiv">
								<PhoneInput
									defaultCountry={'IN'}
									placeholder={'Enter Phone Number'}
									value={userDetails?.phoneNumber || ''}
									name="phoneNumber"
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
							<div className="iconAlignclass profileEmailInput">
								<EmailSvg />

								<input
									type="text"
									// placeholder={'Enter the Name'}
									value={userDetails?.email}
									disabled={true}
									readOnly={true}
									required
								/>

								<GreenTickSvg />
							</div>
						</div>
						<div className="profession-label">
							Your profession in <span>{workspaceName}</span>
						</div>
						<div>
							<div className="iconAlignclass">
								<ProfessionSvg />
								<div className="input-container">
									<input
										type="text"
										placeholder={'Enter Your Profession'}
										value={userDetails?.profession || ''}
										name="profession"
										className="profession-input"
										autoComplete="off"
										autofill="off"
										onChange={(e) =>
											handleUsernameAndPhoneNumberUpdate({
												type: 'profession',
												value: e?.target?.value,
											})
										}
									/>
								</div>
							</div>
							{errors?.profession && (
								<p className="errorMessage">{errors?.profession}</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<UploadAvatarPopupComponent
				userDetails={userDetails}
				userDetailsData={userDetailsData}
				uploadAvatarPopup={uploadAvatarPopup}
				setuploadAvatarPopup={setuploadAvatarPopup}
				handleImageChange={handleImageChange}
				updateDpThemeHandler={updateDpThemeHandler}
				setZoom={handleZoom}
				setCrop={handleCrop}
			/>

			<UploadFileProiflePopup
				userDetails={userDetails}
				userDetailsData={userDetailsData}
				uploadAvatarPopup={uploadAvatarPopup}
				setuploadAvatarPopup={setuploadAvatarPopup}
				updateProfileImage={updateProfileImage}
			/>

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}
		</>
	);
};

export default memo(ProfileDetailsComponent);
