import React, { memo, useState, useRef } from 'react';
import ReactModal from '../../modalsV2';
import { getInitials } from '../../../features/profile_settings/getInitials';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import { ReactComponent as PlusSvgColor } from '../../../../assets/svg/Settings/Plus#6055ec.svg';
import { ReactComponent as PencilSvg } from '../../../../assets/svg/Settings/pencilwhite.svg';
import { avatarColorList } from '../../../features/settings/indexConstant';
import Dropzone from 'react-dropzone';

const UploadAvatarPopupComponent = ({
	userDetails,
	userDetailsData,
	uploadAvatarPopup,
	setuploadAvatarPopup,
	handleImageChange,
}) => {
	const fileInputRef = useRef(null);
	const [openTheme, setopenTheme] = useState(false);
	const [hover, sethover] = useState(false);

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
								{avatarColorList?.map((singleColor) => (
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

					<Dropzone
						onDrop={handleImageChange}
						accept={'image/png'}
						multiple={false}
						// disabled={!isAdmin}
					>
						{({ getRootProps, getInputProps }) => (
							<div
								className="customAvatarButton"
								{...getRootProps()}
								onMouseEnter={() => sethover(true)}
								onMouseLeave={() => sethover(false)}
							>
								<input {...getInputProps()} />

								<span className="addIcon">
									{hover ? <PlusSvgColor /> : <PlusSvg />}
								</span>
								<span> Add Custom Avatar</span>
							</div>
						)}
					</Dropzone>

					<div>
						<button className="saveChangeButton">Save Changes</button>
					</div>
				</div>
			</ReactModal>
		</div>
	);
};

export default memo(UploadAvatarPopupComponent);
