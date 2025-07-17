// import React from 'react';

const Shape17 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clip-path="url(#clip0_263_17586)">
				<mask
					id="mask0_263_17586"
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
				<g mask="url(#mask0_263_17586)">
					<path
						d="M71.7895 1.49716C41.0676 12.0855 53.819 47.0088 53.819 47.0088C53.819 47.0088 22.664 25.5889 4.63245 53.7304C0.696902 59.8725 -0.916354 67.4897 0.513821 74.6937C5.60696 100.351 32.0488 100.351 32.0488 100.351C32.0488 100.351 6.03914 117.817 21.0763 144.228C24.9235 150.985 31.4111 155.939 38.7613 158.008C74.6799 168.119 79.6323 122.071 79.6323 122.071C79.6323 122.071 82.5384 163.105 115.484 159.812C125.51 158.81 134.534 152.223 138.929 142.913C151.135 117.053 128.149 102.267 128.149 102.267C128.149 102.267 156.246 102.267 159.782 72.9734C160.75 64.9561 158.47 56.6474 153.35 50.5147C134.215 27.5955 107.934 47.9671 107.934 47.9671C107.934 47.9671 121.585 10.8536 88.792 1.15345C83.2555 -0.484231 77.2519 -0.385392 71.7895 1.49716Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17586">
					<rect
						width="160"
						height="160"
						style={{ fill: 'white', fillOpacity: opacity }}
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default Shape17;
