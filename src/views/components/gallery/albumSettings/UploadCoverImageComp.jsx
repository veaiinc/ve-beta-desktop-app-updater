import React, { useEffect, useState, memo } from 'react';
import { ReactComponent as LaptopLogo } from '../../../../assets/svg/gallery/laptop.svg';
import mobile from '../../../../assets/svg/gallery/mobile.png';
import Cropper from 'react-easy-crop';
import { FocusedImage, FocusPicker } from 'image-focus';
const UploadCoverImage = ({
	info,
	setInfo,
	fileInputRef,
	uploadAlbumCoverChangeHandler,
	handleSetCoverPosition,
}) => {
	const [focusInfo, setFocusInfo] = useState({
		focalPoint: { x: info?.crop?.x, y: info?.crop?.y },
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
		<>
			<p className="title">Album Cover</p>
			{info?.coverPhoto && (
				<div className="album-cover-container">
					<div className="album-preview">
						<div className="laptop-preview">
							<div className="screen">
								{/* <img src={imageURL} alt="image" /> */}
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
						className="album-cover-image "
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
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
								// console.log('Cropped area:', croppedAreaPixels);
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
						fileInputRef.current.click();
					}}
				>
					Upload cover photo
				</p>

				<input
					ref={fileInputRef}
					type="file"
					hidden
					onChange={uploadAlbumCoverChangeHandler}
				/>

				{info?.coverPhoto && (
					<p className="bt" onClick={() => handleSetCoverPosition(focusInfo?.focalPoint)}>
						Set cover position
					</p>
				)}
			</div>
		</>
	);
};

export default memo(UploadCoverImage);
