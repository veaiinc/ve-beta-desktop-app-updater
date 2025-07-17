import React, { memo, useState, useCallback } from 'react';
import ReactModal from '../../modalsV2';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import Cropper from 'react-easy-crop';
import { Slider } from 'antd';

const UploadFileProfilePopup = ({
	userDetails,
	userDetailsData,
	uploadAvatarPopup,
	setuploadAvatarPopup,
	updateProfileImage,
}) => {
	const closeModalFunc = () => {
		setuploadAvatarPopup((prev) => ({ ...prev, file: false }));
	};

	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(2);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	// This function captures the cropped area of the image
	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const handleZoomChange = (value) => {
		setZoom(value);
	};

	const submitImageHandlerButton = () => {
		updateProfileImage({
			crop: { ...crop },
			zoom,
		});
		closeModalFunc();
	};

	return (
		<ReactModal isOpen={uploadAvatarPopup?.file} closeModal={closeModalFunc}>
			<div className="uploadFileProfilePopup">
				<div className="headerPopup">
					<h1>Upload Avatar</h1>
					<span onClick={closeModalFunc}>
						<CloseSvg />
					</span>
				</div>

				<div className="cropBody">
					<div
						className="crop-container"
						style={{ position: 'relative', height: 120, width: 120 }}
					>
						<Cropper
							image={userDetails?.logoURL} // Image URL to crop
							crop={crop}
							zoom={zoom}
							aspect={1} // Square aspect ratio
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
							cropShape="round"
						/>
					</div>

					{/* Slider for zoom control */}
					<div className="sliderDiv">
						<Slider
							min={1}
							max={3}
							step={0.1}
							value={zoom}
							onChange={handleZoomChange}
							tooltipVisible={false}
						/>
					</div>
				</div>

				<div>
					<button className="saveChangeButton" onClick={submitImageHandlerButton}>
						Upload Avatar
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UploadFileProfilePopup);
