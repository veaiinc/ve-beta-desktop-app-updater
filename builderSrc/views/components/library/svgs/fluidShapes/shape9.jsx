// import React from 'react';

const Shape9 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clip-path="url(#clip0_263_17486)">
				<mask
					id="mask0_263_17486"
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
				<g mask="url(#mask0_263_17486)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 27.8261C0 12.4582 12.4582 0 27.8261 0H132.174C147.542 0 160 12.4582 160 27.8261C160 39.7807 152.461 49.9745 141.879 53.913C152.461 57.8516 160 68.0454 160 80C160 91.9546 152.461 102.148 141.879 106.087C152.461 110.025 160 120.219 160 132.174C160 147.542 147.542 160 132.174 160H27.8261C12.4582 160 0 147.542 0 132.174C0 120.219 7.53864 110.025 18.1213 106.087C7.53864 102.148 0 91.9546 0 80C0 68.0454 7.53864 57.8516 18.1213 53.913C7.53865 49.9745 0 39.7807 0 27.8261Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17486">
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

export default Shape9;
