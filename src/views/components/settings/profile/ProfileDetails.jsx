import React, { memo, useContext, useState } from 'react';
import MySettingsChangePasword from '../../../features/settings/MySettingsChangePasword';
import PhoneInput from 'react-phone-number-input';
import { ReactComponent as GreenTickSvg } from '../../../../assets/svg/Settings/TickCirclegree.svg';
import UserSvg from '../../../../assets/svg/Settings/UserSvg';
import EmailSvg from '../../../../assets/svg/Settings/EmailSvg';
import { ReactComponent as ProfessionSvg } from '../../../../assets/svg/Settings/profession.svg';
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
}) => {
	return (
		<>
			<div className="formsMain">
				<h2 className="profile-title">My Profile </h2>
				<div className="profileHeader">
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

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}
		</>
	);
};

export default memo(ProfileDetailsComponent);
