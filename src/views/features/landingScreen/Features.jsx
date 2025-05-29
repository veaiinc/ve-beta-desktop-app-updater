import { memo, useRef } from 'react';
import s from '../../../assets/scss/landingScreen/features.module.scss';
import feature1 from '../../../assets/images/feature1Image.png';
import feature2 from '../../../assets/images/feature2Image.png';
import feature3 from '../../../assets/images/feature3Image.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
	const featuresRef = useRef(null);
	const titleRefs = [useRef(null), useRef(null), useRef(null)];
	const imageRefs = [useRef(null), useRef(null), useRef(null)];

	useGSAP(() => {
		const allRefs = [...titleRefs, ...imageRefs].map((ref) => ref.current);

		gsap.set(allRefs, { autoAlpha: 0 });

		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: featuresRef.current,
				start: 'top top',
				end: '+=3000', // Adjust for scroll length
				scrub: true,
				pin: true,
				markers: true, // remove in production
				pinSpacing: false,
			},
		});

		// Animate title/image pairs
		for (let i = 0; i < 3; i++) {
			timeline
				.to(titleRefs[i].current, { autoAlpha: 1, duration: 1 })
				.to(imageRefs[i].current, { autoAlpha: 1, duration: 1 }, '<');

			if (i < 2) {
				timeline
					.to(titleRefs[i].current, { autoAlpha: 0, duration: 1 }, '+=1')
					.to(imageRefs[i].current, { autoAlpha: 0, duration: 1 }, '<');
			}
		}
	}, []);

	const titles = [
		{
			title: 'Designed for innovators.',
			subTitle:
				'You’re not just running a business. You’re shaping the future. Every second matters. AI integrates with your communications, schedules, documents, and to-dos — then highlights key insights, identifies challenges, and empowers you to take decisive action. It’s not just a tool. It’s your strategic partner.',
		},
		{
			title: 'Proactive Intelligence, Not Passive Assistance',
			subTitle:
				'Most AI tools wait for instructions.Ve.ai doesn’t. It senses what’s happening across your business, understands what matters, and moves things forward — before you even ask. Because as a founder, your time belongs to decisions, not distractions.',
		},
		{
			title: 'Built for builders.',
			subTitle:
				'You’re not managing a company. You’re building one. Every minute counts. Ve.ai connects with your emails, messages, docs, calendars, and tasks — then filters noise, surfaces priorities, flags blockers, and helps you act. It doesn’t just assist. It operates.',
		},
	];

	const images = [feature1, feature2, feature3];

	return (
		<div className={s.featuresContainer} ref={featuresRef}>
			<div className={s.leftPart}>
				{titles.map((text, i) => (
					<div className={s.leftPart__bottomPart} ref={titleRefs[i]} key={`title-${i}`}>
						<h3 className={s.title}>{text.title}</h3>
						<h4 className={s.subTitle}>{text.subTitle}</h4>
					</div>
				))}
			</div>

			<div className={s.rightPart}>
				{images.map((img, i) => (
					<div className={s.image} ref={imageRefs[i]} key={`image-${i}`}>
						<img src={img} alt={`feature ${i + 1}`} />
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(Features);
