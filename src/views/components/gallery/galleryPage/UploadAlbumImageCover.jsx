import React, { useEffect, useState } from 'react';
import { ReactComponent as LaptopLogo } from '../../../../assets/svg/gallery/laptop.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import mobile from '../../../../assets/svg/gallery/mobile.png';
import { FocusedImage, FocusPicker } from 'image-focus';
import '../../../../assets/scss/gallery/uploadGalleryImageCover.scss';

const UploadGalleryImageCover = ({
	info,
	setInfo,
	fileInputRef,
	uploadGalleryCoverChangeHandler,
	handleSetCoverPosition,
	message,
	title,
	coverImageUrl,
	onClose,
}) => {
	const [focusInfo, setFocusInfo] = useState({
		focalPoint: { x: 0, y: 0 },
	});

	useEffect(() => {
		setCoverPosition();
	}, [info?.imageURL]);

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
			if (focusPickerEl) {
				const focusPicker = new FocusPicker(focusPickerEl, {
					onChange: (focus) => {
						focusedImage.setFocus(focus);
						setFocusInfo({
							focalPoint: focus,
						});
					},
				});
			}
		}
	};

	return (
		<div id="upload-gallery-cover" className="settings-overview" style={{ width: '1011px' }}>
			<div
				className="title-container"
				style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<p className="title">{title}</p>
				<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
			</div>
			{info?.coverPhoto && (
				<div className="album-cover-container">
					<div className="album-preview">
						<div className="mobile-preview">
							<div
								className="mobile-preview-container"
								style={{
									backgroundImage: coverImageUrl
										? `url(${coverImageUrl})`
										: `url(${info?.imageURL})`,
									backgroundPosition: focusInfo?.focalPoint?.x
										? `${focusInfo?.focalPoint?.x * 50 + 50}% ${
												50 - focusInfo?.focalPoint?.y * 50
										  }%`
										: 'center',
									backgroundSize: 'cover',
									backgroundRepeat: 'no-repeat',
								}}
							/>
						</div>
						<div className="laptop-preview">
							<div
								style={{
									width: '100%',
									height: '100%',
									backgroundImage: coverImageUrl
										? `url(${coverImageUrl})`
										: `url(${info?.imageURL})`,
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
					</div>
				</div>
			)}
			<div className="upload-cover-photo">
				<p
					className="bt"
					onClick={() => {
						if (!info?.activeAlbumId) {
							message.destroy();
							message.error('Please create an album first');
							return;
						}
						setInfo((prev) => ({
							...prev,
							coverPhoto: true,
							coverImageDetails: null,
							imageURL: '',
							uploadImageId: null,
						}));
						fileInputRef.current.click();
					}}
					style={{ cursor: 'pointer' }}
				>
					Upload cover photo
				</p>

				<input
					ref={fileInputRef}
					type="file"
					onChange={uploadGalleryCoverChangeHandler}
					accept="image/png,image/jpeg,image/jpg"
					style={{ display: 'none' }}
				/>
				{info?.coverPhoto && (
					<p
						className="bt"
						style={{ cursor: 'pointer' }}
						onClick={() => handleSetCoverPosition(focusInfo?.focalPoint)}
					>
						Set cover Image
					</p>
				)}
			</div>
		</div>
	);
};

export default UploadGalleryImageCover;
