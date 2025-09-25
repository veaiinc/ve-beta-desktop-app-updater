import { memo, forwardRef, useRef, useEffect, useState } from 'react';
import s from './iMacFrame.module.scss';
import BgLayerImage from '../../../assets/svg/landingScreen/Blue.svg';
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';

const iMacFrame = forwardRef(({ videoRef: externalVideoRef }, ref) => {
	const internalVideoRef = useRef(null);
	const containerRef = useRef(null);
	const [isZoomed, setIsZoomed] = useState(false);

	// Use external videoRef if provided, otherwise use internal one
	const videoRef = externalVideoRef || internalVideoRef;

	// Track zoom state by observing transform changes
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const checkZoomState = () => {
			const transform = container.style.transform;
			console.log('Transform:', transform); // Debug log

			const scale = transform.match(/scale\(([^)]+)\)/);
			if (scale) {
				const scaleValue = parseFloat(scale[1]);
				console.log('Scale value:', scaleValue); // Debug log
				const zoomed = scaleValue > 1.05; // Lowered threshold
				console.log('Is zoomed:', zoomed); // Debug log
				setIsZoomed(zoomed);
			} else {
				console.log('No scale found, setting zoomed to false'); // Debug log
				setIsZoomed(false);
			}
		};

		const observer = new MutationObserver(checkZoomState);

		observer.observe(container, {
			attributes: true,
			attributeFilter: ['style'],
		});

		// Also check immediately
		checkZoomState();

		return () => observer.disconnect();
	}, []);

	// Expose both video ref and container ref to parent component
	useEffect(() => {
		if (ref) {
			if (typeof ref === 'function') {
				ref({ videoRef, current: containerRef.current });
			} else {
				ref.current = { videoRef, current: containerRef.current };
			}
		}
	}, [ref, videoRef]);

	return (
		<div ref={containerRef} className={s.imacFrame}>
			<div className={s.screen}>
				<div className={s.screenContent}>
					<video
						ref={videoRef}
						src="https://us.images.ve.ai/public/dashboard/notch_final.mp4"
						className={`${s.screenImage} ${isZoomed ? s.hidden : ''}`}
						data-image="varya"
						loop
						muted
						playsInline
						preload="metadata"
					/>
					{/* Animated Glow Background - shows only when zoomed */}
					{isZoomed && (
						<div className={s.glowBackgroundContainer}>
							<AnimatedGlowBackground
								variant="default"
								intensity="medium"
								className={s.glowBackground}
							/>
						</div>
					)}

					{/* Fallback static background */}
					<img
						src={BgLayerImage}
						alt="VE Dashboard"
						className={s.screenImage}
						data-image="bg-layer"
					/>
				</div>
			</div>
			<div className={s.lens}>
				<div className={s.lensOuter}></div>
				<div className={s.lensInner}>
					<div className={s.lensReflection1}></div>
					<div className={s.lensReflection2}></div>
					<div className={s.lensReflection3}></div>
					<div className={s.lensReflection4}></div>
					<div className={s.lensReflection5}></div>
				</div>
			</div>
			<div className={s.textContainer}>
				{/* VE text overlay */}
				<div className={s.veText} data-ve-text="true">
					Hey, I'm VE — the living mind of your company.
				</div>
				{/* Additional description text */}
				<div className={s.descriptionText} data-description-text="true">
					I see your work across every integration, I remember everything, and I act
					before you ask. I keep a long-term evolving memory, read signals in real time,
					connect the dots, and align everything to your goals.
				</div>
				{/* Second description text */}
				<div className={s.descriptionText2} data-description-text-2="true">
					I plan the next moves, execute the heavy lifting, and get work done with your
					safe approvals. But I am more than assistance. I am Operating Intelligence the
					company brain that never sleeps. I run across your desktop, your meetings, and
					your workflows. I draft, schedule, follow up, and resolve blockers while you
					focus on vision.
				</div>
			</div>
		</div>
	);
});

iMacFrame.displayName = 'iMacFrame';

export default memo(iMacFrame);
