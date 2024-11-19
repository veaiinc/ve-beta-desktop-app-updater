import React, { memo } from 'react';

const AtSignSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clipPath="url(#clip0_2337_2721)">
				<path
					d="M8 11C9.38071 11 10.5 9.88071 10.5 8.5C10.5 7.11929 9.38071 6 8 6C6.61929 6 5.5 7.11929 5.5 8.5C5.5 9.88071 6.61929 11 8 11Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11.5 13.5C10.5494 14.1319 9.22688 14.5 8 14.5C6.81331 14.5 5.65328 14.1481 4.66658 13.4888C3.67989 12.8295 2.91085 11.8925 2.45673 10.7961C2.0026 9.69975 1.88378 8.49335 2.11529 7.32946C2.3468 6.16558 2.91825 5.09648 3.75736 4.25736C4.59648 3.41825 5.66558 2.8468 6.82946 2.61529C7.99335 2.38378 9.19975 2.5026 10.2961 2.95673C11.3925 3.41085 12.3295 4.17989 12.9888 5.16658C13.6481 6.15328 14 7.31331 14 8.5C14 9.88063 13.5 11 12.25 11C11 11 10.5 9.88063 10.5 8.5V6"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2337_2721">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(AtSignSvg);
