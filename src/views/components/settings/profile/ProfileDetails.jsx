import React, { memo, useState } from 'react';
import { getInitials } from '../../../../helpers/index';
import MySettingsChangePasword from '../../../features/settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as UserAccountSvg } from '../../../../assets/svg/settings/useraccount.svg';
import { ReactComponent as EmailSvg } from '../../../../assets/svg/settings/emailwhite.svg';
import { ReactComponent as GreenTickSvg } from '../../../../assets/svg/settings/TickCirclegree.svg';
import { ReactComponent as PencilkSvg } from '../../../../assets/svg/settings/pencilwhite.svg';
import UploadAvatarPopupComponent from './UploadAvatarPopup';
import UploadFileProiflePopup from './UploadFileProiflePopup';
import Cropper from 'react-easy-crop';

// profile details component
const ProfileDetailsComponent = ({
	userDetails,
	errors,
	handleChange,
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
								{getInitials(
									userDetailsData?.firstName,

									userDetailsData?.lastName,
								)}
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
					<div className="details">
						<div>
							<div className="full_name_div">
								<p>{userDetails?.fullName || ''}</p>

								<span className="point"></span>
								<p className="role">{role || ''}</p>
							</div>

							<p>{userDetails?.email}</p>
						</div>
					</div>
				</div>

				<div className="profileBody">
					<div className="name_phone_container">
						<div>
							<div className="iconAlignclass">
								<UserAccountSvg />

								<input
									type="text"
									placeholder={'Enter the Name'}
									value={userDetails?.fullName}
									name="fullName"
									onChange={handleChange}
									required
								/>
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
									onChange={(e) =>
										handleChange({ target: { name: 'phoneNumber', value: e } })
									}
								/>
							</div>
							{errors?.phoneNumber && (
								<p className="errorMessage">{errors?.phoneNumber}</p>
							)}
						</div>
					</div>
					<div>
						<div className="iconAlignclass">
							<EmailSvg />

							<input
								type="text"
								placeholder={'Enter the Name'}
								value={userDetails?.email}
								disabled={true}
								readOnly={true}
								required
							/>

							<GreenTickSvg />
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
