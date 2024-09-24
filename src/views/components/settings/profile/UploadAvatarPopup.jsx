import React, { memo, useState } from 'react';
import ReactModal from '../../modalsV2';
import { getInitials } from '../../../features/profile_settings/getInitials';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import { ReactComponent as PencilSvg } from '../../../../assets/svg/Settings/pencilwhite.svg';
import { AvatarColorList } from '../../../features/settings/indexConstant';

const UploadAvatarPopupComponent = ({
	userDetails,
	userDetailsData,
	uploadAvatarPopup,
	setuploadAvatarPopup,
}) => {
	const [openTheme, setopenTheme] = useState(false);
	const closeModalFunc = () => {
		openTheme
			? setopenTheme(false)
			: setuploadAvatarPopup((prev) => ({ ...prev, theme: false }));
	};
	return (
		<div>
			<ReactModal isOpen={uploadAvatarPopup?.theme} closeModal={closeModalFunc}>
				<div className="uploadAvatarPopupComponent">
					<div className="headerPopup">
						<h1>Upload Avatar</h1>
						<span onClick={closeModalFunc}>
							<CloseSvg />
						</span>
					</div>

					{openTheme ? (
						<div className="avatarColorContainer">
							<h4>Avatar color</h4>
							<div className="colorList">
								{AvatarColorList?.map((singleColor) => (
									<div
										style={{ background: singleColor }}
										className="colorCircleDiv"
									></div>
								))}
							</div>

							<br />

							<br />
						</div>
					) : (
						<div className="imageCircleDiv" onClick={() => setopenTheme(true)} z>
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

							<div className="editImage">
								<PencilSvg />
							</div>
						</div>
					)}

					{/* <button
						className="customAvatarButton"
						onClick={() => {
							setuploadAvatarPopup((prev) => ({ ...prev, theme: false, file: true }));
						}}
					>
						{' '}
						<span className="addIcon">
							<PlusSvg />
						</span>
						<span>Add Custom Avatar</span>
					</button> */}

					<div>
						<button className="saveChangeButton">Save Changes</button>
					</div>
				</div>
			</ReactModal>
		</div>
	);
};

export default memo(UploadAvatarPopupComponent);
