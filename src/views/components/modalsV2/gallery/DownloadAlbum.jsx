// import React from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as BookMarkSvg } from '../../../../assets/svg/gallery/bookMark.svg';
import { ReactComponent as GallerySvg } from '../../../../assets/svg/gallery/gallery.svg';
import ToggleSlider from '../../../components/input/slider';
import Spinner from '../../../components/loaders/Spinner';
const DownloadAlbum = (props) => {
	const {
		open,
		onClose,
		onDownload,
		onTagSelect,
		activeTagId,
		onDownloadTypeChange,
		originalDownload,
		webviewDownload,
		albumDetails,
		isLightGallery,
		isDownloading,
	} = props;
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	return (
		<ReactModal
			isOpen={open}
			closeModal={onClose}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="downloadAlbumPopupContainer">
				<div className="downloadAlbumPopupCloseButton">
					<div className="downloadAlbumPopupHeading">Download Album</div>
					<div onClick={onClose} style={{ cursor: 'pointer' }}>
						<CrossSvg />
					</div>
				</div>
				<div className="downloadAlbumPopupContent">
					<BookMarkSvg />
					<div className="downloadAlbumPopupLabels">
						<div className="downloadAlbumPopupHeading">Select labels to download</div>
						<div className="downloadAlbumPopupButtons">
							{albumDetails?.tags?.map((tag) => (
								<div
									key={tag._id}
									onClick={() => onTagSelect(tag._id)}
									style={{
										backgroundColor:
											activeTagId === tag._id ? '#FFFFFF' : 'transparent',
										color: activeTagId === tag._id ? '#000000' : '#FFFFFF',
										cursor: 'pointer',
										padding: '8px',
										borderRadius: '4px',
									}}
								>
									{tag.displayName}
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="downloadAlbumPopupContent">
					<GallerySvg />
					<div className="downloadAlbumPopupLabels">
						<div className="downloadAlbumPopupHeading">
							Select images type to download
						</div>
						<div className="image-type-container">
							{!isLightGallery && (
								<div className="image-type-container-item">
									<ToggleSlider
										value={originalDownload}
										onChange={() =>
											onDownloadTypeChange(
												'originalDownload',
												'webviewDownload',
											)
										}
									/>
									<p style={{ fontSize: '12px', color: '#939393' }}>
										Original Images
									</p>
								</div>
							)}
							<div className="image-type-container-item">
								<ToggleSlider
									value={webviewDownload}
									onChange={() =>
										onDownloadTypeChange('webviewDownload', 'originalDownload')
									}
								/>
								<p style={{ fontSize: '12px', color: '#939393' }}>Webview Images</p>
							</div>
						</div>
					</div>
				</div>
				<div style={{ alignSelf: 'flex-end' }}>
					<button className="downloadAlbumPopupDownloadButton" onClick={onDownload}>
						{isDownloading ? <Spinner /> : 'Download'}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default DownloadAlbum;
