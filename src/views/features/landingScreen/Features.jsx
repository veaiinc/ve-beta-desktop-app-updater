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
	const progressRef = useRef(null);
	const titleRefs = [useRef(null), useRef(null), useRef(null)];
	const subtitleRefs = [useRef(null), useRef(null), useRef(null)];
	const imageRefs = [useRef(null), useRef(null), useRef(null)];
	const stepLeftRef = useRef(null);

	useGSAP(() => {
		const allRefs = [...titleRefs, ...subtitleRefs, ...imageRefs].map((ref) => ref.current);
		gsap.set(allRefs, { autoAlpha: 0 });
		gsap.set(progressRef.current?.parentElement, { autoAlpha: 0 }); // hide progress bar initially

		imageRefs.forEach((ref) => {
			gsap.set(ref.current, {
				xPercent: -50,
				yPercent: -50,
				scale: 0.5,
				autoAlpha: 0,
			});
		});

		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: featuresRef.current,
				start: 'top top',
				end: '+=3500',
				scrub: 1,
				pin: true,
				pinSpacing: false,
				markers: false,
				onEnter: () => {
					// Show progress bar when the section becomes pinned
					gsap.to(progressRef.current?.parentElement, {
						autoAlpha: 1,
						duration: 0.4,
					});
				},
				onLeave: () => {
					// Hide progress bar when leaving the section
					gsap.to(progressRef.current?.parentElement, {
						autoAlpha: 0,
						duration: 0.4,
					});
				},
				onEnterBack: () => {
					// Show progress bar when coming back to the section
					gsap.to(progressRef.current?.parentElement, {
						autoAlpha: 1,
						duration: 0.4,
					});
				},
				onLeaveBack: () => {
					// Hide progress bar when leaving back from the section
					gsap.to(progressRef.current?.parentElement, {
						autoAlpha: 0,
						duration: 0.4,
					});
				},
			},
		});

		for (let i = 0; i < 3; i++) {
			timeline.set(imageRefs[i].current, { zIndex: i + 1 });

			timeline
				.to([titleRefs[i].current, subtitleRefs[i].current], {
					autoAlpha: 1,
					duration: 0.7,
					stagger: 0.2,
				})
				.fromTo(
					imageRefs[i].current,
					{ scale: 0.5, autoAlpha: 0 },
					{ scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
				);

			if (i < 2) {
				timeline
					.to(
						[titleRefs[i].current, subtitleRefs[i].current],
						{ autoAlpha: 0, duration: 0.5, stagger: 0.2 },
						'+=0.5',
					)
					.to(
						imageRefs[i].current,
						{ scale: 0.5, autoAlpha: 0, duration: 0.5, ease: 'power2.in' },
						'-=0.5',
					);
			} else {
				timeline.to({}, { duration: 5 }); // Hold
			}
		}

		// Animate progress bar fill
		gsap.to(progressRef.current, {
			width: '100%',
			ease: 'none',
			scrollTrigger: {
				trigger: featuresRef.current,
				start: 'top top',
				end: '+=3000',
				scrub: true,
			},
		});

		// Update step number (1 → 3)
		ScrollTrigger.create({
			trigger: featuresRef.current,
			start: 'top top',
			end: '+=3000',
			scrub: true,
			onUpdate: (self) => {
				const step = Math.min(3, Math.max(1, Math.ceil(self.progress * 3)));
				if (stepLeftRef.current) {
					stepLeftRef.current.textContent = `0${step}`;
				}
			},
		});

		// Remove the separate ScrollTrigger for progress bar fade as it's now handled by the main timeline
	}, []);

	const titles = [
		{
			title: 'Designed for innovators.',
			subTitle:
				"You're not just running a business. You're shaping the future. Every second matters. AI integrates with your communications, schedules, documents, and to-dos — then highlights key insights, identifies challenges, and empowers you to take decisive action. It's not just a tool. It's your strategic partner.",
		},
		{
			title: 'Proactive Intelligence, Not Passive Assistance',
			subTitle:
				"Most AI tools wait for instructions. Ve.ai doesn't. It senses what's happening across your business, understands what matters, and moves things forward — before you even ask. Because as a founder, your time belongs to decisions, not distractions.",
		},
		{
			title: 'Built for builders.',
			subTitle:
				"You're not managing a company. You're building one. Every minute counts. Ve.ai connects with your emails, messages, docs, calendars, and tasks — then filters noise, surfaces priorities, flags blockers, and helps you act. It doesn't just assist. It operates.",
		},
	];

	const images = [feature1, feature2, feature3];

	return (
		<div className={s.featuresContainer} ref={featuresRef}>
			<div className={s.leftPart}>
				<div className={s.progressBarWrapper}>
					<div className={s.stepNumberLeft} ref={stepLeftRef}>
						01
					</div>
					<div className={s.progressBar} ref={progressRef}></div>
					<div className={s.stepNumberRight}>03</div>
				</div>

				{titles.map((text, i) => (
					<div className={s.leftPart__bottomPart} key={`title-${i}`}>
						<h3 className={s.title} ref={titleRefs[i]}>
							{text.title}
						</h3>
						<h4 className={s.subTitle} ref={subtitleRefs[i]}>
							{text.subTitle}
						</h4>
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
