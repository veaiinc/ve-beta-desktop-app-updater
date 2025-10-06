import { memo, useMemo } from 'react';
import s from './animatedWave.module.scss';

function AnimatedWave({ variant = 'default' }) {
	// Dimensions from Meeting.svg rounded rect
	const width = 79.4702;
	const height = 31.7881;
	const rx = 15.894;

	// Inner padding and layout
	const paddingX = 6;
	const paddingY = 4;
	const gap = 4; // tighter spacing for smaller look
	const barWidth = 4; // slimmer pill bars
	const innerWidth = width - paddingX * 2;
	const innerHeight = height - paddingY * 2;

	// Pill bar heights approximating the Figma shape (centered vertically)
	const pillHeights = useMemo(() => {
		const maxH = innerHeight;
		return [
			0.5 * maxH, // left
			0.9 * maxH, // tallest
			0.75 * maxH, // tall
			0.4 * maxH, // short
			0.55 * maxH, // medium
			0.5 * maxH, // right
		];
	}, [innerHeight]);

	const delays = useMemo(() => ['0s', '0.12s', '0.24s', '0.36s', '0.24s', '0.12s'], []);
	const durations = useMemo(() => ['1.4s', '1.2s', '1.0s', '1.2s', '1.3s', '1.4s'], []);

	const positions = useMemo(() => {
		const count = pillHeights.length;
		const totalGaps = gap * (count - 1);
		const totalBars = barWidth * count;
		const available = innerWidth - totalGaps - totalBars;
		const startX = paddingX + Math.max(0, available / 2);
		return new Array(count).fill(0).map((_, i) => startX + i * (barWidth + gap));
	}, [pillHeights.length, innerWidth]);

	const clipId = 'animatedWaveRoundedClip';

	return (
		<div className={`${s.waveContainer} ${variant !== 'default' ? s[variant] : ''}`}>
			<svg
				className={s.waveSvg}
				width="100%"
				height="100%"
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="xMidYMid meet"
				role="img"
				aria-label="Audio level animation"
			>
				<defs>
					<clipPath id={clipId}>
						<rect x="0" y="0" width={width} height={height} rx={rx} />
					</clipPath>
				</defs>
				{/* Rounded rectangle background from Meeting.svg */}
				<rect
					x="0"
					y="0"
					width={width}
					height={height}
					rx={rx}
					fill="white"
					fillOpacity="0.1"
				/>

				{/* Pill bars clipped inside rounded rectangle */}
				<g clipPath={`url(#${clipId})`}>
					{positions.map((x, index) => {
						const h = pillHeights[index];
						const y = (height - h) / 2; // center vertically
						return (
							<rect
								key={index}
								x={x}
								y={y}
								width={barWidth}
								height={h}
								rx={barWidth / 2}
								className={s.pillBar}
								style={{ '--delay': delays[index], '--dur': durations[index] }}
							/>
						);
					})}
				</g>
			</svg>
		</div>
	);
}

export default memo(AnimatedWave);
