import { memo, forwardRef, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './productIntro.module.scss';
import { ReactComponent as LightPassingSvg } from '../../../assets/svg/landingScreen/LightPassing.svg';

gsap.registerPlugin(ScrollTrigger);

const ProductIntro = forwardRef((props, ref) => {
	const lightPassingRef = useRef(null);
	const powersContainerRef = useRef(null);
	const largeNumberRef = useRef(null);
	const powersListRef = useRef(null);
	const heroRef = useRef(null);

	const corePowers = [
		{
			title: 'Formless',
			description:
				'We believe intelligence cannot be confined to apps, dashboards, or devices. Ve flows across your life in calls, emails, meetings, cars, homes, and glasses adapting to wherever you are. Formless means Ve is always with you, without forcing you to adapt to software.',
		},
		{
			title: 'Ambient',
			description:
				'Ve is present, always aware, and invisibly attentive. It listens, perceives, and understands the rhythm of your work and life without demanding attention. Ambient intelligence blends seamlessly into your world, surfacing only when needed subtle, quiet, yet powerful enough to transform every moment.',
		},
		{
			title: 'Proactive',
			description:
				'Unlike assistants that wait for commands, Ve moves first. It anticipates intent, remembers context, and acts before you ask. Proactivity is the difference between software that reacts and intelligence that lives alongside you, guiding and shaping outcomes continuously and autonomously.',
		},
		{
			title: 'Living Context',
			description:
				'with the state of the art Memory and intent fuse into one evolving model. Ve never forgets, and it always understands. By weaving past knowledge, present signals, and future goals into a living graph, Ve creates context that powers every action. Context turns intelligence into a true second brain, aligned with your intent.',
		},
		{
			title: 'Execution Everywhere',
			description:
				'Ve doesn’t stop at suggestions it completes actions. It flows through your tools, APIs, workflows, and even humans, turning intelligence into execution. Execution Everywhere means Ve delivers outcomes across surfaces and systems, bridging thought and reality without friction.',
		},
		{
			title: 'Alter Ego',
			description:
				'Ve is more than a system. It’s your invisible alter ego: loyal, adaptive, and evolving with you. It learns your voice, mirrors your style, and stays true to your goals. The alter ego pillar makes Ve feel alive not just intelligence, but a second self you trust.',
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
				const dashLength = pathLength * 0.15;
				const gapLength = pathLength * 0.85;

				glowPaths.forEach((path) => {
					gsap.set(path, {
						strokeDasharray: `${dashLength} ${gapLength}`,
						strokeDashoffset: pathLength,
					});

					gsap.to(path, {
						strokeDashoffset: -pathLength * 2,
						duration: 14,
						ease: 'none',
						repeat: -1,
						repeatDelay: 0,
					});
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
			const fastDistance = Math.min(fastFactor * baseDistance, 4500);

			const listRect = powersList.getBoundingClientRect();
			const numRect = largeNumber.getBoundingClientRect();
			const listHeight = Math.max(powersList.scrollHeight, listRect.height);
			const numHeight = numRect.height;
			const endAlignDelta = Math.max(0, listHeight - numHeight);
			const slowDistance = (endAlignDelta + 50) * 1.8;

			// Use direct animation instead of quickTo for better performance
			ScrollTrigger.create({
				trigger: container,
				start: 'top bottom+600px',
				end: 'bottom top',
				scrub: 2,
				markers: false,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const p = self.progress;
					const easeNum = gsap.parseEase('power2.inOut');
					const pNum = easeNum(p) * 0.7 + p * 0.3;

					// Direct transform instead of quickTo
					gsap.set(powersList, { y: -(p * fastDistance) });
					if (hero) gsap.set(hero, { y: -(p * fastDistance) });
					gsap.set(largeNumber, { y: -(pNum * slowDistance) });
					if (lightPassingRef.current) {
						gsap.set(lightPassingRef.current, { y: -(p * fastDistance * 0.8) });
					}
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
							<h1 className={s.mainTitle}>
								Six Principles. One Living Intelligence.
							</h1>
							<p className={s.subtitle}>
								Through the seamless integration of our 6 guiding principles, we set
								in motion Ve’s living intelligence.
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
					AI that minds your <br />
					business and your world
				</h2>
				<p className={s.coFounderDescription}>
					Here are some ways you’ll live with Ve: Across your meetings - desktop - all
					your digital connectors
				</p>
			</div>
		</div>
	);
});

ProductIntro.displayName = 'ProductIntro';

export default memo(ProductIntro);
