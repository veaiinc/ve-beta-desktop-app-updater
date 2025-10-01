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
						Your{' '}
						<span>
							Living <br />
							Intelligence
						</span>{' '}
						Layer
					</h2>
					<p className={s.subsubheading}> formless - ambient - proactive!</p>
					<p className={s.subheading}>
						Your invisible second mind moving life from intention to reality.
					</p>
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
