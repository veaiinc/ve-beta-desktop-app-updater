import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const useScrollAnimation = () => {
	const downloadSectionRef = useRef(null);
	const iMacFrameRef = useRef(null);
	const fullscreenIMacRef = useRef(null);
	const backgroundRef = useRef(null);
	const headerRef = useRef(null);
	const productIntroRef = useRef(null);
	const videoRef = useRef(null);

	useEffect(() => {
		if (!downloadSectionRef.current || !iMacFrameRef.current || !fullscreenIMacRef.current)
			return;

		// Helper function to get the actual DOM element from ref
		const getIMacElement = () => {
			const ref = iMacFrameRef.current;
			return ref?.current || ref;
		};

		// Grab header
		const headerElement = document.querySelector('.page-header');
		if (headerElement) headerRef.current = headerElement;

		// Reset initial states
		gsap.set(fullscreenIMacRef.current, {
			scale: 0.3,
			zIndex: -1,
			opacity: 0,
		});
		gsap.set(backgroundRef.current, { zIndex: -1 });

		// Set initial states for all text elements
		const iMacElement = getIMacElement();
		const veText = iMacElement?.querySelector('[data-ve-text="true"]');
		const descriptionText = iMacElement?.querySelector('[data-description-text="true"]');
		const descriptionText2 = iMacElement?.querySelector('[data-description-text-2="true"]');

		// Reset all text elements
		if (veText) {
			gsap.set(veText, {
				opacity: 0,
				y: 30,
				scale: 0.9,
			});
		}
		if (descriptionText) {
			gsap.set(descriptionText, {
				opacity: 0,
				y: 30,
				scale: 0.9,
			});
		}
		if (descriptionText2) {
			gsap.set(descriptionText2, {
				opacity: 0,
				y: 30,
				scale: 0.9,
			});
		}

		// Set initial states for images
		const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
		const bgLayerImage = iMacElement?.querySelector('[data-image="bg-layer"]');
		if (varyaImage) {
			gsap.set(varyaImage, { opacity: 1 });
		}
		if (bgLayerImage) {
			gsap.set(bgLayerImage, { opacity: 0 });
		}

		// Create smooth scroll animation with proper reverse
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: downloadSectionRef.current,
				start: 'top +=250px center',
				end: 'bottom +=700px center', // Extended scroll range to see second description text reveal
				scrub: 2, // Smooth scrubbing
				markers: true, // Show start/end markers
				onUpdate: (self) => {
					const progress = self.progress;
					const isScrollingDown = self.direction === 1;

					// Phase 1: DownloadSection scaling (0-30% progress)
					const sectionScale = progress < 0.3 ? 1 - (progress / 0.3) * 0.3 : 0.7;
					gsap.set(downloadSectionRef.current, {
						scale: sectionScale,
						zIndex: 1,
					});

					// Phase 2: iMac frame scaling (10-70% progress)
					if (progress >= 0.1) {
						const iMacProgress = Math.min(1, (progress - 0.1) / 0.6);
						const iMacScale = 1 + iMacProgress * 4; // Scale from 1 to 5

						gsap.set(iMacElement, {
							scale: iMacScale,
							zIndex: 20,
						});
					} else {
						// Reset scale when progress is less than 0.1 (scrolling back up)
						gsap.set(iMacElement, {
							scale: 1,
							zIndex: 1,
						});
					}

					// Video control based on scroll direction
					if (videoRef.current) {
						if (progress >= 0.1 && isScrollingDown && videoRef.current.paused) {
							// Start video when scrolling down and iMac starts scaling
							videoRef.current.play().catch((err) => {
								console.log('Video autoplay prevented:', err);
							});
						} else if (!isScrollingDown && progress < 0.1 && !videoRef.current.paused) {
							// Stop video when scrolling back up before scaling starts
							videoRef.current.pause();
							videoRef.current.currentTime = 0;
						}
					}

					// Image transition (20-30% progress)
					if (progress >= 0.2) {
						const imageProgress = Math.min(1, (progress - 0.2) / 0.1);
						const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
						const bgLayerImage = iMacElement?.querySelector('[data-image="bg-layer"]');

						if (varyaImage && bgLayerImage) {
							gsap.set(varyaImage, { opacity: 1 - imageProgress });
							gsap.set(bgLayerImage, { opacity: imageProgress });
						}
					}

					// Text animations with smooth transitions
					// VE Text (25-40% progress)
					if (veText) {
						const veProgress = Math.min(1, Math.max(0, (progress - 0.25) / 0.15));
						gsap.set(veText, {
							opacity: veProgress,
							y: 30 * (1 - veProgress),
							scale: 0.9 + 0.1 * veProgress,
						});
					}

					// First description text - show container but let SplitText handle the reveal
					if (descriptionText) {
						// Show the container when VE text is fully visible
						if (progress >= 0.4) {
							const descProgress = Math.min(1, Math.max(0, (progress - 0.4) / 0.1));
							gsap.set(descriptionText, {
								opacity: descProgress,
								y: 30 * (1 - descProgress),
								scale: 0.9 + 0.1 * descProgress,
							});
						} else {
							// Keep hidden before VE text is fully visible
							gsap.set(descriptionText, {
								opacity: 0,
								y: 30,
								scale: 0.9,
							});
						}
					}

					// Second description text - show container but let SplitText handle the reveal
					if (descriptionText2) {
						// Show the container after first description gets reduced
						if (progress >= 0.85) {
							const desc2Progress = Math.min(1, Math.max(0, (progress - 0.85) / 0.1));
							gsap.set(descriptionText2, {
								opacity: desc2Progress,
								y: 30 * (1 - desc2Progress),
								scale: 0.9 + 0.1 * desc2Progress,
							});
						} else {
							// Keep hidden before first description gets reduced
							gsap.set(descriptionText2, {
								opacity: 0,
								y: 30,
								scale: 0.9,
							});
						}
					}

					// Header behind iMac
					if (headerRef.current) {
						headerRef.current.classList.add('behind-fullscreen');
					}
					if (backgroundRef.current) {
						gsap.set(backgroundRef.current, { zIndex: 1 });
					}

					// Phase 3: Fullscreen iMac (70-100% progress)
					if (progress >= 0.7) {
						const fullscreenProgress = (progress - 0.7) / 0.3;
						const fullscreenScale = 0.3 + fullscreenProgress * 0.7;
						const fullscreenOpacity = fullscreenProgress;

						gsap.set(fullscreenIMacRef.current, {
							scale: fullscreenScale,
							opacity: fullscreenOpacity,
							zIndex: 9999,
						});

						if (fullscreenProgress > 0.3) {
							fullscreenIMacRef.current?.classList.add('visible');
						}
					}
				},
			},
		});

		// Create text reveal animation for description text
		const createTextRevealAnimation = () => {
			const descriptionText = iMacElement?.querySelector('[data-description-text="true"]');
			if (descriptionText) {
				// Split text into lines for animation
				const split = new SplitText(descriptionText, { type: 'lines' });

				// Animate each line with sequential timing - complete one before starting next
				split.lines.forEach((target, index) => {
					gsap.to(target, {
						backgroundPositionX: 0, // Animate from 100% to 0%
						ease: 'none', // Linear animation for smooth scroll sync
						scrollTrigger: {
							trigger: descriptionText, // Use parent element as trigger
							scrub: 1, // Faster scrubbing for faster animation
							markers: true, // Show start/end markers
							start: `top+=${index * 80}px center`, // Each line starts 80px after previous
							end: `top+=${index * 80 + 60}px center`, // Each line takes 60px to complete
						},
					});
				});
			}

			// Create text reveal animation for second description text (starts after first description completes)
			const descriptionText2 = iMacElement?.querySelector('[data-description-text-2="true"]');
			if (descriptionText2) {
				// Split text into lines for animation
				const split2 = new SplitText(descriptionText2, { type: 'lines' });

				// Animate each line with sequential timing - starts after first description gets reduced
				split2.lines.forEach((target, index) => {
					gsap.to(target, {
						backgroundPositionX: 0, // Animate from 100% to 0%
						ease: 'none', // Linear animation for smooth scroll sync
						scrollTrigger: {
							trigger: descriptionText2, // Use parent element as trigger
							scrub: 1, // Faster scrubbing for faster animation
							markers: true, // Show start/end markers
							start: `top+=${index * 80 + 250}px center`, // Start 250px after first description gets reduced
							end: `top+=${index * 80 + 250 + 60}px center`, // Each line takes 60px to complete
						},
					});
				});
			}
		};

		// Call text reveal animation
		createTextRevealAnimation();

		// Create ScrollTrigger for description text reduction animation
		// This triggers right after the SplitText animation completes
		ScrollTrigger.create({
			trigger: descriptionText,
			start: 'top+=200px center', // Start after SplitText completes (adjust based on line count)
			end: 'top+=250px center', // Short duration for the reduction
			markers: true, // Show start/end markers
			onEnter: () => {
				// Description text reduction starts after SplitText completes
				const descriptionText = iMacElement?.querySelector(
					'[data-description-text="true"]',
				);
				if (descriptionText) {
					gsap.to(descriptionText, {
						scale: 0.6, // Scale down to 60%
						opacity: 0.4, // Reduce opacity to 40%
						duration: 0.5,
						ease: 'power2.out',
					});
				}
			},
			onLeave: () => {
				// Description text reduction completes
			},
			onEnterBack: () => {
				// Reset when scrolling back up
				const descriptionText = iMacElement?.querySelector(
					'[data-description-text="true"]',
				);
				if (descriptionText) {
					gsap.to(descriptionText, {
						scale: 1, // Reset scale
						opacity: 1, // Reset opacity
						duration: 0.3,
						ease: 'power2.out',
					});
				}
			},
			onLeaveBack: () => {
				// Keep reduced state when scrolling back down
			},
		});

		// Circular sphere ellipse animation for transition to ProductIntro
		if (productIntroRef.current) {
			// Set initial state - ProductIntro hidden with circular clip
			gsap.set(productIntroRef.current, {
				clipPath: 'ellipse(220% 200% at 50% 300%)',
				opacity: 0,
				scale: 1,
				willChange: 'clip-path, opacity, transform',
				backfaceVisibility: 'hidden',
				transform: 'translateZ(0)',
				transformStyle: 'flat',
			});

			// Create smooth circular reveal animation
			ScrollTrigger.create({
				trigger: productIntroRef.current,
				start: 'top bottom',
				end: 'top top',
				scrub: 1, // Smoother scrubbing
				markers: true,
				onUpdate: (self) => {
					const progress = self.progress;

					// Smooth circular reveal - ellipse moves from bottom to center
					const clipY = 300 - progress * 125; // Move from 300% to 175%
					const opacity = Math.min(1, progress * 1.2); // Slightly faster opacity reveal

					gsap.set(productIntroRef.current, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity: opacity,
					});
				},
				onEnter: () => {
					// Ensure final state is correct
					gsap.set(productIntroRef.current, {
						clipPath: 'ellipse(220% 200% at 50% 175%)',
						opacity: 1,
					});
				},
				onLeave: () => {
					// Keep revealed state
					gsap.set(productIntroRef.current, {
						clipPath: 'ellipse(220% 200% at 50% 175%)',
						opacity: 1,
					});
				},
				onEnterBack: () => {
					// Reset when scrolling back up
					gsap.set(productIntroRef.current, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				},
				onLeaveBack: () => {
					// Keep hidden state when scrolling back down
					gsap.set(productIntroRef.current, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				},
			});

			// Additional smooth entrance animation for content
			ScrollTrigger.create({
				trigger: productIntroRef.current,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 1,
				onUpdate: (self) => {
					const progress = self.progress;

					// Animate hero section content
					const heroSection = productIntroRef.current?.querySelector(
						'[data-hero-section="true"]',
					);
					if (heroSection) {
						gsap.set(heroSection, {
							y: (1 - progress) * 50, // Slide up from below
							opacity: progress,
						});
					}
				},
			});
		}

		return () => {
			// Kill all ScrollTriggers
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

			// Reset all elements to initial state
			if (iMacFrameRef.current) {
				const iMacElement = getIMacElement();
				const veText = iMacElement?.querySelector('[data-ve-text="true"]');
				const descriptionText = iMacElement?.querySelector(
					'[data-description-text="true"]',
				);
				const descriptionText2 = iMacElement?.querySelector(
					'[data-description-text-2="true"]',
				);

				if (veText) gsap.set(veText, { opacity: 0, y: 30, scale: 0.9 });
				if (descriptionText) gsap.set(descriptionText, { opacity: 0, y: 30, scale: 0.9 });
				if (descriptionText2) gsap.set(descriptionText2, { opacity: 0, y: 30, scale: 0.9 });
			}

			if (fullscreenIMacRef.current) {
				gsap.set(fullscreenIMacRef.current, { scale: 0.3, opacity: 0, zIndex: -1 });
			}

			if (downloadSectionRef.current) {
				gsap.set(downloadSectionRef.current, { scale: 1, zIndex: 1 });
			}
		};
	}, []);

	return {
		downloadSectionRef,
		iMacFrameRef,
		fullscreenIMacRef,
		backgroundRef,
		productIntroRef,
		videoRef,
	};
};
