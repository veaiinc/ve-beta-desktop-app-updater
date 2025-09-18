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
		gsap.set(fullscreenIMacRef.current, { scale: 0.8, zIndex: -1 });
		gsap.set(backgroundRef.current, { zIndex: -1 });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: downloadSectionRef.current,
				start: 'top center',
				end: 'bottom center',
				scrub: true,
			},
		});

		// Step 1: Shrink the section slightly (optional)
		tl.to(downloadSectionRef.current, {
			scale: 0.95,
			ease: 'power2.out',
		});

		// Step 2: Zoom iMac into fullscreen
		tl.to(
			iMacFrameRef.current,
			{
				scale: 5, // adjust until it fills the viewport
				ease: 'power2.inOut',
				onStart: () => {
					// Push header and background behind
					if (headerRef.current) headerRef.current.classList.add('behind-fullscreen');
					if (backgroundRef.current) gsap.set(backgroundRef.current, { zIndex: 1 });
				},
			},
			'<',
		);

		// Step 3: Bring fullscreen iMac smoothly to front
		tl.to(
			fullscreenIMacRef.current,
			{
				scale: 1,
				zIndex: 9999,
				ease: 'power2.inOut',
				onStart: () => fullscreenIMacRef.current?.classList.add('visible'),
			},
			'<',
		);

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
