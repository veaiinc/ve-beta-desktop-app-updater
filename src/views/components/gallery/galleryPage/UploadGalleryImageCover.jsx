import React, { useEffect, useState, memo } from 'react';
import { ReactComponent as DesktopIcon } from '../../../../assets/svg/gallery/desktopIcon.svg';
import mobile from '../../../../assets/svg/gallery/mobile.png';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/gallery/albumSettings.scss';
import '../../../../assets/scss/gallery/uploadGalleryImageCover.scss';
import Spinner from '../../loaders/Spinner';
import { isURL } from '../../../../helpers';
import { ReactComponent as MobileIcon } from '../../../../assets/svg/gallery/mobileIcon.svg';
import { Slider } from 'antd';
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
	showUploadPhoto,
	uploadImageLoader,
}) => {
	const [focusInfo, setFocusInfo] = useState({
		focalPoint: { x: info?.crop?.x || 0, y: info?.crop?.y || 0 },
	});
	const [viewMode, setViewMode] = useState('desktop');
	const [isDragging, setIsDragging] = useState(false);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);

	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};

	useEffect(() => {
		setFocusInfo({
			focalPoint: { x: info?.crop?.x || 0, y: info?.crop?.y || 0 },
		});
	}, [info?.crop]);

	const handleMouseDown = (e) => {
		if (isURL(info?.imageURL)) {
			setIsDragging(true);
			setStartPos({
				x: e.clientX,
				y: e.clientY,
			});
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;

		const container = document.querySelector(
			viewMode === 'desktop' ? '.screen' : '.mobile-preview-container',
		);
		if (!container) return;

		const { width, height } = container.getBoundingClientRect();
		const deltaX = (e.clientX - startPos.x) / width; // Normalized movement in x
		const deltaY = (e.clientY - startPos.y) / height; // Normalized movement in y

		setFocusInfo((prev) => ({
			focalPoint: {
				x: Math.max(-1, Math.min(1, prev.focalPoint.x - deltaX)), // Update x independently
				y: Math.max(-1, Math.min(1, prev.focalPoint.y + deltaY)), // Update y independently
			},
		}));
		setStartPos({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const isImageExists = isURL(info?.imageURL);

	return (
		<ReactModal
			isOpen={open}
			closeModal={onClose}
			modalType="center"
			customStyles={customStyles}
		>
			<div id="upload-gallery-cover" className="settings-overview">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<p className="title">{title}</p>
					</div>
					<div>
						<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
				</div>
				<div className="uploadCoverTextContainer">
					<div className="uploadCoverText">
						Set gallery cover for Desktop and mobile individually
					</div>

					<div className="view-toggle">
						<button
							className={`toggle-button ${viewMode === 'mobile' ? 'active' : ''}`}
							onClick={() => setViewMode('mobile')}
						>
							<MobileIcon />
						</button>
						<button
							className={`toggle-button ${viewMode === 'desktop' ? 'active' : ''}`}
							onClick={() => setViewMode('desktop')}
						>
							<DesktopIcon />
						</button>
					</div>
				</div>

				{info?.coverPhoto && (
					<div className="album-cover-container">
						<div className="album-preview">
							{viewMode === 'desktop' ? (
								<div className="desktopPreview">
									<div
										className="screen"
										onMouseDown={handleMouseDown}
										onMouseMove={handleMouseMove}
										onMouseUp={handleMouseUp}
										onMouseLeave={handleMouseUp}
										style={{
											cursor: isDragging ? 'grabbing' : 'grab',
											overflow: 'hidden',
										}}
									>
										{isImageExists ? (
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
													// backgroundSize: 'cover',
													backgroundSize: 'auto',
													backgroundRepeat: 'no-repeat',
													transform: `scale(${scale})`,
													borderRadius: '12px',
												}}
											></div>
										) : (
											<div
												style={{
													width: '100%',
													height: '100%',
													color: 'var(--secondary-font)',
												}}
											>
												No selected Image
											</div>
										)}
									</div>
									{/* <LaptopLogo /> */}
								</div>
							) : (
								<div className="mobile-preview">
									{isImageExists && (
										<div
											className="mobile-preview-container"
											onMouseDown={handleMouseDown}
											onMouseMove={handleMouseMove}
											onMouseUp={handleMouseUp}
											onMouseLeave={handleMouseUp}
											style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
										>
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
													// backgroundSize: 'cover',
													backgroundSize: 'auto',
													backgroundRepeat: 'no-repeat',
													transform: `scale(${scale})`,
													borderRadius: '12px',
												}}
											></div>
										</div>
									)}
									{/* <img src={mobile} alt="mobile" className="mobile-logo" /> */}
								</div>
							)}
						</div>
					</div>
				)}
				<div className="uploadScaleContainer">
					<div className="uploadScaleText">Scale</div>
					<Slider
						min={100}
						max={300}
						defaultValue={scale * 100}
						style={{ width: '100%' }}
						tooltip={{ open: false }}
						onChange={(value) => setScale(value / 100)}
						trackStyle={{ backgroundColor: 'var(--primary-button)' }}
						railStyle={{ backgroundColor: 'var(--stroke)' }}
					/>
				</div>
				<div className="upload-cover-photo">
					{!showUploadPhoto && (
						<p
							className="bt"
							onClick={() => {
								if (!info?.activeAlbumId) {
									message.error('Please create a album first');
									return;
								}
								fileInputRef.current.click();
							}}
							style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
						>
							{uploadImageLoader ? <Spinner /> : 'Upload cover photo'}
						</p>
					)}
					<input
						ref={fileInputRef}
						type="file"
						onChange={(e) => uploadGalleryCoverChangeHandler(e, info?.imageURL)}
						accept={['image/png', 'image/jpeg']}
						hidden
						style={{ width: 0, visibility: 'hidden' }}
					/>
					{info?.coverPhoto && (
						<p
							className="bt"
							onClick={() => handleSetCoverPosition(focusInfo?.focalPoint)}
							style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
						>
							Set cover photo
						</p>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UploadGalleryImageCover);
