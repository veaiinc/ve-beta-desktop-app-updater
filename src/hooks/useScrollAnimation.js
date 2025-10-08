import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
	const downloadSectionRef = useRef(null);
	const iMacFrameRef = useRef(null);
	const fullscreenIMacRef = useRef(null);
	const backgroundRef = useRef(null);
	const headerRef = useRef(null);
	const videoRef = useRef(null);

	// Memoize the resize handler
	const handleResize = useCallback(() => {
		ScrollTrigger.refresh();
	}, []);

	useEffect(() => {
		if (!downloadSectionRef.current || !iMacFrameRef.current || !fullscreenIMacRef.current)
			return;

		window.addEventListener('resize', handleResize);

		// Helper function to get the actual DOM element from ref
		const getIMacElement = () => {
			const ref = iMacFrameRef.current;
			return ref?.current || ref;
		};

		// Grab header - use a more stable approach
		const headerElement = document.querySelector('.page-header');
		if (headerElement) {
			headerRef.current = headerElement;
		}

		// Reset initial states
		gsap.set(fullscreenIMacRef.current, {
			scale: 0.3,
			zIndex: -1,
			opacity: 0,
		});
		gsap.set(backgroundRef.current, { zIndex: -1 });

		const iMacElement = getIMacElement();

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
		const stageOneSnapPoint = 0.33;
		const stageTwoSnapPoint = 0.66;
		const stageZeroThreshold = stageOneSnapPoint * 0.5;
		const stageTwoHoldThreshold = (stageOneSnapPoint + stageTwoSnapPoint) / 2;
		const fullscreenSnapThreshold = 0.92; // Require extra intent before snapping to fullscreen
		const snapState = { allowFullscreen: false };

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: downloadSectionRef.current,
				start: 'top +=300px center',
				end: 'bottom +=1000px center',
				scrub: 2,
				pin: downloadSectionRef.current,
				pinSpacing: true,
				snap: {
					snapTo: (progress) => {
						if (!snapState.allowFullscreen) {
							if (progress < stageZeroThreshold) {
								return 0;
							}
							if (progress < stageOneSnapPoint + 0.05) {
								return stageOneSnapPoint;
							}
							return stageTwoSnapPoint;
						}

						if (progress < stageZeroThreshold) {
							return 0;
						}
						if (progress < stageTwoHoldThreshold) {
							return stageOneSnapPoint;
						}
						if (progress < fullscreenSnapThreshold) {
							return stageTwoSnapPoint;
						}
						return 1;
					},
					duration: { min: 0.2, max: 0.5 },
					ease: 'power1.inOut',
					inertia: false,
					directional: true,
					onComplete: (self) => {
						if (self.direction === 1 && self.progress >= stageTwoSnapPoint - 0.01) {
							snapState.allowFullscreen = true;
						}
					},
				},
				// Show start/end markers
				onUpdate: (self) => {
					const progress = self.progress;
					const isScrollingDown = self.direction === 1;

					// Phase 1: DownloadSection scaling (0-30% progress) with responsive adjustments
					const currentScreenWidth = window.innerWidth;
					let maxScaleReduction = 0.3; // Default reduction

					// Adjust scaling reduction based on screen size
					if (currentScreenWidth <= 1400) {
						maxScaleReduction = 0.05;
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

					if (currentScreenWidth <= 1400) {
						maxScale = 1.6;
						stage1End = 1.6;
						stage2End = 0.8;
					} else if (currentScreenWidth <= 1200) {
						maxScale = 2.8;
						stage1End = 0.6;
						stage2End = 1.2;
					} else if (currentScreenWidth <= 1024) {
						maxScale = 2.4;
						stage1End = 0.4;
						stage2End = 0.8;
					}

					if (progress < stageOneSnapPoint) {
						// Stage 1: showcase video
						const p = Math.max(0, progress / stageOneSnapPoint);
						iMacScale = 1 + p * (stage1End - 1); // 1 -> stage1End
					} else if (progress < stageTwoSnapPoint) {
						// Stage 2: continue zoom
						const p = (progress - stageOneSnapPoint) / stageOneSnapPoint;
						iMacScale = stage1End + p * (stage2End - stage1End); // stage1End -> stage2End
					} else {
						// Stage 3: prepare for fullscreen handoff
						const p = Math.min(
							1,
							(progress - stageTwoSnapPoint) / (1 - stageTwoSnapPoint),
						);
						iMacScale = stage2End + p * (maxScale - stage2End); // stage2End -> maxScale
					}
					gsap.set(iMacElement, { scale: iMacScale, zIndex: 20 });

					// Toggle fullscreen class only near the end (use fullscreenSnapThreshold)
					if (iMacElement) {
						if (progress >= fullscreenSnapThreshold) {
							iMacElement.classList.add('fullscreen');
						} else {
							iMacElement.classList.remove('fullscreen');
						}
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

					// Keep video visible until very end; hide only at fullscreen threshold
					const varyaImage = iMacElement?.querySelector('[data-image="varya"]');
					if (varyaImage) {
						gsap.set(varyaImage, {
							opacity: progress >= fullscreenSnapThreshold ? 0.0 : 1,
						});
					}

					// Header behind iMac
					if (headerRef.current) {
						headerRef.current.classList.add('behind-fullscreen');
					}
					if (backgroundRef.current) {
						gsap.set(backgroundRef.current, { zIndex: 1 });
					}

					// Ensure video image fully visible when near top
					if (progress < stageZeroThreshold) {
						snapState.allowFullscreen = false;
						const varyaImageTop = iMacElement?.querySelector('[data-image="varya"]');
						if (varyaImageTop) {
							gsap.set(varyaImageTop, { opacity: 1 });
						}
					}

					// Stage 3 to Fullscreen handoff (only after 0.66)
					if (progress >= stageTwoSnapPoint) {
						const fullscreenProgress =
							(progress - stageTwoSnapPoint) / (1 - stageTwoSnapPoint);

						// Responsive fullscreen scaling
						let baseScale = 0.3;
						let maxScale = 1.0;

						if (currentScreenWidth <= 1400) {
							baseScale = 0.4;
							maxScale = 0.8;
						} else if (currentScreenWidth <= 1200) {
							baseScale = 0.5;
							maxScale = 0.7;
						} else if (currentScreenWidth <= 1024) {
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

		return () => {
			// Remove resize listener
			window.removeEventListener('resize', handleResize);

			// Kill all ScrollTriggers
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

			if (iMacFrameRef.current) {
			}

			if (fullscreenIMacRef.current) {
				gsap.set(fullscreenIMacRef.current, { scale: 0.3, opacity: 0, zIndex: -1 });
			}

			if (downloadSectionRef.current) {
				gsap.set(downloadSectionRef.current, { scale: 1, zIndex: 1 });
			}
		};
	}, [handleResize]);

	return {
		downloadSectionRef,
		iMacFrameRef,
		fullscreenIMacRef,
		backgroundRef,
		videoRef,
	};
};
