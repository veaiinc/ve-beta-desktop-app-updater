import { memo } from 'react';
import s from '../../../../assets/scss/gallery/desktopAppIntimation.module.scss';
import ReactModal from '../../modalsV2';

const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;

const DesktopPopup = ({ open, closeModal, onStandardUploadClick }) => {
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
					onClick={() => {
						if (desktopAppDownloadUrl) {
							window.open(desktopAppDownloadUrl, '_blank');
						}
					}}
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
