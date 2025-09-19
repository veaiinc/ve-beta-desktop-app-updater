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
				end: 'bottom center',
				scrub: 1, // Smooth scrubbing
				onUpdate: (self) => {
					const progress = self.progress;

					// Phase 1: Decrease DownloadSection size as it goes under iMac (0-60% progress)
					if (progress < 0.6) {
						const sectionProgress = progress / 0.6; // 0 to 1
						const sectionScale = 1 - sectionProgress * 0.4; // Scale from 1 to 0.6

						gsap.set(downloadSectionRef.current, {
							scale: sectionScale,

							zIndex: 1, // Behind iMac frame
						});
					} else {
						// Keep section at minimum scale
						gsap.set(downloadSectionRef.current, {
							scale: 0.6,
							zIndex: 1,
						});
					}

					// Phase 2: Start iMac frame zoom (20-80% progress)
					if (progress >= 0.2) {
						const iMacProgress = (progress - 0.2) / 0.6; // 0 to 1
						const iMacScale = 1 + iMacProgress * 8; // Scale from 1 to 5

						gsap.set(iMacFrameRef.current, {
							scale: iMacScale,
							zIndex: 20, // Above DownloadSection
						});

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
		};
	}, []);

	return {
		downloadSectionRef,
		iMacFrameRef,
		fullscreenIMacRef,
		backgroundRef,
	};
};
