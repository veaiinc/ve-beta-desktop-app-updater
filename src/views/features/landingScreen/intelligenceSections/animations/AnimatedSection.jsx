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

		// Create pin container for extended scroll (curve animation + Actions cards)
		const cardCount = sectionId === 'SuperAgent' ? 3 : 4;
		const scrollAmount = 100 + cardCount * 150; // 100% for curve + 150% per card

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`, // Dynamic scroll based on card count
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
		});

		// Create smooth curve animation and Actions card switching with progress-based updates
		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollAmount}%`,
			scrub: 1, // Smoother scrubbing
			onUpdate: (self) => {
				const progress = self.progress;

				// Intro fade out (first 15% of scroll)
				if (progress <= 0.15) {
					const introProgress = progress / 0.15; // 0 to 1
					gsap.set(intro, {
						opacity: 1 - introProgress,
						y: -50 * introProgress,
					});
				} else {
					// Keep intro hidden
					gsap.set(intro, {
						opacity: 0,
						y: -50,
					});
				}

				// Actions reveal with curve animation (starts at 10% of scroll, completes by 15%)
				if (progress >= 0.1) {
					const actionsProgress = Math.min(1, (progress - 0.1) / 0.05); // 0 to 1, complete by 15%

					// Smooth circular reveal - ellipse moves from bottom to center
					const clipY = 300 - actionsProgress * 125; // Move from 300% to 175%
					const opacity = Math.min(1, actionsProgress * 1.2); // Slightly faster opacity reveal

					gsap.set(actions, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity: opacity,
					});
				} else {
					// Keep actions hidden
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				}

				// Actions card switching (starts after curve animation completes at 15%)
				if (progress >= 0.15) {
					const actionsScrollProgress = (progress - 0.15) / 0.85; // 0 to 1 for Actions cards
					let activeCard = 0;

					// Calculate which card should be active based on progress and card count
					if (cardCount === 3) {
						// Super Agent: 3 cards (actions, suggestions, opportunity)
						if (actionsScrollProgress >= 0.66) activeCard = 2; // Opportunity
						else if (actionsScrollProgress >= 0.33) activeCard = 1; // Suggestions
						else activeCard = 0; // Actions
					} else {
						// Other sections: 4 cards (actions, suggestions, opportunity, risk)
						if (actionsScrollProgress >= 0.75) activeCard = 3; // Risk
						else if (actionsScrollProgress >= 0.5) activeCard = 2; // Opportunity
						else if (actionsScrollProgress >= 0.25) activeCard = 1; // Suggestions
						else activeCard = 0; // Actions
					}

					// Update the current card index - Actions component will handle visibility
					setCurrentActionsCard(activeCard);
				}
			},
			onEnter: () => {
				// Ensure final state is correct when entering
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
				});
				gsap.set(intro, {
					opacity: 0,
					y: -50,
				});
			},
			onLeave: () => {
				// Keep revealed state when leaving
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
				});
			},
			onEnterBack: () => {
				// Reset when scrolling back up
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
				});
				gsap.set(intro, {
					opacity: 1,
					y: 0,
				});
			},
			onLeaveBack: () => {
				// Keep hidden state when scrolling back down
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
				});
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
