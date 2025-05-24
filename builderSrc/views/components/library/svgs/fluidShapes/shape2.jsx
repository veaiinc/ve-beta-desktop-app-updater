import React from 'react';

const Shape2 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height={`${stretch ? '100%' : `100%`}`}
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17399)" id="shape2">
				<mask
					id="mask0_263_17399"
					style={{ maskType: 'luminance' }}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					// width="160"
					width={`${width}`}
					height="160"
				>
					<path
						d="M160 0H0V160H160V0Z"
						fill="white"
						style={{ fill: 'white', fillOpacity: 1 }}
					/>
				</mask>
				<g mask="url(#mask0_263_17399)">
					<path
						d="M128 0H32C14.3269 0 0 14.3269 0 32V128C0 145.673 14.3269 160 32 160H128C145.673 160 160 145.673 160 128V32C160 14.3269 145.673 0 128 0Z"
						fill={stickerFill || '#EFF1F3'}
						fillOpacity={opacity}
						// stroke={stickerStroke || 'white'}
						strokeWidth="4"
						width={'1000px'}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17399">
					<rect
						width="160"
						height="160"
						fill="white"
						style={{ fill: 'white', fillOpacity: 1 }}
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default Shape2;
