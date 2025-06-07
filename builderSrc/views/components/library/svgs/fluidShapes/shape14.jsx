import React from 'react';

const Shape14 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<path
				d="M160 25H0V135H160V25Z"
				fill={stickerFill || '#EFF1F3'}
				// stroke={stickerStroke || 'white'}
				stroke-width="4"
				fillOpacity={opacity}
			/>
		</svg>
	);
};

export default Shape14;
