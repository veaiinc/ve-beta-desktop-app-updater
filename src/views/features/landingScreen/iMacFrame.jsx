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

			const scale = transform.match(/scale\(([^)]+)\)/);
			if (scale) {
				const scaleValue = parseFloat(scale[1]);

				const zoomed = scaleValue > 1.8; // Align with stage 1 end

				setIsZoomed(zoomed);
			} else {
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
						src="https://us.images.ve.ai/public/dashboard/notch_final_v3.mp4"
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
		</div>
	);
});

iMacFrame.displayName = 'iMacFrame';

export default memo(iMacFrame);
