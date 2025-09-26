import { memo, forwardRef } from 'react';
import s from './downloadSection.module.scss';
import { ReactComponent as MacIcon } from '../../../assets/svg/landingScreen/macIcon.svg';
import IMacFrame from './iMacFrame';

// Get download URL from environment variable
const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;

const DownloadSection = forwardRef(({ iMacFrameRef, videoRef }, ref) => {
	const handleDownload = () => {
		if (desktopAppDownloadUrl) {
			window.open(desktopAppDownloadUrl, '_blank');
		} else {
			console.warn('Download URL not available for Mac');
		}
	};

	return (
		<section ref={ref} className={s.downloadSection}>
			<div className={s.container}>
				<div className={s.content}>
					<div className={s.badge}>
						<span>Meet VE</span>
					</div>
					<h2 className={s.heading}>
						the Living mind <br />
						of your company
					</h2>
					<p className={s.subheading}>Always-on . Real time . Acts before you ask.</p>
				</div>

				<div className={s.downloadButtons}>
					<button
						className={s.downloadButton}
						onClick={handleDownload}
						aria-label="Download for Mac"
					>
						<div className={s.iconContainer}>
							<MacIcon />
						</div>
						<span>Download for Mac</span>
					</button>
				</div>

				{/* iMac Frame - Desktop only */}
				<div className={s.imacContainer}>
					<IMacFrame ref={iMacFrameRef} videoRef={videoRef} />
				</div>
			</div>
		</section>
	);
});

DownloadSection.displayName = 'DownloadSection';

export default memo(DownloadSection);
