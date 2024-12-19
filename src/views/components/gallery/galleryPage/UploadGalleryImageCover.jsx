import React, { useEffect, useState, memo } from 'react';
import { ReactComponent as LaptopLogo } from '../../../../assets/svg/gallery/laptop.svg';
import mobile from '../../../../assets/svg/gallery/mobile.png';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import Cropper from 'react-easy-crop';
import ReactModal from '../../modalsV2/index';
import { FocusedImage, FocusPicker } from 'image-focus';
import '../../../../assets/scss/gallery/albumSettings.scss';

const UploadGalleryImageCover = ({
	info,
	setInfo,
	fileInputRef,
	title,
	uploadGalleryCoverChangeHandler,
	handleSetCoverPosition,
	message,
	isLoading,
	open,
	onClose,
}) => {
	const [focusInfo, setFocusInfo] = useState({
		focalPoint: { x: 0, y: 0 },
	});
	useEffect(() => {
		setCoverPosition();
	}, [info]);
	useEffect(() => {
		setFocusInfo({
			focalPoint: { x: info?.crop?.x, y: info?.crop?.y },
		});
	}, [info?.crop]);

	const setCoverPosition = () => {
		const imgEl = document.querySelector('.focused-image');
		if (imgEl) {
			const focusedImage = new FocusedImage(imgEl);
			const focusPickerEl = document.querySelector('.focus-picker-img');
			const focusPicker = new FocusPicker(focusPickerEl, {
				onChange: (focus) => {
					focusedImage.setFocus(focus);
					setFocusInfo({
						focalPoint: focus,
					});
				},
			});
		}
	};
	return (
		<ReactModal
			isOpen={open}
			closeModal={onClose}
			modalType="center"
			customStyles={{ content: { top: '55%' } }}
		>
			<div div id="upload-gallery-cover" className="settings-overview">
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<p className="title">{title}</p>
					<div>
						<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
				</div>
				{info?.coverPhoto && (
					<div className="album-cover-container">
						<div className="album-preview">
							<div className="laptop-preview">
								<div className="screen">
									<div
										style={{
											width: '100%',
											height: '100%',
											backgroundImage: `url(${info?.imageURL})`,
											backgroundPosition: focusInfo?.focalPoint?.x
												? `${focusInfo?.focalPoint?.x * 50 + 50}% ${
														50 - focusInfo?.focalPoint?.y * 50
												  }%`
												: 'center',
											backgroundSize: 'cover',
											backgroundRepeat: 'no-repeat',
										}}
									></div>
								</div>
								<LaptopLogo />
							</div>
							<div className="mobile-preview">
								<div
									className="mobile-preview-container"
									style={{
										backgroundImage: `url(${info?.imageURL})`,
										backgroundPosition: focusInfo?.focalPoint?.x
											? `${focusInfo?.focalPoint?.x * 50 + 50}% ${
													50 - focusInfo?.focalPoint?.y * 50
											  }%`
											: 'center',
										backgroundSize: 'cover',
										backgroundRepeat: 'no-repeat',
									}}
								>
									{/* <img src={imageURL} alt="mobile" /> */}
								</div>
								<img src={mobile} alt="mobile" className="mobile-logo" />
							</div>
						</div>
						<div
							className="album-cover-image"
							style={{ display: 'flex', alignItems: 'center' }}
						>
							{/* <Cropper
							image={info?.imageURL}
							crop={info?.crop}
							zoom={info?.zoom}
							aspect={228 / 370}
							onCropChange={(cropValue) =>
								setInfo((prev) => ({
									...prev,
									crop: cropValue,
								}))
							}
							onCropComplete={(croppedArea, croppedAreaPixels) => {
								// You can store croppedAreaPixels if you need the final crop dimensions
							}}
							onZoomChange={(zoomValue) =>
								setInfo((prev) => ({
									...prev,
									zoom: zoomValue,
								}))
							}
							showGrid={false}
							cropSize={{ width: 233.8432, height: 402.667 }}
						/> */}
							<div className="focused-image">
								<img
									className="focus-picker-img"
									src={info?.imageURL}
									alt="cover"
									style={{ width: '100%', objectFit: 'cover' }}
								/>
							</div>
						</div>
					</div>
				)}
				<div className="upload-cover-photo">
					<p
						className="bt"
						onClick={() => {
							if (!info?.activeAlbumId) {
								message.destroy();
								message.error('Please create a album first');
								return;
							} else {
								setInfo((prev) => ({
									...prev,
									coverPhoto: true,
									coverImageDetails: null,
									imageURL: '',
									uploadImageId: null,
								}));

								fileInputRef.current.click();
							}
						}}
						style={{ cursor: 'pointer' }}
					>
						Upload cover photo
					</p>

					<input
						ref={fileInputRef}
						type="file"
						onChange={uploadGalleryCoverChangeHandler}
						accept={['image/png', 'image/jpeg']}
						hidden
						style={{ width: 0, visibility: 'hidden' }}
						// style={{ visibility: 'hidden' }}
					/>

					{info?.coverPhoto && (
						<p
							className="bt"
							onClick={() => handleSetCoverPosition(focusInfo?.focalPoint)}
							style={{ cursor: 'pointer' }}
						>
							Set cover position
						</p>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UploadGalleryImageCover);
