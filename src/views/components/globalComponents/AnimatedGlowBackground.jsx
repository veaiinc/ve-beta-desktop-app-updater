import { memo } from 'react';
import s from './animatedGlowBackground.module.scss';

const AnimatedGlowBackground = memo(
	({ variant = 'default', intensity = 'medium', className = '', children }) => {
		const getGlowBalls = () => {
			const variants = {
				default: [
					{ size: '0.6', speed: '12s', delay: '0s' },
					{ size: '0.4', speed: '15s', delay: '-8s' },
					{ size: '0.3', speed: '10s', delay: '-4s' },
				],
				intense: [
					{ size: '0.8', speed: '8s', delay: '0s' },
					{ size: '0.6', speed: '12s', delay: '-6s' },
					{ size: '0.4', speed: '10s', delay: '-3s' },
					{ size: '0.2', speed: '14s', delay: '-9s' },
				],
				subtle: [
					{ size: '0.4', speed: '20s', delay: '0s' },
					{ size: '0.3', speed: '25s', delay: '-10s' },
				],
				fast: [
					{ size: '0.5', speed: '6s', delay: '0s' },
					{ size: '0.3', speed: '8s', delay: '-3s' },
					{ size: '0.2', speed: '5s', delay: '-1s' },
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
			<div className={`${s.animatedGlowBackground} ${getIntensityClass()} ${className}`}>
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
