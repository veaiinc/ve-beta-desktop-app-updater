import { memo, forwardRef, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import s from './TextOverlay.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

const TextOverlay = forwardRef((props, ref) => {
	const containerRef = useRef(null);

	// Expose container ref to parent component
	useEffect(() => {
		if (ref) {
			if (typeof ref === 'function') {
				ref(containerRef.current);
			} else {
				ref.current = containerRef.current;
			}
		}
	}, [ref]);

	// SplitText animation logic
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const veText = container.querySelector('[data-ve-text="true"]');
		const descriptionText = container.querySelector('[data-description-text="true"]');

		if (!veText || !descriptionText) return;

		// Check if mobile/tablet - skip scroll animation
		const isMobile = window.innerWidth <= 1024;

		if (isMobile) {
			// On mobile, show text immediately without scroll animation
			gsap.set(veText, {
				opacity: 1,
				y: 0,
			});

			gsap.set(descriptionText, {
				opacity: 1,
				y: 0,
				scale: 1,
			});

			// Simple fade-in animation for mobile
			gsap.fromTo(
				veText,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
			);

			gsap.fromTo(
				descriptionText,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out' },
			);

			return; // Exit early for mobile
		}

		// Set initial states for text elements
		gsap.set(veText, {
			opacity: 0,
			y: 30,
		});

		gsap.set(descriptionText, {
			opacity: 0,
			y: 30,
			scale: 0.9,
		});

		// Create SplitText animation for description text
		// Split by words first to maintain word boundaries, then by chars
		const split = new SplitText(descriptionText, { type: 'words,chars' });

		// Set initial opacity for all characters (low opacity for upcoming text)
		gsap.set(split.chars, { opacity: 0.3 });

		// Ensure words stay together on the same line
		gsap.set(split.words, { display: 'inline-block', whiteSpace: 'nowrap' });

		// Calculate scroll duration based on text length - more UX friendly
		const totalChars = split.chars.length;
		const scrollDuration = Math.max(190, totalChars * 3); // Reduced for smoother experience

		// Create main ScrollTrigger with pinning - this fixes the component in place
		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollDuration}%`, // Dynamic scroll based on text length
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			markers: false, // Hide markers for production
			refreshPriority: 1, // Higher priority to ensure TextOverlay runs first

			onLeave: () => {
				// Ensure TextOverlay is completely finished before next section
				gsap.set(container, { zIndex: 1 }); // Lower z-index after completion
			},
			onEnterBack: () => {
				gsap.set(container, { zIndex: 15 }); // Restore z-index when scrolling back
			},
		});

		// Create the main animation ScrollTrigger that controls all text animations
		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: `+=${scrollDuration}%`,
			scrub: 1.2, // Smoother scrubbing for better UX
			refreshPriority: 1, // Higher priority to ensure TextOverlay runs first
			onUpdate: (self) => {
				const progress = self.progress;

				// VE text animation (first 8% of scroll) - fade-in-up animation
				if (progress <= 0.08) {
					const veProgress = gsap.utils.clamp(0, 1, progress / 0.08); // VE text animation duration
					const easedProgress = gsap.parseEase('power2.out')(veProgress); // Smooth fade-in-up easing

					gsap.set(veText, {
						opacity: easedProgress,
						y: 50 - 50 * easedProgress, // Strong fade-in-up movement
					});
				} else {
					// Keep VE text fully visible
					gsap.set(veText, {
						opacity: 1,
						y: 0,
					});
				}

				// Description text fade-in animation (starts at 10% of scroll) - only after VE text is shown
				if (progress >= 0.1) {
					const descProgress = gsap.utils.clamp(0, 1, (progress - 0.1) / 0.05); // Quick fade-in (5% of scroll)
					const easedProgress = gsap.parseEase('power2.out')(descProgress); // Smooth easing

					gsap.set(descriptionText, {
						opacity: easedProgress,
						y: 20 - 20 * easedProgress, // Subtle fade-in-up
						scale: 0.95 + 0.05 * easedProgress,
					});
				}

				// Character-by-character animation (starts at 15% of scroll)
				if (progress >= 0.15) {
					const charProgress = gsap.utils.clamp(0, 1, (progress - 0.15) / 0.85); // 0 to 1 for remaining 85%
					const easedProgress = gsap.parseEase('power1.inOut')(charProgress);
					const charsToAnimate = Math.floor(easedProgress * totalChars);

					split.chars.forEach((char, index) => {
						if (index <= charsToAnimate) {
							// Skip spaces for smoother animation
							if (char.textContent.trim() === '') {
								gsap.set(char, { opacity: 0.5 }); // More visible spaces
							} else {
								// Smooth character reveal with better opacity transition
								if (index === charsToAnimate) {
									gsap.set(char, { opacity: 1 }); // Full opacity for current character
								} else if (index === charsToAnimate - 1) {
									gsap.set(char, { opacity: 0.95 }); // Smooth transition for previous char
								} else {
									gsap.set(char, { opacity: 0.85 }); // Consistent opacity for completed chars
								}
							}
						} else {
							gsap.set(char, { opacity: 0.3 }); // More visible upcoming chars
						}
					});
				}
			},
		});

		// Cleanup function
		return () => {
			// Kill all ScrollTriggers created by this component
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.trigger === container) {
					trigger.kill();
				}
			});

			// Reset text elements
			if (veText) gsap.set(veText, { opacity: 0, y: 30 });
			if (descriptionText) gsap.set(descriptionText, { opacity: 0, y: 30, scale: 0.9 });
		};
	}, []);

	return (
		<div ref={containerRef} className={s.textOverlay}>
			<div className={s.veText} data-ve-text="true">
				Hey, I'm VE <br /> the living mind of <br /> your company.
			</div>

			<div className={s.descriptionText} data-description-text="true">
				I don't live in an app. I flow through your calls, emails, meetings, and tools
				formless and always present. I anticipate what you need before you ask, remember
				everything that matters, and act on your behalf across every surface of your life.
				I'm not software you use. I'm intelligence that lives with you. Proactive.
				Contextual. Executing. Deeply human.
			</div>
		</div>
	);
});

TextOverlay.displayName = 'TextOverlay';

export default memo(TextOverlay);
