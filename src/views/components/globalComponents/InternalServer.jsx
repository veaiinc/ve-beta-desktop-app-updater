import { memo } from 'react';
import s from '../../../assets/scss/globalComponents/internalServer.module.scss';
import { ReactComponent as BridgeIcon } from '../../../assets/svg/bridgeIcon.svg';

const InternalServer = () => {
	const handleReloadClick = () => {
		window.location.reload();
	};
	return (
		<div className={s.internalServerContainer}>
			<div className={s.internalServerMainContainer}>
				<BridgeIcon />
				<div className={s.internalServerTitle}>500 Internal Server Error</div>
				<p className={s.internalServerDescription}>
					An unexpected error occurred. We’re on it.
				</p>
				<button className={s.internalServerButton} onClick={handleReloadClick}>
					Reload Page
				</button>
			</div>
			<p className={s.internalServerFooter}>
				Need Help? Contact our support team at{' '}
				<a
					href="mailto:support@ve.ai?subject=500 Internal Server Error Report&body=Hi, I encountered a 500 error on your website. Please help resolve it."
					className={s.supportEmail}
					target="_blank"
					rel="noopener noreferrer"
				>
					support@ve.ai
				</a>
			</p>
		</div>
	);
};

export default memo(InternalServer);
