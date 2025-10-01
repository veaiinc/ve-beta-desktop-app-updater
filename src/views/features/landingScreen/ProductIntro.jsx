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
		const ctx = gsap.context(() => {
			const initializeGlowEffect = () => {
				if (!lightPassingRef.current) return false;

				const glowPaths = lightPassingRef.current.querySelectorAll(
					'#glow-path, #glow-path-intense, #white-glow-path, #white-glow-outer',
				);
				if (!glowPaths.length) return false;

				const pathLength = 3527;
				const dashLength = pathLength * 0.3;
				const gapLength = pathLength * 0.7;

				glowPaths.forEach((path) => {
					gsap.set(path, {
						strokeDasharray: `${dashLength} ${gapLength}`,
						strokeDashoffset: pathLength,
					});

					gsap.timeline({ repeat: -1, ease: 'none' })
						.to(path, {
							strokeDashoffset: -pathLength,
							duration: 14,
							ease: 'power2.inOut',
						})
						.set(path, { strokeDashoffset: pathLength });
				});

				return true;
			};

			if (!initializeGlowEffect()) {
				// Retry shortly if SVG not ready
				gsap.delayedCall(0.1, initializeGlowEffect);
			}
		});

		return () => ctx.revert();
	}, []);

	// Parallax scroll: largeNumber (slow) vs powersList/powerItems (fast)
	useEffect(() => {
		if (!powersContainerRef.current || !largeNumberRef.current || !powersListRef.current)
			return;

		const ctx = gsap.context(() => {
			const container = powersContainerRef.current;
			const largeNumber = largeNumberRef.current;
			const powersList = powersListRef.current;
			const hero = heroRef.current;

			// Check if we're on mobile (768px and below)
			const isMobile = window.innerWidth <= 768;

			if (isMobile) {
				// On mobile, only animate the powers list items, keep large number static
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
				return;
			}

			// Desktop/tablet parallax animation
			const containerHeight = container.offsetHeight;
			const viewportH = window.innerHeight;
			const baseDistance = containerHeight + viewportH;
			const fastFactor = 2.5;
			const fastDistance = Math.min(fastFactor * baseDistance, 1500);

			const listRect = powersList.getBoundingClientRect();
			const numRect = largeNumber.getBoundingClientRect();
			const listHeight = Math.max(powersList.scrollHeight, listRect.height);
			const numHeight = numRect.height;
			const endAlignDelta = Math.max(0, listHeight - numHeight);
			const slowDistance = endAlignDelta + 20;

			const setListY = gsap.quickTo(powersList, 'y', { duration: 0.55, ease: 'power3.out' });
			const setNumY = gsap.quickTo(largeNumber, 'y', { duration: 2.2, ease: 'power2.out' });
			const setGlowY = lightPassingRef.current
				? gsap.quickTo(lightPassingRef.current, 'y', { duration: 2.2, ease: 'power3.out' })
				: null;
			const setHeroY = hero
				? gsap.quickTo(hero, 'y', { duration: 0.55, ease: 'power3.out' })
				: null;

			ScrollTrigger.create({
				trigger: container,
				start: 'top bottom+600px',
				end: 'bottom top',
				scrub: 3.2,
				markers: false,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const p = self.progress;
					// Slower, smoother perceived motion for the large number while still finishing at end
					const easeNum = gsap.parseEase('power4.inOut');
					const pNum = easeNum(p) * 0.85 + p * 0.15;
					setListY(-(p * fastDistance));
					if (setHeroY) setHeroY(-(p * fastDistance));
					setNumY(-(pNum * slowDistance));
					if (setGlowY) setGlowY(-(p * fastDistance * 1.05));
				},
			});

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

			const onResize = () => ScrollTrigger.refresh();
			window.addEventListener('resize', onResize);

			// Ensure we clean listeners created within this context
			gsap.delayedCall(0, () => {
				ScrollTrigger.refresh();
			});

			return () => {
				window.removeEventListener('resize', onResize);
			};
		});

		return () => ctx.revert();
	}, []);

	return (
		<div ref={ref} className={s.ProductIntro}>
			{/* Animated Background Glow Effect */}
			{/* <div className={s.glowBackground}>
				<AnimatedGlowBackground variant="default" intensity="low" fitContent={true} />
			</div> */}

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
