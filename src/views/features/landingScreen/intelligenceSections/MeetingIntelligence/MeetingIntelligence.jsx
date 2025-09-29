import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import AnimatedIntro from '../animations/AnimatedIntro';
import MeetingIntelligenceUI from './MeetingIntelligenceUI';
import s from '../animations/animatedSection.module.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const MeetingIntelligence = memo(function MeetingIntelligence() {
	const containerRef = useRef(null);
	const introRef = useRef(null);
	const actionsRef = useRef(null);
	const initialContainerTopRef = useRef(0);
	const [currentActionsCard, setCurrentActionsCard] = useState(0);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			initialContainerTopRef.current = rect.top + window.scrollY;
		}
	}, []);

	useGSAP(() => {
		const triggers = ScrollTrigger.getAll();
		triggers.forEach((t) => {
			if (t.trigger === containerRef.current) {
				t.kill();
			}
		});

		const container = containerRef.current;
		const intro = introRef.current;
		const actions = actionsRef.current;

		if (!container || !intro || !actions) return;

		gsap.set(actions, {
			clipPath: 'ellipse(220% 200% at 50% 300%)',
			opacity: 0,
			willChange: 'clip-path, opacity, transform',
			backfaceVisibility: 'hidden',
			transform: 'translateZ(0)',
			transformStyle: 'flat',
		});

		gsap.set(intro, {
			opacity: 1,
			y: 0,
		});

		// Add an extra initial idle scroll segment before arc animation
		const extraIdleScroll = 100; // 100%
		const arcScroll = 100; // 100%
		const cardsScroll = 800; // remaining for cards (keeps total similar to previous 1000%)
		const totalScroll = extraIdleScroll + arcScroll + cardsScroll; // 1000%

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${totalScroll}%`,
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			refreshPriority: -1, // Lower priority to avoid conflicts
		});

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${totalScroll}%`,
			scrub: 1,
			refreshPriority: -1, // Lower priority to avoid conflicts
			onUpdate: (self) => {
				const progress = self.progress; // 0..1
				const idleEnd = extraIdleScroll / totalScroll;
				const arcEnd = (extraIdleScroll + arcScroll) / totalScroll;

				if (progress < idleEnd) {
					// Idle: show intro, hide actions
					gsap.set(intro, { opacity: 1, y: 0 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				} else if (progress < arcEnd) {
					// Arc: move intro up while opening arc
					const arcProgress = (progress - idleEnd) / (arcEnd - idleEnd);
					gsap.set(intro, { opacity: 1 - arcProgress, y: -50 * arcProgress });
					const clipY = 300 - arcProgress * 125; // 300 -> 175
					const opacity = Math.min(1, arcProgress * 1.2);
					gsap.set(actions, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity,
					});
				} else {
					// Cards: keep arc open, drive cards by remaining progress
					gsap.set(intro, { opacity: 0, y: -50 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 175%)',
						opacity: 1,
					});
					const cardsProgress = (progress - arcEnd) / (1 - arcEnd);
					setCurrentActionsCard(cardsProgress);
				}
			},
			onEnter: () => {
				// Reset to initial state on enter
				gsap.set(intro, { opacity: 1, y: 0 });
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 300%)', opacity: 0 });
			},
			onLeave: () => {
				// Keep actions visible once we leave the pin at bottom
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 175%)', opacity: 1 });
			},
			onEnterBack: () => {
				// Coming back from below: keep actions hidden until arc segment
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 300%)', opacity: 0 });
				gsap.set(intro, { opacity: 1, y: 0 });
			},
			onLeaveBack: () => {
				// Leaving upwards: reset to initial hidden actions
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 300%)', opacity: 0 });
			},
		});

		return () => {
			const triggers = ScrollTrigger.getAll();
			triggers.forEach((t) => {
				if (t.trigger === containerRef.current) {
					t.kill();
				}
			});
		};
	}, []);

	const handleDismiss = () => {
		console.log('Meeting Intelligence: Dismiss clicked');
	};

	const handleSend = () => {
		console.log('Meeting Intelligence: Send clicked');
	};

	return (
		<div ref={containerRef} className={s.animatedSectionContainer}>
			<div ref={introRef} className={s.introSection}>
				<AnimatedIntro
					title="Meeting Intelligence"
					subhead="Not just notes. True awareness. It remembers, decides, and follows up."
				/>
			</div>
			<div ref={actionsRef} className={s.actionsSection}>
				<MeetingIntelligenceUI
					parentScrollProgress={currentActionsCard}
					onDismiss={handleDismiss}
					onSend={handleSend}
					sectionId="MeetingIntelligence"
				/>
			</div>
		</div>
	);
});

export default MeetingIntelligence;
