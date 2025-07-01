// import React from 'react';

const Shape8 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
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
				d="M20 0H140V24C140 57.1371 113.137 84 80 84C46.8629 84 20 57.1371 20 24V0Z"
				fill={stickerFill || '#EFF1F3'}
				fillOpacity={opacity}
				// stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
			<path
				d="M20 136C20 102.863 46.8629 76 80 76C113.137 76 140 102.863 140 136V160H20V136Z"
				fill={stickerFill || '#EFF1F3'}
				// stroke={stickerStroke || 'white'}
				stroke-width="4"
				fillOpacity={opacity}
			/>
		</svg>
	);
};

export default Shape8;
