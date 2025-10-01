import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import AnimatedIntro from './AnimatedIntro';
import AnimatedActions from './AnimatedActions';
import s from './animatedSection.module.scss';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const AnimatedSection = memo(function AnimatedSection({
	introTitle,
	introSubhead,
	actionsContent,
	sectionId,
}) {
	const containerRef = useRef(null);
	const introRef = useRef(null);
	const actionsRef = useRef(null);
	const initialContainerTopRef = useRef(0);
	const [currentActionsCard, setCurrentActionsCard] = useState(0);
	const [withinCardProgress, setWithinCardProgress] = useState(0);

	// Capture container's original top-offset on mount
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			initialContainerTopRef.current = rect.top + window.scrollY;
		}
	}, []);

	// GSAP + ScrollTrigger setup for curve animation
	useGSAP(() => {
		// Clear old triggers for this component only
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

		// Set initial states for curve animation
		gsap.set(actions, {
			clipPath: 'ellipse(220% 200% at 50% 300%)', // Start with large ellipse below screen
			opacity: 0,
			willChange: 'clip-path, opacity, transform',
			backfaceVisibility: 'hidden',
			transform: 'translateZ(0)',
			transformStyle: 'flat',
		});

		// Set initial state for intro
		gsap.set(intro, {
			opacity: 1,
			scale: 1,
			y: 0,
		});

		// Slower visible arc animation that always completes
		const cardCount = sectionId === 'SuperAgent' ? 3 : 4;
		const idleScroll = 50; // brief initial pause
		const transitionScroll = 150; // SLOWER so you can see the arc
		const cardsScroll = cardCount * 150; // 150% per card
		const scrollAmount = idleScroll + transitionScroll + cardsScroll;

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`, // Dynamic scroll based on card count
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			refreshPriority: -1, // Lower priority to avoid conflicts
		});

		let lastDirection = 1; // 1 => scrolling down, -1 => scrolling up

		// Create smooth curve animation and Actions card switching with progress-based updates
		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`,
			scrub: 1,
			// SNAP to ensure arc never stops in middle
			snap: {
				snapTo: (progress) => {
					const idleEnd = idleScroll / scrollAmount;
					const transitionEnd = (idleScroll + transitionScroll) / scrollAmount;

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
				const progress = self.progress; // 0..1 over total scrollAmount
				const idleEnd = idleScroll / scrollAmount;
				const transitionEnd = (idleScroll + transitionScroll) / scrollAmount;

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
					const segmentSize = 1 / cardCount;
					let activeCard = Math.floor(cardsProgress / segmentSize);
					activeCard = Math.min(Math.max(activeCard, 0), cardCount - 1);
					const segmentStart = activeCard * segmentSize;
					const t = (cardsProgress - segmentStart) / segmentSize; // 0..1 within the active card segment
					setCurrentActionsCard(activeCard);
					setWithinCardProgress(Math.min(Math.max(t, 0), 1));
				}
			},
			onEnter: () => {
				// Ensure initial state when entering the pinned section
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
				// Reset states when coming back from below
				gsap.set(intro, { opacity: 0, scale: 0.4, y: -100, zIndex: 1 });
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
					zIndex: 10,
				});
			},
			onLeaveBack: () => {
				// Reset to initial when leaving upwards
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
					zIndex: 10,
				});
				gsap.set(intro, { opacity: 1, scale: 1, y: 0, zIndex: 1 });
			},
		});

		return () => {
			// Clean up only this component's triggers
			const triggers = ScrollTrigger.getAll();
			triggers.forEach((t) => {
				if (t.trigger === containerRef.current) {
					t.kill();
				}
			});
		};
	}, [sectionId]);

	return (
		<div ref={containerRef} className={s.animatedSectionContainer}>
			<div ref={introRef} className={s.introSection}>
				<AnimatedIntro title={introTitle} subhead={introSubhead} />
			</div>
			<div ref={actionsRef} className={s.actionsSection}>
				<AnimatedActions
					currentCardIndex={currentActionsCard}
					actionsContent={actionsContent}
					sectionId={sectionId}
					withinCardProgress={withinCardProgress}
				/>
			</div>
		</div>
	);
});

export default AnimatedSection;
