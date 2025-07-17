// import React from 'react';

const Shape12 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17507)">
				<mask
					id="mask0_263_17507"
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
				<g mask="url(#mask0_263_17507)">
					<path
						d="M80 0L81.8032 8.82205C88.9434 43.756 116.244 71.0566 151.178 78.1968L160 80L151.178 81.8032C116.244 88.9434 88.9434 116.244 81.8032 151.178L80 160L78.1968 151.178C71.0566 116.244 43.756 88.9434 8.82204 81.8032L0 80L8.82205 78.1968C43.756 71.0566 71.0566 43.756 78.1968 8.82204L80 0Z"
						fill={stickerFill || '#D9D9D9'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17507">
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

export default Shape12;
