import { memo } from 'react';
import s from '../../../../assets/scss/gallery/desktopAppIntimation.module.scss';
import ReactModal from '../../modalsV2';

const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;
const deepLinkUrl = 'veai://open';

const DesktopPopup = ({ open, closeModal, onStandardUploadClick }) => {
	const handleInstallOrOpen = () => {
		window.location.href = deepLinkUrl;

		const timer = setTimeout(() => {
			if (desktopAppDownloadUrl) {
				window.open(desktopAppDownloadUrl, '_blank');
			}
		}, 2000);

		// If user switches focus (e.g., app opened), cancel fallback
		window.addEventListener(
			'blur',
			() => {
				clearTimeout(timer);
			},
			{ once: true },
		);
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
						standard upload
					</span>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DesktopPopup);
