import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
	const downloadSectionRef = useRef(null);
	const iMacFrameRef = useRef(null);
	const fullscreenIMacRef = useRef(null);
	const backgroundRef = useRef(null);
	const headerRef = useRef(null);

	useEffect(() => {
		if (!downloadSectionRef.current || !iMacFrameRef.current || !fullscreenIMacRef.current)
			return;

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

		// Create a sophisticated scroll animation with real-time updates
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: downloadSectionRef.current,
				start: 'top center',
				end: 'bottom+=4000px center', // Extend scroll range significantly to reach fullscreen
				scrub: 1, // Smooth scrubbing
				onUpdate: (self) => {
					const progress = self.progress;

					// Update scroll progress indicator
					const progressIndicator = document.getElementById('scroll-progress-debug');
					if (progressIndicator) {
						progressIndicator.style.setProperty(
							'--scroll-progress',
							`${progress * 100}%`,
						);
					}

					// Update scroll position indicator
					const scrollProgressValue = document.getElementById('scroll-progress-value');
					if (scrollProgressValue) {
						scrollProgressValue.textContent = `${(progress * 100).toFixed(1)}%`;
					}

					// Debug: Log scroll progress to monitor range
					if (progress > 0.4) {
						console.log('Scroll Progress:', (progress * 100).toFixed(1) + '%');
					}

					// Update movement indicators
					const phase1Indicator = document.getElementById('phase-1-indicator');
					const phase2Indicator = document.getElementById('phase-2-indicator');
					const phase3Indicator = document.getElementById('phase-3-indicator');
					const phase4Indicator = document.getElementById('phase-4-indicator');

					// Reset all indicators
					[phase1Indicator, phase2Indicator, phase3Indicator, phase4Indicator].forEach(
						(indicator) => {
							if (indicator) indicator.classList.remove('active');
						},
					);

					// Activate indicators based on progress
					if (progress >= 0 && progress < 0.6 && phase1Indicator) {
						phase1Indicator.classList.add('active');
					}
					if (progress >= 0.2 && progress < 0.8 && phase2Indicator) {
						phase2Indicator.classList.add('active');
					}
					if (progress >= 0.6 && progress < 1 && phase3Indicator) {
						phase3Indicator.classList.add('active');
					}
					if (progress >= 0.7 && progress < 1 && phase4Indicator) {
						phase4Indicator.classList.add('active');
					}

					// Phase 1: Decrease DownloadSection size as it goes under iMac (0-60% progress)
					if (progress < 0.6) {
						const sectionProgress = progress / 0.6; // 0 to 1
						const sectionScale = 1 - sectionProgress * 0.4; // Scale from 1 to 0.6

						gsap.set(downloadSectionRef.current, {
							scale: sectionScale,
							zIndex: 1, // Behind iMac frame
						});

						// Update debug label
						const debugLabel = downloadSectionRef.current?.querySelector('::before');
						if (downloadSectionRef.current) {
							downloadSectionRef.current.style.setProperty(
								'--debug-scale',
								`${(sectionScale * 100).toFixed(1)}%`,
							);
						}

						// Update position indicator
						const downloadScaleValue = document.getElementById('download-scale-value');
						if (downloadScaleValue) {
							downloadScaleValue.textContent = `${(sectionScale * 100).toFixed(1)}%`;
						}
					} else {
						// Keep section at minimum scale
						gsap.set(downloadSectionRef.current, {
							scale: 0.6,
							zIndex: 1,
						});

						// Update debug label
						if (downloadSectionRef.current) {
							downloadSectionRef.current.style.setProperty('--debug-scale', '60.0%');
						}

						// Update position indicator
						const downloadScaleValue = document.getElementById('download-scale-value');
						if (downloadScaleValue) {
							downloadScaleValue.textContent = '60.0%';
						}
					}

					// Phase 2: Start iMac frame zoom (20-80% progress)
					if (progress >= 0.2) {
						const iMacProgress = (progress - 0.2) / 0.6; // 0 to 1
						const iMacScale = 1 + iMacProgress * 8; // Scale from 1 to 9

						gsap.set(iMacFrameRef.current, {
							scale: iMacScale,
							zIndex: 20, // Above DownloadSection
						});

						// Update debug label
						if (iMacFrameRef.current) {
							iMacFrameRef.current.style.setProperty(
								'--debug-scale',
								`${(iMacScale * 100).toFixed(1)}%`,
							);
						}

						// Update position indicator
						const imacScaleValue = document.getElementById('imac-scale-value');
						if (imacScaleValue) {
							imacScaleValue.textContent = `${(iMacScale * 100).toFixed(1)}%`;
						}

						// Show "Hey, I'm VE..." text during iMac zoom (44.1% scroll progress)
						const veText = iMacFrameRef.current?.querySelector('[data-ve-text="true"]');
						if (veText) {
							// Start at 44.1% scroll progress (0.441), reach full opacity at 50% scroll progress (0.5)
							const veProgress = Math.max(
								0,
								Math.min(1, (progress - 0.441) / (0.5 - 0.441)),
							); // 44.1% to 50% scroll

							// Fade up animation: opacity + translateY
							const veOpacity = progress >= 0.5 ? 1 : veProgress; // Full opacity after 50%
							const translateY = progress >= 0.5 ? 0 : (1 - veProgress) * 50; // Stay at final position after 50%

							gsap.set(veText, {
								opacity: veOpacity,
								y: translateY,
								// No scaling - text stays at fixed size
							});

							// Update position indicators
							const veTextOpacityValue =
								document.getElementById('ve-text-opacity-value');
							if (veTextOpacityValue) {
								veTextOpacityValue.textContent = `${(veOpacity * 100).toFixed(1)}%`;
							}

							const veTextYValue = document.getElementById('ve-text-y-value');
							if (veTextYValue) {
								veTextYValue.textContent = `${translateY.toFixed(1)}px`;
							}

							// Debug: Log opacity and position values
							console.log(
								'Scroll Progress:',
								(progress * 100).toFixed(1) + '%',
								'VE Text Progress:',
								veProgress,
								'Opacity:',
								veOpacity,
								'TranslateY:',
								translateY.toFixed(1) + 'px',
							);
						}

						// Show description text with slide-up animation (starts after VE text is fully visible)
						const descriptionText = iMacFrameRef.current?.querySelector(
							'[data-description-text="true"]',
						);
						if (descriptionText) {
							// Debug: Log when description text should start appearing
							if (progress >= 0.49 && progress <= 0.51) {
								console.log(
									'Description text should start appearing at:',
									(progress * 100).toFixed(1) + '%',
								);
							}

							// Start at 50% scroll progress (0.5), reach full opacity at 60% scroll progress (0.6)
							const descProgress = Math.max(
								0,
								Math.min(1, (progress - 0.5) / (0.6 - 0.5)),
							); // 50% to 60% scroll

							// Slide up animation: opacity + translateY
							const descOpacity = progress >= 0.6 ? 1 : descProgress; // Full opacity after 60%
							const descTranslateY = progress >= 0.6 ? 0 : (1 - descProgress) * 30; // Move from 30px below to 0px

							gsap.set(descriptionText, {
								opacity: descOpacity,
								y: descTranslateY,
							});

							// Update position indicators
							const descTextOpacityValue =
								document.getElementById('desc-text-opacity-value');
							if (descTextOpacityValue) {
								descTextOpacityValue.textContent = `${(descOpacity * 100).toFixed(
									1,
								)}%`;
							}

							const descTextYValue = document.getElementById('desc-text-y-value');
							if (descTextYValue) {
								descTextYValue.textContent = `${descTranslateY.toFixed(1)}px`;
							}

							// Debug: Log description text values
							console.log(
								'Description Text Progress:',
								descProgress,
								'Opacity:',
								descOpacity,
								'TranslateY:',
								descTranslateY.toFixed(1) + 'px',
							);
						}

						// Push header behind when iMac starts zooming
						if (headerRef.current) headerRef.current.classList.add('behind-fullscreen');
						if (backgroundRef.current) gsap.set(backgroundRef.current, { zIndex: 1 });
					}

					// Phase 3: Show fullscreen iMac (60-100% progress)
					if (progress >= 0.6) {
						const fullscreenProgress = (progress - 0.6) / 0.4; // 0 to 1
						const fullscreenScale = 0.3 + fullscreenProgress * 0.7; // Scale from 0.3 to 1
						const fullscreenOpacity = fullscreenProgress; // Opacity from 0 to 1

						gsap.set(fullscreenIMacRef.current, {
							scale: fullscreenScale,
							opacity: fullscreenOpacity,
							zIndex: 9999, // Above everything
						});

						// Hide "Hey, I'm VE..." text when fullscreen appears
						const veText = iMacFrameRef.current?.querySelector('[data-ve-text="true"]');
						if (veText) {
							gsap.set(veText, {
								opacity: 0,
							});
						}

						// Update debug label
						if (fullscreenIMacRef.current) {
							fullscreenIMacRef.current.style.setProperty(
								'--debug-scale',
								`${(fullscreenScale * 100).toFixed(1)}%`,
							);
							fullscreenIMacRef.current.style.setProperty(
								'--debug-opacity',
								`${(fullscreenOpacity * 100).toFixed(1)}%`,
							);
						}

						// Update position indicator
						const fullscreenScaleValue =
							document.getElementById('fullscreen-scale-value');
						const fullscreenOpacityValue = document.getElementById(
							'fullscreen-opacity-value',
						);
						if (fullscreenScaleValue) {
							fullscreenScaleValue.textContent = `${(fullscreenScale * 100).toFixed(
								1,
							)}%`;
						}
						if (fullscreenOpacityValue) {
							fullscreenOpacityValue.textContent = `${(
								fullscreenOpacity * 100
							).toFixed(1)}%`;
						}

						// Show fullscreen component when it reaches 30% scale
						if (fullscreenProgress > 0.3) {
							fullscreenIMacRef.current?.classList.add('visible');
						}
					}
				},
			},
		});

		return () => {
			tl.kill();
			// Clean up VE text
			if (iMacFrameRef.current) {
				const veText = iMacFrameRef.current.querySelector('[data-ve-text="true"]');
				if (veText) gsap.set(veText, { opacity: 0 });
			}
		};
	}, []);

	return {
		downloadSectionRef,
		iMacFrameRef,
		fullscreenIMacRef,
		backgroundRef,
	};
};
