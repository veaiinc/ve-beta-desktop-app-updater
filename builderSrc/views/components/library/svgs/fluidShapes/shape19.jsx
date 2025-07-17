// import React from 'react';

const Shape19 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17578)">
				<mask
					id="mask0_263_17578"
					style={{ maskType: 'luminance' }}
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="160"
					height="160"
				>
					<path
						d="M160 0H0V160H160V0Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</mask>
				<g mask="url(#mask0_263_17578)">
					<path
						d="M0 0L80 30V40V80V120V130L0 160V0Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
					<path
						d="M80 30L160 0V160L80 130V120V80V40V30Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17578">
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

export default Shape19;
