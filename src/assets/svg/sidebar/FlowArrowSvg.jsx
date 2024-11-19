import React, { memo } from 'react';

const FlowArrowSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clipPath="url(#clip0_2337_2048)">
				<path
					d="M3 13.5C4.10457 13.5 5 12.6046 5 11.5C5 10.3954 4.10457 9.5 3 9.5C1.89543 9.5 1 10.3954 1 11.5C1 12.6046 1.89543 13.5 3 13.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13 3.5L15 5.5L13 7.5"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 11.5C10.5 11.5 7.5 5.5 13 5.5H15"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2337_2048">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(FlowArrowSvg);
