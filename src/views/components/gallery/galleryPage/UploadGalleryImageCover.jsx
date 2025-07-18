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
import { ReactComponent as HandGrabIcon } from '../../../../assets/svg/gallery/handGrabIcon.svg';
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
	coverLoading,
}) => {
	// Initialize separate focal points and zoom for desktop and mobile
	const [focusInfo, setFocusInfo] = useState({
		desktop: {
			focalPoint: { x: info?.crop?.desktop?.x || 0, y: info?.crop?.desktop?.y || 0 },
			zoom: info?.zoom?.desktop || 1,
		},
		mobile: {
			focalPoint: { x: info?.crop?.mobile?.x || 0, y: info?.crop?.mobile?.y || 0 },
			zoom: info?.zoom?.mobile || 1,
		},
	});
	const [isDragging, setIsDragging] = useState(false);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });

	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};

	// Get current screen type settings
	const currentScreenType = info?.selectedScreenType || 'desktop';
	const currentFocalPoint = focusInfo[currentScreenType].focalPoint;
	const currentZoom = focusInfo[currentScreenType].zoom;

	useEffect(() => {
		setFocusInfo({
			desktop: {
				focalPoint: { x: info?.crop?.desktop?.x || 0, y: info?.crop?.desktop?.y || 0 },
				zoom: info?.zoom?.desktop || 1,
			},
			mobile: {
				focalPoint: { x: info?.crop?.mobile?.x || 0, y: info?.crop?.mobile?.y || 0 },
				zoom: info?.zoom?.mobile || 1,
			},
		});
	}, [info?.crop, info?.zoom]);

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
			currentScreenType === 'desktop' ? '.screen' : '.mobile-preview-container',
		);
		if (!container) return;

		const { width, height } = container.getBoundingClientRect();
		const deltaX = (e.clientX - startPos.x) / width; // Reduced sensitivity
		const deltaY = (e.clientY - startPos.y) / height; // Reduced sensitivity

		setFocusInfo((prev) => {
			const newFocus = {
				...prev,
				[currentScreenType]: {
					...prev[currentScreenType],
					focalPoint: {
						x: Math.max(-1, Math.min(1, prev[currentScreenType].focalPoint.x - deltaX)),
						y: Math.max(-1, Math.min(1, prev[currentScreenType].focalPoint.y + deltaY)),
					},
				},
			};

			return newFocus;
		});
		setStartPos({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleZoomChange = (value) => {
		setFocusInfo((prev) => ({
			...prev,
			[currentScreenType]: {
				...prev[currentScreenType],
				zoom: value / 100,
			},
		}));
	};

	const handleScreenTypeChange = (screenType) => {
		setInfo((prev) => ({ ...prev, selectedScreenType: screenType }));
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
							className={`toggle-button ${
								currentScreenType === 'mobile' ? 'active' : ''
							}`}
							onClick={() => handleScreenTypeChange('mobile')}
						>
							<MobileIcon />
						</button>
						<button
							className={`toggle-button ${
								currentScreenType === 'desktop' ? 'active' : ''
							}`}
							onClick={() => handleScreenTypeChange('desktop')}
						>
							<DesktopIcon />
						</button>
					</div>
				</div>

				{info?.coverPhoto && (
					<div className="album-cover-container">
						<div className="album-preview">
							{currentScreenType === 'desktop' ? (
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
											<>
												<div
													style={{
														backgroundImage: `url(${info?.imageURL})`,
														backgroundPosition: `${
															currentFocalPoint?.x * 50 + 50
														}% ${50 - currentFocalPoint?.y * 50}%`,
														backgroundSize: `${
															currentZoom * 100
														}% auto`,
													}}
													className="image-container"
												>
													<div className="grid-overlay">
														{/* Grid Lines */}
														{Array.from({ length: 9 }).map(
															(_, index) => (
																<div
																	key={index}
																	style={{
																		border: '0.5px solid var(--dividers)',
																		boxSizing: 'border-box',
																	}}
																/>
															),
														)}
													</div>
												</div>
											</>
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
													backgroundImage: `url(${info?.imageURL})`,
													backgroundPosition: `${
														currentFocalPoint?.x * 50 + 50
													}% ${50 - currentFocalPoint?.y * 50}%`,
													backgroundSize: `auto ${currentZoom * 100}%`,
												}}
												className="image-container"
											>
												<div className="grid-overlay">
													{/* Grid Lines */}
													{Array.from({ length: 9 }).map((_, index) => (
														<div
															key={index}
															style={{
																border: '0.3px solid var(--dividers)',
																boxSizing: 'border-box',
															}}
														/>
													))}
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
						<div className="handGrabIcon">
							<HandGrabIcon />
							<p>Drag Image to set image position</p>
						</div>
					</div>
				)}
				<div className="uploadScaleContainer" key={currentScreenType}>
					<div className="uploadScaleText">Scale </div>
					<Slider
						min={100}
						max={200}
						defaultValue={currentZoom * 100}
						style={{ width: '100%' }}
						tooltip={{ open: false }}
						onChange={handleZoomChange}
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
							onClick={() => handleSetCoverPosition(focusInfo)}
							style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
						>
							{coverLoading ? <Spinner /> : 'Set cover photo'}
						</p>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UploadGalleryImageCover);
