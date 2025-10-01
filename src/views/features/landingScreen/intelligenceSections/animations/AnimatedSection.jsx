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
			y: 0,
		});

		// Create pin container for extended scroll
		// Add an extra initial scroll segment before arc animation begins
		const cardCount = sectionId === 'SuperAgent' ? 3 : 4;
		const extraIdleScroll = 100; // extra 100% scroll before arc starts
		const arcScroll = 100; // dedicated 100% for the arc animation
		const cardsScroll = cardCount * 150; // 150% per card
		const scrollAmount = extraIdleScroll + arcScroll + cardsScroll;

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`, // Dynamic scroll based on card count
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			refreshPriority: -1, // Lower priority to avoid conflicts
		});

		// Create smooth curve animation and Actions card switching with progress-based updates
		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`,
			scrub: 1, // Keep scrub only for card switching
			refreshPriority: -1, // Lower priority to avoid conflicts
			onUpdate: (self) => {
				const progress = self.progress; // 0..1 over total scrollAmount
				// Segments: [0, extraIdle), [extraIdle, extraIdle+arc), [rest for cards]
				const idleEnd = extraIdleScroll / scrollAmount; // ~ first 100%
				const arcEnd = (extraIdleScroll + arcScroll) / scrollAmount; // next 100%

				// Intro moves up and fades during arc segment, stays visible during idle
				if (progress < idleEnd) {
					gsap.set(intro, { opacity: 1, y: 0 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				} else if (progress < arcEnd) {
					const arcProgress = (progress - idleEnd) / (arcEnd - idleEnd); // 0..1
					// Move intro up and fade while arc opens
					gsap.set(intro, { opacity: 1 - arcProgress, y: -50 * arcProgress });
					const clipY = 300 - arcProgress * 125; // 300% -> 175%
					const opacity = Math.min(1, arcProgress * 1.2);
					gsap.set(actions, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity: opacity,
					});
				} else {
					// Cards segment
					gsap.set(intro, { opacity: 0, y: -50 });
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 175%)',
						opacity: 1,
					});
					const cardsProgress = (progress - arcEnd) / (1 - arcEnd); // 0..1 over cards
					let activeCard = 0;
					if (cardCount === 3) {
						if (cardsProgress >= 0.66) activeCard = 2;
						else if (cardsProgress >= 0.33) activeCard = 1;
						else activeCard = 0;
					} else {
						if (cardsProgress >= 0.75) activeCard = 3;
						else if (cardsProgress >= 0.5) activeCard = 2;
						else if (cardsProgress >= 0.25) activeCard = 1;
						else activeCard = 0;
					}
					setCurrentActionsCard(activeCard);
				}
			},
			onEnter: () => {
				// Ensure initial state when entering the pinned section
				gsap.set(intro, { opacity: 1, y: 0 });
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 300%)', opacity: 0 });
			},
			onEnterBack: () => {
				// Reset states when coming back from below
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 175%)', opacity: 1 });
			},
			onLeaveBack: () => {
				// Reset to initial when leaving upwards
				gsap.set(actions, { clipPath: 'ellipse(220% 200% at 50% 300%)', opacity: 0 });
				gsap.set(intro, { opacity: 1, y: 0 });
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
				/>
			</div>
		</div>
	);
});

export default AnimatedSection;
