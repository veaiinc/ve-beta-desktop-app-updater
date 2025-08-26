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
				<div>
					<BridgeIcon />
				</div>
				<div className={s.internalServerTitle}>500 Internal Server Error</div>
				<div className={s.internalServerDescription}>
					An unexpected error occurred. We’re on it. If the issue persists, share this ID
					with support
				</div>
				<button className={s.internalServerButton} onClick={handleReloadClick}>
					Reload Page
				</button>
			</div>
		</div>
	);
};

export default memo(InternalServer);
