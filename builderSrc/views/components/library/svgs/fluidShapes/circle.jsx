// import React from 'react';

const CircleSticker = ({
	stickerFill,
	stickerStroke,
	width,
	opacity,
	stretch,
	stretchWidth,
	stretchHeight,
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height={`${stretch ? '100%' : `100%`}`}
			viewBox="0 0 265 266"
			fill="none"
			fillOpacity={opacity}
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<path
				d="M132.5 263.273C204.573 263.273 263 204.847 263 132.773C263 60.7003 204.573 2.27344 132.5 2.27344C60.4268 2.27344 2 60.7003 2 132.773C2 204.847 60.4268 263.273 132.5 263.273Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				strokeWidth="4"
				fillOpacity={opacity}
			/>
		</svg>
	);
};
export default CircleSticker;
