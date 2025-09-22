import { memo, forwardRef } from 'react';
import s from './downloadSection.module.scss';
import { ReactComponent as MacIcon } from '../../../assets/svg/landingScreen/macIcon.svg';
import { ReactComponent as WindowsIcon } from '../../../assets/svg/landingScreen/windowsIcon.svg';
import IMacFrame from './IMacFrame';

// Get download URLs from environment variables
const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;
const desktopAppDownloadWindows = import.meta.env.VITE_APP_DESKTOP_APP_WINDOWS_DOWNLOAD_URL || null;
const desktopAppDownloadMacIntel64 =
	import.meta.env.VITE_APP_DESKTOP_APP_MACINTEL64_DOWNLOAD_URL || null;

const DownloadSection = forwardRef(({ iMacFrameRef }, ref) => {
	const handleDownload = (platform) => {
		let downloadUrl = null;

		if (platform === 'Mac') {
			// Check if it's Intel Mac and use appropriate URL
			const isMacIntel64 =
				navigator.userAgent.includes('Macintosh') &&
				navigator.userAgent.includes('Intel') &&
				navigator.userAgent.includes('x86_64');

			downloadUrl = isMacIntel64 ? desktopAppDownloadMacIntel64 : desktopAppDownloadUrl;
		} else if (platform === 'Windows') {
			downloadUrl = desktopAppDownloadWindows;
		}

		if (downloadUrl) {
			window.open(downloadUrl, '_blank');
		} else {
			console.warn(`Download URL not available for ${platform}`);
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
						the <span>Living mind</span> <br />
						of your company
					</h2>
					<p className={s.subheading}>Always-on . Real time . Acts before you ask.</p>
				</div>

				<div className={s.downloadButtons}>
					<button
						className={s.downloadButton}
						onClick={() => handleDownload('Mac')}
						aria-label="Download for Mac"
					>
						<div className={s.iconContainer}>
							<MacIcon />
						</div>
						<span>Download for Mac</span>
					</button>
					<button
						className={s.downloadButton}
						onClick={() => handleDownload('Windows')}
						aria-label="Download for Windows"
					>
						<div className={s.iconContainer}>
							<WindowsIcon />
						</div>
						<span>Download for Windows</span>
					</button>
				</div>

				{/* iMac Frame - Desktop only */}
				<div className={s.imacContainer}>
					<IMacFrame ref={iMacFrameRef} />
				</div>
			</div>
		</section>
	);
});

DownloadSection.displayName = 'DownloadSection';

export default memo(DownloadSection);
