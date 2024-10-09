import React, { memo } from 'react';

const LayoutSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clipPath="url(#clip0_2337_703)">
				<path
					d="M6.5 7V13.5"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2 7H14"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.5 3.5H2.5C2.22386 3.5 2 3.72386 2 4V13C2 13.2761 2.22386 13.5 2.5 13.5H13.5C13.7761 13.5 14 13.2761 14 13V4C14 3.72386 13.7761 3.5 13.5 3.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2337_703">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(LayoutSvg);
