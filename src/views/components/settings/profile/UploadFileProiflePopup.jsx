import React, { memo, useState } from 'react';
import ReactModal from '../../modalsV2';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as CloudFileUploadSvg } from '../../../../assets/svg/Settings/CloudUpload.svg';
import Dropzone from 'react-dropzone';

const UploadFileProfilePopup = ({
	userDetails,
	userDetailsData,
	uploadAvatarPopup,
	setuploadAvatarPopup,
}) => {
	const [openCrop, setopenCrop] = useState(false);
	const closeModalFunc = () => {
		openCrop ? setopenCrop(false) : setuploadAvatarPopup((prev) => ({ ...prev, file: false }));
	};

	return (
		<div>
			<ReactModal isOpen={uploadAvatarPopup?.file} closeModal={closeModalFunc}>
				<div className="uploadFileProfilePopup">
					<div className="headerPopup">
						<h1>Upload Avatar</h1>
						<span onClick={closeModalFunc}>
							<CloseSvg />
						</span>
					</div>

					{openCrop ? (
						<div className="">Crop Div</div>
					) : (
						<div className="">
							<Dropzone
								// onDrop={checkUploadLogo}
								accept={'image/png'}
								multiple={false}
								// disabled={!isAdmin}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										className="upload-brand-embeded-btn"
										{...getRootProps()}
										// style={{ cursor: !isAdmin ? 'not-allowed' : '' }}
									>
										<input {...getInputProps()} />
										<div className="upload-brand-placeholder">
											<input
												type="file"
												style={{
													opacity: 0,
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													cursor: 'pointer',
												}}
											/>
											<div className="icon_name_div">
												{' '}
												<CloudFileUploadSvg />
												<p>Upload image</p>
											</div>
										</div>
									</div>
								)}
							</Dropzone>
						</div>
					)}

					<div>
						<button className="saveChangeButton">Upload Avatar</button>
					</div>
				</div>
			</ReactModal>
		</div>
	);
};

export default memo(UploadFileProfilePopup);
