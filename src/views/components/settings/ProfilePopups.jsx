import React, { useState } from 'react';
import ReactModal from '../modalsV2';
import { getInitials } from '../../features/profile_settings/getInitials';
import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/workspaceSettings/plus-button.svg';

const ColorsList = [
	'#6055EC',
	'#D36262',
	'#DFD57C',
	'#768ECB',
	'#EF4E7E',
	'#FF4E4E',
	'#C49581',
	'#8ACEBA',
	'#24624F',
];

export const UploadAvatarPopupComponent = ({
	userDetails,
	userDetailsData,
	uploadAvatarPopup,
	setuploadAvatarPopup,
}) => {
	const [openTheme, setopenTheme] = useState(false);
	const closeModalFunc = () => {
		openTheme ? setopenTheme(false) : setuploadAvatarPopup(false);
	};
	return (
		<div>
			<ReactModal isOpen={uploadAvatarPopup} closeModal={closeModalFunc}>
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
								{ColorsList?.map((singleColor) => (
									<div
										style={{ background: singleColor }}
										className="colorCircleDiv"
									></div>
								))}
							</div>

							<br />

							<button>
								{' '}
								<span className="addIcon">
									<PlusSvg />
								</span>
								<span>Add Custom Avatar</span>
							</button>
							<br />
						</div>
					) : (
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

							<div className="editImage" onClick={() => setopenTheme(true)}>
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
					)}

					<div>
						<button>Save Changes</button>
					</div>
				</div>
			</ReactModal>
		</div>
	);
};
