import { memo } from 'react';
import s from './animatedGlowBackground.module.scss';

const AnimatedGlowBackground = memo(
	({
		variant = 'default',
		intensity = 'medium',
		fitContent = false,
		className = '',
		children,
	}) => {
		const getGlowBalls = () => {
			const variants = {
				default: [
					{ size: '0.8', speed: '18s', delay: '0s' },
					{ size: '0.6', speed: '22s', delay: '-8s' },
					{ size: '0.4', speed: '16s', delay: '-4s' },
				],
				intense: [
					{ size: '1.0', speed: '14s', delay: '0s' },
					{ size: '0.8', speed: '18s', delay: '-6s' },
					{ size: '0.6', speed: '16s', delay: '-3s' },
					{ size: '0.4', speed: '20s', delay: '-9s' },
				],
				subtle: [
					{ size: '0.5', speed: '26s', delay: '0s' },
					{ size: '0.3', speed: '30s', delay: '-12s' },
				],
				fast: [
					{ size: '0.7', speed: '10s', delay: '0s' },
					{ size: '0.5', speed: '12s', delay: '-3s' },
					{ size: '0.3', speed: '9s', delay: '-1s' },
				],
			};

			return variants[variant] || variants.default;
		};

		const getIntensityClass = () => {
			const intensities = {
				low: s.lowIntensity,
				medium: s.mediumIntensity,
				high: s.highIntensity,
			};
			return intensities[intensity] || intensities.medium;
		};

		return (
			<div
				className={`${s.animatedGlowBackground} ${getIntensityClass()} ${
					fitContent ? s.fitContent : ''
				} ${className}`}
			>
				<div className={s.glowContainer}>
					{getGlowBalls().map((ball, index) => (
						<div
							key={index}
							className={s.ball}
							style={{
								'--size': ball.size,
								'--speed': ball.speed,
								'--delay': ball.delay,
							}}
						/>
					))}
				</div>
				{children}
			</div>
		);
	},
);

AnimatedGlowBackground.displayName = 'AnimatedGlowBackground';

export default AnimatedGlowBackground;
