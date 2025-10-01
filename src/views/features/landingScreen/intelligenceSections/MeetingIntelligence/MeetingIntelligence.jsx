import { memo, useRef, useLayoutEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import AnimatedIntro from '../animations/AnimatedIntro';
import MeetingIntelligenceUI from './MeetingIntelligenceUI';
import s from '../animations/animatedSection.module.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const MeetingIntelligence = memo(function MeetingIntelligence() {
	const containerRef = useRef(null);
	const introRef = useRef(null);
	const actionsRef = useRef(null);
	const initialContainerTopRef = useRef(0);
	const [currentActionsCard, setCurrentActionsCard] = useState(0);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			initialContainerTopRef.current = rect.top + window.scrollY;
		}
	}, []);

	useGSAP(() => {
		const triggers = ScrollTrigger.getAll();
		triggers.forEach((t) => {
			if (t.trigger === containerRef.current) {
				t.kill();
			}
		});

		const container = containerRef.current;
		const intro = introRef.current;
		const actions = actionsRef.current;

		if (!container || !intro || !actions) return;

		gsap.set(actions, {
			clipPath: 'ellipse(220% 200% at 50% 300%)',
			opacity: 0,
			willChange: 'clip-path, opacity, transform',
			backfaceVisibility: 'hidden',
			transform: 'translateZ(0)',
			transformStyle: 'flat',
		});

		gsap.set(intro, {
			opacity: 1,
			y: 0,
		});

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: '+=1000%', // Increased scroll distance for more animation time
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			refreshPriority: -1, // Lower priority to avoid conflicts
		});

		ScrollTrigger.create({
			trigger: container,
			start: 'top top',
			end: '+=1000%', // Increased scroll distance for more animation time
			scrub: 1,
			refreshPriority: -1, // Lower priority to avoid conflicts
			onUpdate: (self) => {
				const progress = self.progress;

				if (progress <= 0.15) {
					const introProgress = progress / 0.15;
					gsap.set(intro, {
						opacity: 1 - introProgress,
						y: -50 * introProgress,
					});
				} else {
					gsap.set(intro, {
						opacity: 0,
						y: -50,
					});
				}

				if (progress >= 0.1) {
					const actionsProgress = Math.min(1, (progress - 0.1) / 0.05);
					const clipY = 300 - actionsProgress * 125;
					const opacity = Math.min(1, actionsProgress * 1.2);

					gsap.set(actions, {
						clipPath: `ellipse(220% 200% at 50% ${clipY}%)`,
						opacity: opacity,
					});
				} else {
					gsap.set(actions, {
						clipPath: 'ellipse(220% 200% at 50% 300%)',
						opacity: 0,
					});
				}

				if (progress >= 0.15) {
					const actionsScrollProgress = (progress - 0.15) / 0.85;
					setCurrentActionsCard(actionsScrollProgress);
				}
			},
			onEnter: () => {
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
				});
				gsap.set(intro, {
					opacity: 0,
					y: -50,
				});
			},
			onLeave: () => {
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 175%)',
					opacity: 1,
				});
			},
			onEnterBack: () => {
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
				});
				gsap.set(intro, {
					opacity: 1,
					y: 0,
				});
			},
			onLeaveBack: () => {
				gsap.set(actions, {
					clipPath: 'ellipse(220% 200% at 50% 300%)',
					opacity: 0,
				});
			},
		});

		return () => {
			const triggers = ScrollTrigger.getAll();
			triggers.forEach((t) => {
				if (t.trigger === containerRef.current) {
					t.kill();
				}
			});
		};
	}, []);

	const handleDismiss = () => {
		console.log('Meeting Intelligence: Dismiss clicked');
	};

	const handleSend = () => {
		console.log('Meeting Intelligence: Send clicked');
	};

	return (
		<div ref={containerRef} className={s.animatedSectionContainer}>
			<div ref={introRef} className={s.introSection}>
				<AnimatedIntro
					title="Meeting Intelligence"
					subhead="Not just notes. True awareness. It remembers, decides, and follows up."
				/>
			</div>
			<div ref={actionsRef} className={s.actionsSection}>
				<MeetingIntelligenceUI
					parentScrollProgress={currentActionsCard}
					onDismiss={handleDismiss}
					onSend={handleSend}
					sectionId="MeetingIntelligence"
				/>
			</div>
		</div>
	);
});

export default MeetingIntelligence;
