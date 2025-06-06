import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/tagline.module.scss';

const Tagline = () => {
	return (
		<div className={s.tagLine}>
			<div className={s.container}>
				<div className={s.taglineContainer}>
					<div className={s.top}>
						<div className={s.poweredBy}>Powered by our foundational model</div>
						<div className={s.heading}>Ambient Graph Transformer</div>
						<div className={s.subHeading}>
							A self -learning memory engine that sees patterns, reasons in real time,
							and acts without being told
						</div>
					</div>
					<div className={s.taglineButtons}>
						{/* <div className={s.readMore}>Read more</div> */}
						<div className={s.tryOurApi}>Try our API</div>
					</div>
				</div>
				{/* <div className={s.bottom}>
					<div className={s.buttonsContainer}>
						<button className={`${s.button} ${s.readMore}`}>Read More</button>
						<button className={`${s.button} ${s.tryOurApi}`}>Try our API</button>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default memo(Tagline);
