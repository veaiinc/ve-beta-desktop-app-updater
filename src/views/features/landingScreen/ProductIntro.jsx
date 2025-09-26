import { memo, forwardRef, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './productIntro.module.scss';
import { ReactComponent as LightPassingSvg } from '../../../assets/svg/landingScreen/LightPassing.svg';
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';

gsap.registerPlugin(ScrollTrigger);

const ProductIntro = forwardRef((props, ref) => {
	const lightPassingRef = useRef(null);

	const intelligenceTypes = [
		{
			number: '1',
			title: 'AMBIENT INTELLIGENCE',
			description:
				'Ambient Intelligence is designed to fade into the background while actively supporting you. It continuously senses your context, observes your behavior, and learns what matters most without requiring explicit commands. Instead of waiting to be prompted, it proactively surfaces the right information, suggestions, and reminders at the right time. This creates a seamless experience where work flows naturally, and you stay focused on what truly matters',
		},
		{
			number: '2',
			title: 'DESKTOP INTELLIGENCE',
			description:
				'Desktop Intelligence transforms your computer into a living, thinking workspace. It connects across your apps, documents, and activities to detect patterns, priorities, and blockers in real time. By understanding your focus, it provides timely nudges, shortcuts, and recommendations right where you work. Whether you’re writing, browsing, or multitasking, Desktop Intelligence keeps you organized, reduces cognitive load, and ensures nothing slips through the cracks.',
		},
		{
			number: '3',
			title: 'MEETING INTELLIGENCE',
			description:
				'Meeting Intelligence goes beyond simple note-taking it listens, understands, and remembers. In every meeting, it captures key points, decisions, and follow-ups while filtering out the noise. It identifies action items, risks, and opportunities, then translates them into clear, trackable outcomes. By acting as a persistent memory layer, it ensures your team leaves with clarity, accountability, and insights that drive progress long after the meeting ends.',
		},
		{
			number: '4',
			title: 'SUPER AGENTS',
			description:
				'Super Agents are autonomous, task-driven AIs built to act like powerful teammates. They don’t just assist they execute. From drafting reports to planning projects or automating workflows, they handle complexity end-to-end. Super Agents reason over context, coordinate with other agents, and adapt their actions based on outcomes. Always learning and evolving, they extend your capacity, giving you the ability to achieve more with less effort.',
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

	return (
		<div ref={ref} className={s.ProductIntro}>
			{/* Animated Background Glow Effect */}
			<div className={s.glowBackground}>
				<AnimatedGlowBackground variant="default" intensity="medium" fitContent={true} />
			</div>

			<div className={s.heroSection} data-hero-section="true">
				<h1 className={s.mainTitle}>
					Personal
					<br />
					Perspectives
				</h1>
				<p className={s.subtitle}>
					One intelligent system that listens, learns,and acts making search faster,
					meetings smarter, and work seamless
				</p>
			</div>

			<div className={s.intelligenceSection}>
				{intelligenceTypes.map((item, index) => (
					<div key={index} className={s.intelligenceItem}>
						<div className={s.content}>
							<h3 className={s.intelligenceTitle}>{item.title}</h3>
							<p className={s.intelligenceDescription}>{item.description}</p>
						</div>
						<div className={s.number}>{item.number}</div>
					</div>
				))}
			</div>

			<div ref={lightPassingRef} className={s.lightPassing}>
				<LightPassingSvg />
			</div>
		</div>
	);
});

ProductIntro.displayName = 'ProductIntro';

export default memo(ProductIntro);
