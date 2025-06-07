import React from 'react';

const Shape5 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
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
				d="M20 60C20 26.8629 46.8629 0 80 0C113.137 0 140 26.8629 140 60V160H20V60Z"
				fill={stickerFill || '#EFF1F3'}
				fillOpacity={opacity}
			/>
		</svg>
	);
};

export default Shape5;
