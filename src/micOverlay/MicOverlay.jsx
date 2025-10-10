import { memo } from 'react';
import s from './micOverlay.module.scss';
import { Mic, X } from 'lucide-react';

const MicOverlay = () => {
	const handleShowMicSettings = () => {
		if (window.electronApi) {
			window.electronApi.openMicrophoneSettings();
		}
		handleCloseMicOverlay();
	};

	const handleCloseMicOverlay = () => {
		if (window.electronApi) {
			window.electronApi?.micOverlay?.toggleWindow();
		}
	};
	return (
		<div className={s.micOverlayContainer}>
			<div className={s.closeSvg} onClick={handleCloseMicOverlay}>
				<X size={16} color="var(--primary-font)" />
			</div>
			<div className={s.micWrapper}>
				<div className={s.micIcon}>
					<Mic size={16} color="var(--secondary-font)" />
				</div>
				<div className={s.text}>Mic isn't active</div>
			</div>

			<button className={s.enableBtn} onClick={handleShowMicSettings}>
				Enable
			</button>
		</div>
	);
};

export default memo(MicOverlay);
