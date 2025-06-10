import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/howItWorks.module.scss';
import HeroImage from '../../../assets/svg/landingScreen/hero.svg';
const HowItWorks = () => {
	return (
		<div className={s.howItWorksContainer}>
			<div className={s.howItWorks}>
				<div className={s.top}>
					<div className={s.titleContainer}>
						<p className={s.secondaryText}>
							<span>How It Works</span>
						</p>
						<p className={s.title}>
							<span className={s.readsYourWorld}>Reads your world.</span>
							<span className={s.learnsFast}>Learns fast. Acts ahead.</span>
						</p>
					</div>
					<p className={s.subTitle}>
						Unlike traditional agents, our Proactive AI doesn&apos;t wait for commands.
						It continuously ingests and understands your data, evolving and learning
						from every interaction. Without needing prompts, it identifies patterns,
						reasons in real-time, and anticipates your needs. This open-ended,
						self-learning approach transforms how you interact with AI, making it more
						intuitive and powerful.
					</p>
				</div>
			</div>
			<img src={HeroImage} alt="homepage" className="homepageImage" loading="lazy" />
			{/* <div className={s.bottom}>
				<div className={`${s.feature} ${s.feature1}`}>
					<div className={s.image}>
						<img
							src="https://ap.images.ve.ai/public/dashboard/suggestion.png"
							alt="feature 1"
						/>
					</div>
					<div className={s.textContainer}>
						<h1 className={s.feature__title}>Senses</h1>
						<h1 className={s.feature__description}>
							Reads your docs, chats, emails, files understands what&apos;s happening.
						</h1>
					</div>
				</div>
				<div className={`${s.feature} ${s.feature2}`}>
					<div className={s.image}>
						<img
							src="https://ap.images.ve.ai/public/dashboard/chain-of-taught.png"
							alt="feature 2"
						/>
					</div>
					<div className={s.textContainer}>
						<h1 className={s.feature__title}>Thinks</h1>
						<h1 className={s.feature__description}>
							Analyzes patterns, detects gaps, surfaces priorities, reasons over
							context.
						</h1>
					</div>
				</div>
				<div className={`${s.feature} ${s.feature3}`}>
					<div className={s.image}>
						<img
							src="https://ap.images.ve.ai/public/dashboard/task.png"
							alt="feature 3"
						/>
					</div>
					<div className={s.textContainer}>
						<h1 className={s.feature__title}>Acts</h1>
						<h1 className={s.feature__description}>
							Triggers workflows, writes messages, flags risks, reminds people — all
							without waiting for a prompt.
						</h1>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default memo(HowItWorks);
