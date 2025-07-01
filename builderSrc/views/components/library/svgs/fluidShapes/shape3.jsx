// import React from 'react';

const Shape3 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={`${stretch ? '100%' : `${width}`}`}
		height={`${stretch ? '100%' : `100%`}`}
		viewBox="0 0 160 160"
		fill="none"
		preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
	>
		<g clipPath="url(#clip0_263_17412)">
			<mask
				id="mask0_263_17412"
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
			<g mask="url(#mask0_263_17412)">
				<path
					d="M160 0H0V160H160V0Z"
					fill={stickerFill || '#EFF1F3'}
					fillOpacity={opacity}
					stroke={stickerStroke || 'white'}
					strokeWidth="4"
				/>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_263_17412">
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

export default Shape3;
