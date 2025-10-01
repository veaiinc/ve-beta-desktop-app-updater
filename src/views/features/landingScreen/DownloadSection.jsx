import { memo, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import s from './downloadSection.module.scss';
import IMacFrame from './iMacFrame';

const DownloadSection = forwardRef(({ iMacFrameRef, videoRef }, ref) => {
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
					<Link className={s.downloadButton} to="/verify-user">
						<span>Get it for free</span>
					</Link>
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
