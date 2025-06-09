setupAnimation = () => {
	// for scroll fade
	const fadeTween = gsap.fromTo(
		element,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1,
			ease: 'none', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// for scroll move
	const moveTween = gsap.fromTo(
		element,
		{
			y: 200,
			x: 200,
			opacity: 0,
		},
		{
			y: 0,
			x: 0,
			opacity: 1,
			duration: 3,
			ease: 'power2.inOut', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// scroll expand
	const expandTween = gsap.fromTo(
		element,
		{
			y: 100,
			x: 100,
			opacity: 0,
		},
		{
			y: 0,
			x: 0,
			opacity: 1,
			duration: speed || 3,
			ease: 'power2.inOut', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);
	// scroll shrink
	const shrinkTween = gsap.fromTo(
		element,
		{
			y: parseFloat(getDirectionOffset(direction, intensity).y) || 100,
			x: parseFloat(getDirectionOffset(direction, intensity).x) || 100,
			opacity: 0,
			scale: parseFloat(scale),
		},
		{
			y: 0,
			x: 0,
			scale: 1,
			opacity: 1,
			duration: speed || 3,
			ease: 'power2.inOut', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// spin scroll
	const spinTween = gsap.fromTo(
		element,
		{
			rotation: spinDegrees || 360,
			scale: scale,
		},
		{
			rotate: 0,
			scale: 1,
			duration: 3,
			ease: 'power2.inOut', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// slide scroll
	const slideTween = gsap.fromTo(
		element,
		{
			y: direction == 'top' || direction == 'down' ? returnDistance(direction) : 0,
			x: direction == 'left' || direction == 'right' ? returnDistance(direction) : 0,
		},
		{
			y: 0,
			x: 0,
			duration: 3,
			ease: 'power2.inOut', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// blur scroll
	const blurTween = gsap.fromTo(
		element,
		{
			filter: `blur(10px)`,
		},
		{
			filter: 'blur(0px)',
			duration: 1,
			ease: 'none', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// reveal scroll
	const revealTween = gsap.fromTo(
		element,
		{
			opacity: 0,
			clipPath: clipStart,
		},
		{
			opacity: 1,
			clipPath: 'inset(0% 0% 0% 0%)',
			duration: 2,
			ease: 'none', // Important: disables default easing
			paused: true, // Required since we're manually controlling with .progress()
		},
	);

	// 3dspin scroll
	const tl = gsap.timeline({ paused: true });
	tl.fromTo(
		element,
		{
			opacity: 0,
			transformPerspective: 1000,
			rotateX: 360,
			rotateY: 360,
			scale: 0.2,
		},
		{
			transformPerspective: 1000,
			opacity: 1,
			rotateX: 180,
			rotateY: 180,
			scale: 0.6,
			duration: 2,
		},
	).to(element, {
		rotateX: 0,
		rotateY: 0,
		scale: 1,
		duration: 1,
	});

	// fly scroll
	const flyTween = gsap.fromTo(
		element,
		{
			x: translate,
			skewX: skew,
		},
		{
			x: 0,
			skewX: 0,
			duration: 1,
			ease: 'none',
			paused: true,
		},
	);

	// turn scroll
	const turnTween = gsap.fromTo(
		element,
		{
			x: translateX,
			z: -200,
			rotationZ: rotateZ,
			scale: parseFloat(scale),
			opacity: 0,
			transformStyle: 'preserve-3d',
			transformPerspective: 1000,
		},
		{
			x: 0,
			z: 0,
			rotationZ: 0,
			scale: 1,
			opacity: 1,
			duration: 3,
			ease: 'none',
			paused: true,
			// ease: 'power2.out',
		},
	);

	// tilt scroll
	const tiltTween = gsap.fromTo(
		element,
		{
			z: zValue,
			rotationX: rotateX,
			rotationY: rotateY, // Matches --rotate-y CSS variable
			rotation: rotate,
			scale: 0.95,
			duration: speed,
			transformStyle: 'preserve-3d',
			transformPerspective: 400,
		},
		{
			z: 0,
			rotationX: 0,
			rotationY: 0,
			rotation: 0,
			scale: 1,
			duration: 2,
			ease: 'none',
			paused: true,
		},
	);

	// stretch scroll
	const stretchTween = gsap.fromTo(
		element,
		{
			scaleX: 1.4,
			scaleY: 0.6,
			y: '40%',
			duration: 2,
			transformStyle: 'preserve-3d',
			transformPerspective: 400,
		},
		{
			scaleX: 1,
			scaleY: 1,
			y: 0,
			duration: 2,
			ease: 'none',
			paused: true,
		},
	);

	// flip scroll
	const flipTween = gsap.fromTo(
		element,
		{
			rotationY: -360,
			rotationX: 360,
			scale: 0.95,
			duration: 2,
			transformStyle: 'preserve-3d',
			transformPerspective: 400,
		},
		{
			rotationY: 0,
			rotationX: 0,
			scale: 1,
			duration: 4,
			ease: 'none',
			paused: true,
		},
	);

	// parallax scroll
	const parallaxTween = gsap.fromTo(
		element,
		{
			y: 259.524 * intensity,
			opacity: 1,
			duration: 2,
			transformStyle: 'preserve-3d',
			transformPerspective: 400,
		},
		{
			y: 0,
			duration: 4,
			ease: 'none',
			paused: true,
		},
	);

	// ! scroll arc
	const arcTween = gsap.fromTo(
		element,
		{
			z: 400,
			rotationX: direction === 'horizontal' ? 0 : -65,
			rotationY: direction === 'horizontal' ? -55 : 0,
			y: direction === 'horizontal' ? 0 : 200,
			x: direction === 'horizontal' ? -200 : 0,
			scale: 1.3,
		},
		{
			z: 0,
			y: 0,
			x: 0,
			rotationX: 0,
			rotationY: 0,
			scale: 1,
			duration: speed || 2,
			ease: 'none',
			paused: true,
		},
	);

	// ! scroll shape
	// shape animation
	// circle shape
	// clipPath: 'circle(0% at center)', //start point
	// clipPath: 'circle(150% at center)',//endpoint
	// square shape
	// clipPath: 'inset(50% round 0%)', //start point
	// clipPath: 'inset(0% round 0%)'',//endpoint
	// ellipse shape
	// clipPath: 'ellipse(0% 0% at center)', //start point
	// clipPath: 'ellipse(100% 60% at center )'',//endpoint
	// diamond shape
	// clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', //start point
	// clipPath: 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)',//endpoint
	const shapeTween = gsap.fromTo(
		element,
		{
			clipPath: shapeMap[direction]?.start || 'circle(0% at center)',
		},
		{
			clipPath: shapeMap[direction]?.end || `circle(150% at center)`,
			duration: 2,
			ease: 'none',
			paused: true,
		},
	);

	// for scroll shutters animations
	// 1. RIGHT TO LEFT (Your current animation, slightly optimized)
	// Set initial state (completely hidden shutters)
	// gsap.set(this.spinRef.current, {
	//   clipPath:
	//     "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)",
	// });

	// // Animation
	// gsap.to(this.spinRef.current, {
	//   duration: 3,
	//   ease: "power2.out",
	//   clipPath:
	//     "polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 18% 100%, 18% 0%, 16% 0%, 16% 100%, 28.8686% 100%, 28.8686% 0%, 25% 0%, 25% 100%, 40.8383% 100%, 40.8383% 0%, 33% 0%, 33% 100%, 54.7777% 100%, 54.7777% 0%, 41% 0%, 41% 100%, 69.707% 100%, 69.707% 0%, 50% 0%, 50% 100%, 86.6262% 100%, 86.6262% 0%, 58% 0%, 58% 100%, 104.525% 100%, 104.525% 0%, 66% 0%, 66% 100%, 123.414% 100%, 123.414% 0%, 75% 0%, 75% 100%, 144.293% 100%, 144.293% 0%, 83% 0%, 83% 100%, 167.141% 100%, 167.141% 0%, 91% 0%, 91% 100%, 189.99% 100%, 199.99% 0%)",
	//   scrollTrigger: {
	//     trigger: this.spinRef.current,
	//     start: "top center",
	//     end: "center top",
	//     scrub: true,
	//     markers: true,
	//   },
	// });
	// // 2. LEFT TO RIGHT ANIMATION
	// // Set initial state (completely hidden shutters)
	// gsap.set(this.spinRef.current, {
	//   clipPath:
	//     "polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%, 92% 0%, 92% 100%, 92% 100%, 92% 0%, 84% 0%, 84% 100%, 84% 100%, 84% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 67% 0%, 67% 100%, 67% 100%, 67% 0%, 59% 0%, 59% 100%, 59% 100%, 59% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 42% 0%, 42% 100%, 42% 100%, 42% 0%, 34% 0%, 34% 100%, 34% 100%, 34% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 17% 0%, 17% 100%, 17% 100%, 17% 0%, 9% 0%, 9% 100%, 9% 100%, 9% 0%)",
	// });

	// // Animation
	// gsap.to(this.spinRef.current, {
	//   duration: 3,
	//   ease: "power2.out",
	//   clipPath:
	//     "polygon(100% 0%, 100% 100%, 92% 100%, 92% 0%, 92% 0%, 92% 100%, 82% 100%, 82% 0%, 84% 0%, 84% 100%, 71.1314% 100%, 71.1314% 0%, 75% 0%, 75% 100%, 59.1617% 100%, 59.1617% 0%, 67% 0%, 67% 100%, 45.2223% 100%, 45.2223% 0%, 59% 0%, 59% 100%, 30.293% 100%, 30.293% 0%, 50% 0%, 50% 100%, 13.3738% 100%, 13.3738% 0%, 42% 0%, 42% 100%, -4.525% 100%, -4.525% 0%, 34% 0%, 34% 100%, -23.414% 100%, -23.414% 0%, 25% 0%, 25% 100%, -44.293% 100%, -44.293% 0%, 17% 0%, 17% 100%, -67.141% 100%, -67.141% 0%, 9% 0%, 9% 100%, -89.99% 100%, -99.99% 0%)",
	//   scrollTrigger: {
	//     trigger: this.spinRef.current,
	//     start: "top center",
	//     end: "center top",
	//     scrub: true,
	//     markers: true,
	//   },
	// });

	// // 3. TOP TO BOTTOM ANIMATION
	// // Set initial state (completely hidden horizontal shutters)
	// gsap.set(this.spinRef.current, {
	//   clipPath:
	//     "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 8%, 100% 8%, 100% 8%, 0% 8%, 0% 16%, 100% 16%, 100% 16%, 0% 16%, 0% 25%, 100% 25%, 100% 25%, 0% 25%, 0% 33%, 100% 33%, 100% 33%, 0% 33%, 0% 41%, 100% 41%, 100% 41%, 0% 41%, 0% 50%, 100% 50%, 100% 50%, 0% 50%, 0% 58%, 100% 58%, 100% 58%, 0% 58%, 0% 66%, 100% 66%, 100% 66%, 0% 66%, 0% 75%, 100% 75%, 100% 75%, 0% 75%, 0% 83%, 100% 83%, 100% 83%, 0% 83%, 0% 91%, 100% 91%, 100% 91%, 0% 91%)",
	// });

	// // Animation
	// gsap.to(this.spinRef.current, {
	//   duration: 3,
	//   ease: "power2.out",
	//   clipPath:
	//     "polygon(0% 0%, 100% 0%, 100% 8%, 0% 8%, 0% 8%, 100% 8%, 100% 18%, 0% 18%, 0% 16%, 100% 16%, 100% 28.8686%, 0% 28.8686%, 0% 25%, 100% 25%, 100% 40.8383%, 0% 40.8383%, 0% 33%, 100% 33%, 100% 54.7777%, 0% 54.7777%, 0% 41%, 100% 41%, 100% 69.707%, 0% 69.707%, 0% 50%, 100% 50%, 100% 86.6262%, 0% 86.6262%, 0% 58%, 100% 58%, 100% 104.525%, 0% 104.525%, 0% 66%, 100% 66%, 100% 123.414%, 0% 123.414%, 0% 75%, 100% 75%, 100% 144.293%, 0% 144.293%, 0% 83%, 100% 83%, 100% 167.141%, 0% 167.141%, 0% 91%, 100% 91%, 100% 189.99%, 0% 199.99%)",
	//   scrollTrigger: {
	//     trigger: this.spinRef.current,
	//     start: "top center",
	//     end: "center top",
	//     scrub: true,
	//     markers: true,
	//   },
	// });

	gsap.set(this.spinRef.current, {
		clipPath:
			'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%, 0% 92%, 100% 92%, 100% 92%, 0% 92%, 0% 84%, 100% 84%, 100% 84%, 0% 84%, 0% 75%, 100% 75%, 100% 75%, 0% 75%, 0% 67%, 100% 67%, 100% 67%, 0% 67%, 0% 59%, 100% 59%, 100% 59%, 0% 59%, 0% 50%, 100% 50%, 100% 50%, 0% 50%, 0% 42%, 100% 42%, 100% 42%, 0% 42%, 0% 34%, 100% 34%, 100% 34%, 0% 34%, 0% 25%, 100% 25%, 100% 25%, 0% 25%, 0% 17%, 100% 17%, 100% 17%, 0% 17%, 0% 9%, 100% 9%, 100% 9%, 0% 9%)',
	});

	// Animation
	gsap.to(this.spinRef.current, {
		duration: 5,
		ease: 'power2.out',
		clipPath:
			'polygon(0% 100%, 100% 100%, 100% 92%, 0% 92%, 0% 92%, 100% 92%, 100% 82%, 0% 82%, 0% 84%, 100% 84%, 100% 71.1314%, 0% 71.1314%, 0% 75%, 100% 75%, 100% 59.1617%, 0% 59.1617%, 0% 67%, 100% 67%, 100% 45.2223%, 0% 45.2223%, 0% 59%, 100% 59%, 100% 30.293%, 0% 30.293%, 0% 50%, 100% 50%, 100% 13.3738%, 0% 13.3738%, 0% 42%, 100% 42%, 100% -4.525%, 0% -4.525%, 0% 34%, 100% 34%, 100% -23.414%, 0% -23.414%, 0% 25%, 100% 25%, 100% -44.293%, 0% -44.293%, 0% 17%, 100% 17%, 100% -67.141%, 0% -67.141%, 0% 9%, 100% 9%, 100% -89.99%, 0% -99.99%)',
		scrollTrigger: {
			trigger: this.spinRef.current,
			start: 'top center',
			end: 'center top',
			scrub: true,
			markers: true,
		},
	});
};
