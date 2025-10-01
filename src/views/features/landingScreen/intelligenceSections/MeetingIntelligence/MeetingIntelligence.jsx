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
			scale: 1,
			y: 0,
		});

		// Slower visible arc animation that always completes
		const idleScroll = 50; // brief initial pause
		const transitionScroll = 150; // SLOWER so you can see the arc
		const cardsScroll = 800; // card animations
		const totalScroll = idleScroll + transitionScroll + cardsScroll; // 1000%

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${totalScroll}%`,
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			refreshPriority: -1, // Lower priority to avoid conflicts
		});

		let lastDirection = 1; // 1 => scrolling down, -1 => scrolling up

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${totalScroll}%`,
			scrub: 1,
			// SNAP to ensure arc never stops in middle
			snap: {
				snapTo: (progress) => {
					const idleEnd = idleScroll / totalScroll;
					const transitionEnd = (idleScroll + transitionScroll) / totalScroll;

					// If in transition zone, snap based on scroll direction
					if (progress >= idleEnd && progress < transitionEnd) {
						// scrolling down (1) => OPEN; scrolling up (-1) => CLOSE
						return lastDirection === 1 ? transitionEnd : idleEnd;
					}
					return progress; // Don't snap outside transition zone
				},
				duration: { min: 0.2, max: 0.5 },
				delay: 0.1,
				ease: 'power2.inOut',
			},
			refreshPriority: -1,
			onUpdate: (self) => {
				lastDirection = self.direction;
				const progress = self.progress; // 0..1
				const idleEnd = idleScroll / totalScroll;
				const transitionEnd = (idleScroll + transitionScroll) / totalScroll;

				if (progress < idleEnd) {
					// Phase 1: FULLY CLOSED state
					gsap.set(intro, { opacity: 1, scale: 1, y: 0, zIndex: 1 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
						zIndex: 10,
					});
				} else if (progress < transitionEnd) {
					// Phase 2: Smooth visible arc animation
					const t = (progress - idleEnd) / (transitionEnd - idleEnd);
					// Smooth easeInOut for visible arc movement
					const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

					// Text disappears quickly
					const scale = 1 - eased * 0.6;
					const textY = -100 * eased;
					const opacity = t < 0.2 ? 1 - t * 5 : 0;
					gsap.set(intro, { opacity, scale, y: textY, zIndex: 1 });

					// Arc clipPath animates smoothly - VISIBLE movement
					const clipY = 300 - eased * 125;
					const contentOpacity = Math.min(1, eased * 1.5);
					gsap.set(actions, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity: contentOpacity,
						zIndex: 10,
					});
				} else {
					// Phase 3: FULLY OPEN state - cards animation
					gsap.set(intro, { opacity: 0, scale: 0.4, y: -100, zIndex: 1 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 175%)',
						opacity: 1,
						zIndex: 10,
					});
					const cardsProgress = (progress - transitionEnd) / (1 - transitionEnd);
					setCurrentActionsCard(cardsProgress);
				}
			},
			onEnter: () => {
				// Reset to initial state on enter
				gsap.set(intro, { opacity: 1, scale: 1, y: 0, zIndex: 1 });
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
					zIndex: 10,
				});
			},
			onLeave: () => {
				// Keep actions visible once we leave the pin at bottom
				gsap.set(intro, { opacity: 0, scale: 0.4, y: -100, zIndex: 1 });
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
					zIndex: 10,
				});
			},
			onEnterBack: () => {
				// Coming back from below: show final state
				gsap.set(intro, { opacity: 0, scale: 0.4, y: -100, zIndex: 1 });
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
					zIndex: 10,
				});
			},
			onLeaveBack: () => {
				// Leaving upwards: reset to initial hidden actions
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
					zIndex: 10,
				});
				gsap.set(intro, { opacity: 1, scale: 1, y: 0, zIndex: 1 });
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
