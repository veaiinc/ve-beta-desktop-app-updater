import { memo } from 'react';
import s from '../../../../assets/scss/gallery/desktopAppIntimation.module.scss';
import ReactModal from '../../modalsV2';
import { getGalleryDesktopAppDownloadUrl, deepLinkUrlGallery } from '../../../../helpers';

const DesktopPopup = ({ open, closeModal, onStandardUploadClick, selectedAction }) => {
	const handleInstallOrOpen = async () => {
		// window.location.href = deepLinkUrlGallery;
		const getGalleryDesktopAppDownloadUrlLink = await getGalleryDesktopAppDownloadUrl();
		window.open(getGalleryDesktopAppDownloadUrlLink, '_blank');
		// If user switches focus (e.g., app opened), cancel fallback
	};
	return (
		<ReactModal
			isOpen={open}
			closeModal={(e) => {
				e.stopPropagation();
				closeModal();
			}}
		>
			<div className={s.desktopPopupContainer}>
				<div className={s.desktopPopupTitle}>INSTALL DESKTOP APP</div>
				<div className={s.desktopPopupDesc}>
					For Faster Uploads and Downloads Use Desktop App
				</div>
				<button
					className={s.desktopDownloadButton}
					// onClick={() => {
					// 	if (desktopAppDownloadUrl) {
					// 		window.open(desktopAppDownloadUrl, '_blank');
					// 	}
					// }}
					onClick={handleInstallOrOpen}
				>
					Install
				</button>
				<div className={s.desktopInstallDesc}>
					prefer not to install now? use{' '}
					<span
						onClick={onStandardUploadClick}
						style={{ cursor: 'pointer', textDecoration: 'underline' }}
					>
						{`standard ${selectedAction === 'download' ? 'download' : 'upload'}`}
					</span>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DesktopPopup);
