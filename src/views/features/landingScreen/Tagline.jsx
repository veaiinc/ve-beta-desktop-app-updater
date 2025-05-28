import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/tagline.module.scss';

const Tagline = () => {
	return (
		<div className={s.tagLine}>
			<div className={s.container}>
				<div className={s.top}>
					<div className={s.poweredBy}>Powered by </div>
					<div className={s.heading}>
						Our first foundation model the proactive graph transformer
					</div>
					<div className={s.subHeading}>
						A self -learning memory engine that sees patterns, reasons in real time, and
						acts without being told
					</div>
				</div>
				<div className={s.bottom}>
					<div className={s.buttonsContainer}>
						<button className={`${s.button} ${s.readMore}`}>Read More</button>
						<button className={`${s.button} ${s.tryOurApi}`}>Try our API</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Tagline);
