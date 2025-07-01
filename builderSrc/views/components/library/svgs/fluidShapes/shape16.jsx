// import React from 'react';

const Shape16 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17541)">
				<mask
					id="mask0_263_17541"
					maskType="luminance"
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
				<g mask="url(#mask0_263_17541)">
					<path
						d="M136.715 24.3398C126.971 13.3836 95.3049 45.3276 95.3049 45.3276C95.3049 45.3276 97.4363 0.00610819 81.2987 0.00610819C65.4656 -0.608262 66.379 45.3276 66.379 45.3276C66.379 45.3276 36.3395 9.20871 23.7512 23.1231C14.9212 33.7672 44.1516 64.4903 44.1516 64.4903C44.1516 64.4903 0.33879 60.6833 0.00155701 78.7864C-0.302926 93.3805 44.1516 93.9949 44.1516 93.9949C44.1516 93.9949 13.7033 122.885 21.9243 134.754C31.9723 147.523 65.4656 114.679 65.4656 114.679C65.4656 114.679 63.6387 159.834 78.8628 160C94.087 159.69 94.087 115.591 94.087 115.591C94.087 115.591 124.535 147.827 135.801 137.491C146.458 126.231 115.096 94.9074 115.096 94.9074C115.096 94.9074 147.541 96.9715 157.621 86.9241C160.546 84.0084 160.829 79.0279 158.164 75.8736C148.913 64.9271 115.096 66.3153 115.096 66.3153C115.096 66.3153 149.807 35.8922 136.715 24.3398Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17541">
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

export default Shape16;
