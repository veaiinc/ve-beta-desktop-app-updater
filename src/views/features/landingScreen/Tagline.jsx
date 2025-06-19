import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/tagline.module.scss';

const Tagline = () => {
	return (
		<div className={s.tagLine}>
			<div className={s.container}>
				<div className={s.taglineContainer}>
					<div className={s.top}>
						<div className={s.poweredBy}>Powered by</div>
						<div className={s.heading}>Ambient Graph Transformer</div>
						<div className={s.subHeading}>
							<p>
								AGT is our first foundational model—built on an ambient architecture
								where memory, meaning, and context flow through an evolving graph.
								Unlike traditional LLMs that wait for prompts, AGT perceives the
								world in motion. It maps relationships, spots patterns, and
								anticipates what matters next. This isn’t static memory or
								step-by-step logic. It’s a living structure—constantly adapting and
								refining itself with every signal. The graph evolves. The
								transformer sharpens. Together, they form a mind that’s always
								learning, always in sync.
							</p>
						</div>
					</div>
					{/* <div className={s.taglineButtons}>
						<div className={s.readMore}>Read more</div>
						<div className={s.tryOurApi}>Try our API</div>
					</div> */}
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
