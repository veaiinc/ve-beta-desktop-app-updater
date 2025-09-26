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
	const videoRef = useRef(null);

	useEffect(() => {
		if (!downloadSectionRef.current || !iMacFrameRef.current || !fullscreenIMacRef.current)
			return;

		// Handle window resize to recalculate responsive values
		const handleResize = () => {
			// Force ScrollTrigger refresh to recalculate responsive values
			ScrollTrigger.refresh();
		};

		window.addEventListener('resize', handleResize);

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
		const descriptionTextInit = iMacElement?.querySelector('[data-description-text="true"]');
		const descriptionText2Init = iMacElement?.querySelector('[data-description-text-2="true"]');

		// Reset all text elements
		if (veText) {
			gsap.set(veText, {
				opacity: 0,
				y: 30,
				scale: 0.9,
			});
		}
		if (descriptionTextInit) {
			gsap.set(descriptionTextInit, {
				opacity: 0,
				y: 30,
				scale: 0.9,
			});
		}
		if (descriptionText2Init) {
			gsap.set(descriptionText2Init, {
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

		// Create smooth scroll animation with staged snapping
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: downloadSectionRef.current,
				start: 'top +=300px center',
				end: 'bottom +=1000px center',
				scrub: 2,
				pin: downloadSectionRef.current,
				pinSpacing: true,
				snap: {
					snapTo: [0, 0.33, 0.66, 1], // 3 stages + end
					duration: { min: 0.15, max: 0.5 },
					ease: 'power1.inOut',
					inertia: false,
				},
				// Show start/end markers
				onUpdate: (self) => {
					const progress = self.progress;
					const isScrollingDown = self.direction === 1;

					// Phase 1: DownloadSection scaling (0-30% progress) with responsive adjustments
					const screenWidth = window.innerWidth;
					let maxScaleReduction = 0.3; // Default reduction

					// Adjust scaling reduction based on screen size
					if (screenWidth <= 1400) {
						maxScaleReduction = 0.25;
					} else if (screenWidth <= 1200) {
						maxScaleReduction = 0.2;
					} else if (screenWidth <= 1024) {
						maxScaleReduction = 0.15;
					}

					const sectionScale =
						progress < 0.3
							? 1 - (progress / 0.3) * maxScaleReduction
							: 1 - maxScaleReduction;
					gsap.set(downloadSectionRef.current, {
						scale: sectionScale,
						zIndex: 1,
					});

					// Stage-based iMac scaling with responsive adjustments
					let iMacScale = 1;

					// Adjust scaling based on screen size
					let maxScale = 4.5;
					let stage1End = 1.8;
					let stage2End = 3.0;

					if (screenWidth <= 1400) {
						maxScale = 3.5;
						stage1End = 1.6;
						stage2End = 2.5;
					} else if (screenWidth <= 1200) {
						maxScale = 3.0;
						stage1End = 1.4;
						stage2End = 2.2;
					} else if (screenWidth <= 1024) {
						maxScale = 2.5;
						stage1End = 1.2;
						stage2End = 1.8;
					}

					if (progress < 0.33) {
						// Stage 1: showcase video
						const p = Math.max(0, progress / 0.33);
						iMacScale = 1 + p * (stage1End - 1); // 1 -> stage1End
					} else if (progress < 0.66) {
						// Stage 2: continue zoom
						const p = (progress - 0.33) / 0.33;
						iMacScale = stage1End + p * (stage2End - stage1End); // stage1End -> stage2End
					} else {
						// Stage 3: prepare for fullscreen handoff
						const p = Math.min(1, (progress - 0.66) / 0.34);
						iMacScale = stage2End + p * (maxScale - stage2End); // stage2End -> maxScale
					}
					gsap.set(iMacElement, { scale: iMacScale, zIndex: 20 });

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

					// Image transition: keep video visible for Stage 1 & 2; crossfade only in Stage 3
					if (progress >= 0.66) {
						const imageProgress = Math.min(1, (progress - 0.66) / 0.1); // 0.66 -> 0.76 window
						const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
						const bgLayerImage = iMacElement?.querySelector('[data-image="bg-layer"]');
						if (varyaImage && bgLayerImage) {
							gsap.set(varyaImage, { opacity: 1 - imageProgress });
							gsap.set(bgLayerImage, { opacity: imageProgress });
						}
					} else {
						// Before Stage 3, ensure video is fully visible
						const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
						const bgLayerImage = iMacElement?.querySelector('[data-image="bg-layer"]');
						if (varyaImage && bgLayerImage) {
							gsap.set(varyaImage, { opacity: 1 });
							gsap.set(bgLayerImage, { opacity: 0 });
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
						if (progress < 0.1) {
							// Ensure complete reset when scrolling back near top
							gsap.set(veText, { opacity: 0, y: 30, scale: 0.9 });
						}
					}

					// First description text - show container but let SplitText handle the reveal
					if (descriptionTextInit) {
						// Show the container when VE text is fully visible
						if (progress >= 0.4) {
							const descProgress = Math.min(1, Math.max(0, (progress - 0.4) / 0.1));
							gsap.set(descriptionTextInit, {
								opacity: descProgress,
								y: 30 * (1 - descProgress),
								scale: 0.9 + 0.1 * descProgress,
							});
						} else {
							// Keep hidden before VE text is fully visible
							gsap.set(descriptionTextInit, {
								opacity: 0,
								y: 30,
								scale: 0.9,
							});
						}
					}

					// Second description text - show container but let SplitText handle the reveal
					if (descriptionText2Init) {
						// Show the container after first description gets reduced
						if (progress >= 0.75) {
							const desc2Progress = Math.min(1, Math.max(0, (progress - 0.75) / 0.1));
							gsap.set(descriptionText2Init, {
								opacity: desc2Progress,
								y: 30 * (1 - desc2Progress),
								scale: 0.9 + 0.1 * desc2Progress,
							});
						} else {
							// Keep hidden before first description gets reduced
							gsap.set(descriptionText2Init, {
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

					// Ensure video image fully visible when near top
					if (progress < 0.05) {
						const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
						const bgLayerImage = iMacElement?.querySelector('[data-image="bg-layer"]');
						if (varyaImage && bgLayerImage) {
							gsap.set(varyaImage, { opacity: 1 });
							gsap.set(bgLayerImage, { opacity: 0 });
						}
					}

					// Stage 3 to Fullscreen handoff (only after 0.66)
					if (progress >= 0.66) {
						const fullscreenProgress = (progress - 0.66) / 0.34;

						// Responsive fullscreen scaling
						let baseScale = 0.3;
						let maxScale = 1.0;

						if (screenWidth <= 1400) {
							baseScale = 0.4;
							maxScale = 0.8;
						} else if (screenWidth <= 1200) {
							baseScale = 0.5;
							maxScale = 0.7;
						} else if (screenWidth <= 1024) {
							baseScale = 0.6;
							maxScale = 0.6;
						}

						const fullscreenScale =
							baseScale + fullscreenProgress * (maxScale - baseScale);
						const fullscreenOpacity = Math.min(1, fullscreenProgress * 1.2);

						gsap.set(fullscreenIMacRef.current, {
							scale: fullscreenScale,
							opacity: fullscreenOpacity,
							zIndex: 9999,
						});
						if (fullscreenProgress > 0.05) {
							fullscreenIMacRef.current?.classList.add('visible');
						}
					} else {
						// Hide fullscreen before stage 3
						gsap.set(fullscreenIMacRef.current, { scale: 0.3, opacity: 0, zIndex: -1 });
						fullscreenIMacRef.current?.classList.remove('visible');
					}
				},
			},
		});

		// Create text reveal animation for description text
		const createTextRevealAnimation = () => {
			const descriptionText = iMacElement?.querySelector('[data-description-text="true"]');
			let firstTextCompletionPoint = 300; // Default fallback

			if (descriptionText) {
				// Split text into lines for animation
				const split = new SplitText(descriptionText, { type: 'lines' });

				// Calculate when the last line will complete
				const lastLineIndex = split.lines.length - 1;
				firstTextCompletionPoint = lastLineIndex * 120 + 150 + 50; // +50px buffer

				// Animate each line with sequential timing - complete one before starting next
				split.lines.forEach((target, index) => {
					gsap.to(target, {
						backgroundPositionX: 0, // Animate from 100% to 0%
						ease: 'power1.inOut', // Smoother easing for more organic feel
						scrollTrigger: {
							trigger: descriptionText, // Use parent element as trigger
							scrub: 3, // Slower scrubbing for smoother animation
							// Show start/end markers
							start: `top+=${index * 120}px center`, // Each line starts 120px after previous (more spacing)
							end: `top+=${index * 120 + 150}px center`, // Each line takes 150px to complete (slower)
						},
					});
				});
			}

			// Create text reveal animation for second description text (starts after first description gets reduced)
			const descriptionText2 = iMacElement?.querySelector('[data-description-text-2="true"]');
			if (descriptionText2) {
				// Split text into lines for animation
				const split2 = new SplitText(descriptionText2, { type: 'lines' });

				// Start after first text completes and gets reduced
				const secondTextStartPoint = firstTextCompletionPoint + 50; // +50px after reduction completes

				// Animate each line with sequential timing
				split2.lines.forEach((target, index) => {
					gsap.to(target, {
						backgroundPositionX: 0, // Animate from 100% to 0%
						ease: 'power1.inOut', // Smoother easing for more organic feel
						scrollTrigger: {
							trigger: descriptionText2, // Use parent element as trigger
							scrub: 3, // Slower scrubbing for smoother animation
							// Show start/end markers
							start: `top+=${index * 120 + secondTextStartPoint}px center`, // Start after first text is reduced
							end: `top+=${index * 120 + secondTextStartPoint + 150}px center`, // Each line takes 150px to complete
						},
					});
				});
			}

			// Return the completion point for use in reduction timing
			return firstTextCompletionPoint;
		};

		// Call text reveal animation and get completion timing
		const textCompletionPoint = createTextRevealAnimation();

		// Get the description text element for the trigger
		const descriptionTextElement = iMacElement?.querySelector('[data-description-text="true"]');

		// Create ScrollTrigger for description text reduction animation
		// This triggers right after the SplitText animation completes
		ScrollTrigger.create({
			trigger: descriptionTextElement,
			start: `top+=${textCompletionPoint}px center`, // Start after SplitText actually completes
			end: `top+=${textCompletionPoint + 100}px center`, // Longer duration for smoother reduction
			// Show start/end markers
			onEnter: () => {
				// Description text reduction starts after SplitText completes
				const descriptionText = iMacElement?.querySelector(
					'[data-description-text="true"]',
				);
				if (descriptionText) {
					gsap.to(descriptionText, {
						scale: 0.6, // Scale down to 60%
						opacity: 0.4, // Reduce opacity to 40%
						duration: 0.4, // Faster duration for quicker transition
						ease: 'power2.out', // Faster easing
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
						duration: 0.3, // Faster duration for quicker transition
						ease: 'power2.out', // Faster easing
					});
				}
			},
			onLeaveBack: () => {
				// Keep reduced state when scrolling back down
			},
		});

		return () => {
			// Remove resize listener
			window.removeEventListener('resize', handleResize);

			// Kill all ScrollTriggers
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

			// Reset all elements to initial state
			if (iMacFrameRef.current) {
				const iMacElement = getIMacElement();
				const veText = iMacElement?.querySelector('[data-ve-text="true"]');
				const descriptionTextCleanup = iMacElement?.querySelector(
					'[data-description-text="true"]',
				);
				const descriptionText2Cleanup = iMacElement?.querySelector(
					'[data-description-text-2="true"]',
				);

				if (veText) gsap.set(veText, { opacity: 0, y: 30, scale: 0.9 });
				if (descriptionTextCleanup)
					gsap.set(descriptionTextCleanup, { opacity: 0, y: 30, scale: 0.9 });
				if (descriptionText2Cleanup)
					gsap.set(descriptionText2Cleanup, { opacity: 0, y: 30, scale: 0.9 });
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
		videoRef,
	};
};
