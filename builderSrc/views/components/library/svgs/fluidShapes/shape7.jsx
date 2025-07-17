// import React from 'react';

const Shape7 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17451)">
				<mask
					id="mask0_263_17451"
					style={{ maskType: 'luminance' }}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="160"
					height="160"
				>
					<path
						d="M160 0H0V160H160V0Z"
						fill="white"
						style={{ fill: 'white', fillOpacity: opacity }}
					/>
				</mask>
				<g mask="url(#mask0_263_17451)">
					<path
						d="M46 15.157H36C35 27.5005 24.1565 26.6373 20 26.6795V132.914C29.9755 132.914 35 134 36 144.563L46 144.564C77.2176 172.522 102.313 156.212 114 144.563H124C126 132.914 135.501 133.125 140 132.914V26.6795C131 26.6795 125 24.5005 124 15.157L114 15.1566C82.1956 -12.2946 57.6381 3.71901 46 15.157Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17451">
					<rect
						width="160"
						height="160"
						fill="white"
						style={{ fill: 'white', fillOpacity: opacity }}
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default Shape7;
