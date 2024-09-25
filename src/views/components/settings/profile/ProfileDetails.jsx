import React, { memo, useState } from 'react';
import { getInitials } from '../../../features/profile_settings/getInitials';
import MySettingsChangePasword from '../../../features/profile_settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as UserAccountSvg } from '../../../../assets/svg/Settings/useraccount.svg';
import { ReactComponent as EmailSvg } from '../../../../assets/svg/Settings/emailwhite.svg';
import { ReactComponent as GreenTickSvg } from '../../../../assets/svg/Settings/TickCirclegree.svg';
import { ReactComponent as PencilkSvg } from '../../../../assets/svg/Settings/pencilwhite.svg';

import UploadAvatarPopupComponent from './UploadAvatarPopup';
import UploadFileProiflePopup from './UploadFileProiflePopup';

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
		}
	};

	return (
		<>
			<div className={`${'formsMain'} `}>
				<div className="profileHeader">
					<div className="imageCircleDiv">
						{userDetails?.logoURL ? (
							<img src={userDetails?.logoURL} alt="logo" />
						) : (
							<div className="noImageText">
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
