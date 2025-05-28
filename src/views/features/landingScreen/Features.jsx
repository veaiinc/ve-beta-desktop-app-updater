import { memo, useRef } from 'react';
import s from '../../../assets/scss/landingScreen/features.module.scss';
import feature1 from '../../../assets/images/feature1Image.png';
import feature2 from '../../../assets/images/feature2Image.png';
import feature3 from '../../../assets/images/feature3Image.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const timeline = gsap.timeline({
	scrollTrigger: {
		trigger: s.featuresContainer,
		scroll: 'body',
		pin: true,
		scrub: true,
		markers: true,
		end: '+=100%',
		start: 'top 30%',
		pinSpacing: false,
	},
});
const Features = () => {
	const featuresRef = useRef(null);
	const feature1Ref = useRef(null);
	const feature2Ref = useRef(null);
	const feature3Ref = useRef(null);

	useGSAP(() => {
		timeline.from(feature1Ref.current, {
			opacity: 0,
			visibility: 'hidden',
			duration: 1,
		});
		timeline.from(feature2Ref.current, {
			opacity: 0,
			visibility: 'hidden',
			duration: 1,
		});
		timeline.from(feature3Ref.current, {
			opacity: 0,
			visibility: 'hidden',
			duration: 1,
		});
	});

	return (
		<div className={s.featuresContainer}>
			<div className={s.leftPart}>
				{/* <div className={s.leftPart__topPart}></div> */}
				<div className={s.leftPart__bottomPart} ref={feature1Ref}>
					<h3 className={s.title}>Designed for innovators.</h3>
					<h4 className={s.subTitle}>
						You&apos;re not just running a business. You&apos;re shaping the future.
						Every second matters. AI integrates with your communications, schedules,
						documents, and to-dos — then highlights key insights, identifies challenges,
						and empowers you to take decisive action. It&apos;s not just a tool.
						It&apos;s your strategic partner.
					</h4>
				</div>
				<div className={s.leftPart__bottomPart} ref={feature2Ref}>
					<h3 className={s.title}>Proactive Intelligence, Not Passive Assistance</h3>
					<h4 className={s.subTitle}>
						Most AI tools wait for instructions.Ve.ai doesn&apos;t. It senses
						what&apos;s happening across your business, understands what matters, and
						moves things forward — before you even ask. Because as a founder, your time
						belongs to decisions, not distractions.
					</h4>
				</div>
				<div className={s.leftPart__bottomPart} ref={feature3Ref}>
					<h3 className={s.title}>Built for builders.</h3>
					<h4 className={s.subTitle}>
						You&apos;re not managing a company. You&apos;re building one. Every minute
						counts. Ve.ai connects with your emails, messages, docs, calendars, and
						tasks — then filters noise, surfaces priorities, flags blockers, and helps
						you act. It doesn&apos;t just assist. It operates.
					</h4>
				</div>
			</div>
			<div className={s.rightPart}>
				<div className={s.image}>
					<img src={feature1} alt="feature 1 image" />
				</div>
				<div className={s.image}>
					<img src={feature2} alt="feature 2 image" />
				</div>
				<div className={s.image}>
					<img src={feature3} alt="feature 3 image" />
				</div>
			</div>
		</div>
	);
};

export default memo(Features);
