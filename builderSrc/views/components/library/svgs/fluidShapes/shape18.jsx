// import React from 'react';

const Shape18 = ({ stickerFill, stickerStroke, width, opacity, stretch }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${stretch ? '100%' : `${width}`}`}
			height="100%"
			viewBox="0 0 160 160"
			fill="none"
			preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
		>
			<g clipPath="url(#clip0_263_17593)">
				<mask
					id="mask0_263_17593"
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
				<g mask="url(#mask0_263_17593)">
					<path
						d="M21.7972 138.049C33.8354 150.087 69.6182 133.822 101.72 101.72C133.822 69.6182 150.087 33.8355 138.049 21.7972C126.011 9.75894 90.2278 26.0238 58.1258 58.1258C26.0238 90.2278 9.75892 126.011 21.7972 138.049Z"
						fill={stickerFill || '#EFF1F3'}
						fillOpacity={opacity}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
					/>
					<path
						d="M138.205 138.203C150.243 126.165 133.978 90.3819 101.876 58.2799C69.7745 26.1779 33.9917 9.91307 21.9535 21.9513C9.91519 33.9896 26.1801 69.7723 58.2821 101.874C90.384 133.976 126.167 150.241 138.205 138.203Z"
						fill={stickerFill || '#EFF1F3'}
						// stroke={stickerStroke || 'white'}
						stroke-width="4"
						fillOpacity={opacity}
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_263_17593">
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

export default Shape18;
