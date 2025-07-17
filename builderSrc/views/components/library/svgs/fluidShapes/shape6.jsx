// import React from 'react';

const Shape6 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
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
				d="M140 60C140 26.8629 113.137 0 80 0C46.8629 0 20 26.8629 20 60V100C20 133.137 46.8629 160 80 160C113.137 160 140 133.137 140 100V60Z"
				fill={stickerFill || '#EFF1F3'}
				// stroke={stickerStroke || 'white'}
				stroke-width="4"
				fillOpacity={opacity}
			/>
		</svg>
	);
};

export default Shape6;
