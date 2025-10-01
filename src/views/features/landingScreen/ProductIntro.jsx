import { memo, forwardRef, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './productIntro.module.scss';
import { ReactComponent as LightPassingSvg } from '../../../assets/svg/landingScreen/LightPassing.svg';
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';

gsap.registerPlugin(ScrollTrigger);

const ProductIntro = forwardRef((props, ref) => {
	const lightPassingRef = useRef(null);
	const powersContainerRef = useRef(null);
	const largeNumberRef = useRef(null);
	const powersListRef = useRef(null);
	const heroRef = useRef(null);

	const corePowers = [
		{
			title: 'AMBIENT AWARENESS',
			description:
				'We continuously perceive context across tools, tasks, and signals, building a live memory of your world so Ve can anticipate needs and act before you even ask.',
		},
		{
			title: 'PROACTIVE MEMORY GRAPH',
			description:
				'We unify streams of information into a living graph that evolves with time, remembering everything and enabling reasoning that never forgets.',
		},
		{
			title: 'AUTONOMOUS MULTI-AGENTS',
			description:
				'We orchestrate specialized agents that plan, execute, and adapt together empowering workflows that feel less like automation and more like an intelligent team.',
		},
		{
			title: 'GOAL INTELLIGENCE',
			description:
				'We turn intentions into executable outcomes. From capturing a single goal to running entire workflows, Ve ensures progress without friction.',
		},
		{
			title: 'ADAPTIVE INTERFACES',
			description:
				'We shape the interface around you in real time. From voice to video to ambient cards, Ve delivers intelligence in the right form, in the right moment.',
		},
		{
			title: 'LIVING CONTINUITY',
			description:
				'We strive to give Ve permanence a system that never resets, never loses track, and grows with you, relentlessly, for all time.',
		},
	];

	useEffect(() => {
		const initializeGlowEffect = () => {
			if (!lightPassingRef.current) {
				console.warn('lightPassingRef.current is null');
				return false;
			}

			// Find all glow paths in the SVG
			const glowPaths = lightPassingRef.current.querySelectorAll(
				'#glow-path, #glow-path-intense, #white-glow-path, #white-glow-outer',
			);
			if (!glowPaths.length) {
				console.warn('glow paths not found in SVG');
				return false;
			}

			// Calculate path length for stroke-dasharray
			const pathLength = 3527; // Approximate path length
			const dashLength = pathLength * 0.3; // 30% of path length for dash
			const gapLength = pathLength * 0.7; // 70% for gap

			// Create a continuous loop animation for each glow path
			glowPaths.forEach((path, index) => {
				// Set initial stroke-dasharray
				gsap.set(path, {
					strokeDasharray: `${dashLength} ${gapLength}`,
					strokeDashoffset: pathLength,
				});

				// Create continuous flowing animation that goes from start to end
				const flowAnimation = gsap.timeline({ repeat: -1, ease: 'none' });

				flowAnimation
					.to(path, {
						strokeDashoffset: -pathLength,
						duration: 9, // 9 seconds to flow from start to end - slower
						ease: 'power2.inOut',
					})
					.set(path, {
						strokeDashoffset: pathLength, // Reset to start position
					});
			});

			return true;
		};

		// Try to initialize immediately
		if (initializeGlowEffect()) {
			return;
		}

		// If that fails, add a small delay and try again
		const timer = setTimeout(() => {
			initializeGlowEffect();
		}, 100);

		// Cleanup function
		return () => {
			clearTimeout(timer);
			// Kill all GSAP animations on glow paths
			const glowPaths = lightPassingRef.current?.querySelectorAll(
				'#glow-path, #glow-path-intense, #white-glow-path, #white-glow-outer',
			);
			if (glowPaths) {
				gsap.killTweensOf(glowPaths);
			}
		};
	}, []);

	// Parallax scroll: largeNumber (slow) vs powersList/powerItems (fast)
	useEffect(() => {
		if (!powersContainerRef.current || !largeNumberRef.current || !powersListRef.current)
			return;

		// Ensure elements are ready
		const container = powersContainerRef.current;
		const largeNumber = largeNumberRef.current;
		const powersList = powersListRef.current;
		const hero = heroRef.current;

		// Kill any existing triggers for safety on hot-reload
		ScrollTrigger.getAll()
			.filter((t) => t.trigger === container)
			.forEach((t) => t.kill());

		// Compute dynamic distances based on viewport and content height
		const containerHeight = container.offsetHeight;
		const viewportH = window.innerHeight;
		const verticalStartOffset = 0; // start at top baseline for both animations

		// Tunable factors for speed separation (slightly slower right side for smoothness)
		const fastFactor = 1.3; // right side speed multiplier

		const baseDistance = containerHeight + viewportH;
		const fastDistance = Math.min(fastFactor * baseDistance, 16000);

		// Compute a dynamic slow distance so largeNumber ends when list ends
		const listRect = powersList.getBoundingClientRect();
		const numRect = largeNumber.getBoundingClientRect();
		const listHeight = Math.max(powersList.scrollHeight, listRect.height);
		const numHeight = numRect.height;
		// target delta: how much we want the number to travel across the whole scroll
		const endAlignDelta = Math.max(0, listHeight - numHeight);
		// Use the full delta so the number reaches the end with the list, plus a small buffer
		const slowDistance = endAlignDelta + 20;

		// Single ScrollTrigger controls both elements for smoother sync
		// Smooth value setters to eliminate jitter on scroll
		const setListY = gsap.quickTo(powersList, 'y', { duration: 0.35, ease: 'power3.out' });
		const setNumY = gsap.quickTo(largeNumber, 'y', { duration: 0.75, ease: 'power2.out' });
		const setGlowY = lightPassingRef.current
			? gsap.quickTo(lightPassingRef.current, 'y', { duration: 0.4, ease: 'power3.out' })
			: null;
		const setHeroY = hero
			? gsap.quickTo(hero, 'y', { duration: 0.35, ease: 'power3.out' })
			: null;

		const masterTrigger = ScrollTrigger.create({
			trigger: container,
			start: 'top bottom+600px',
			end: 'bottom top',
			scrub: 0.6, // numeric scrub for gentle syncing
			markers: true,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				const p = self.progress; // 0..1
				// Apply parallax offsets with smoothing (both start at the same top baseline)
				setListY(-(p * fastDistance));
				if (setHeroY) setHeroY(-(p * fastDistance));
				setNumY(-(p * slowDistance));
				if (setGlowY) {
					// Move glow slightly faster than list for emphasis
					setGlowY(-(p * fastDistance * 1.15));
				}
			},
		});

		// Optional: slight stagger reveal for items to enhance perceived speed
		const items = powersList.querySelectorAll(`.${s.powerItem}`);
		if (items.length) {
			gsap.fromTo(
				items,
				{ y: 40, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					stagger: 0.1,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: container,
						start: 'top 80%',
						end: 'top 40%',
						scrub: false,
						once: true,
					},
				},
			);
		}

		const onResize = () => {
			ScrollTrigger.refresh();
		};
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
			masterTrigger?.kill();
		};
	}, []);

	return (
		<div ref={ref} className={s.ProductIntro}>
			{/* Animated Background Glow Effect */}
			<div className={s.glowBackground}>
				<AnimatedGlowBackground variant="default" intensity="medium" fitContent={true} />
			</div>

			<div className={s.corePowersSection}>
				<div ref={powersContainerRef} className={s.powersContainer}>
					<div ref={largeNumberRef} className={s.largeNumber}>
						6
					</div>
					{/* LightPassing separator between left and right columns */}
					<div ref={lightPassingRef} className={s.lightPassing}>
						<LightPassingSvg />
					</div>
					<div className={s.rightColumn}>
						<div ref={heroRef} className={s.heroSection} data-hero-section="true">
							<h1 className={s.mainTitle}>Guiding Powers</h1>
							<p className={s.subtitle}>
								Through the seamless integration of our 6 core powers, we set in
								motion Ve.ai's relentless intelligence, focus, and autonomy.
							</p>
						</div>
						<div ref={powersListRef} className={s.powersList}>
							{corePowers.map((power, index) => (
								<div key={index} className={s.powerItem}>
									<div className={s.powerHeader}>
										<div className={s.powerDot}></div>
										<h3 className={s.powerTitle}>{power.title}</h3>
									</div>
									<p className={s.powerDescription}>{power.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className={s.coFounderSection}>
				<h2 className={s.coFounderTitle}>
					Your True <br /> Co-Founder
				</h2>
				<p className={s.coFounderDescription}>
					An intelligence that learns you, grows with you, and relentlessly pushes your
					vision forward as if it were its own.
				</p>
			</div>
		</div>
	);
});

ProductIntro.displayName = 'ProductIntro';

export default memo(ProductIntro);
