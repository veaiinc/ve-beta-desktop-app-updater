import React, { memo } from 'react';

const SquareFour = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clipPath="url(#clip0_6906_53726)">
				<path
					d="M6.5 3.5H3.5C3.22386 3.5 3 3.72386 3 4V7C3 7.27614 3.22386 7.5 3.5 7.5H6.5C6.77614 7.5 7 7.27614 7 7V4C7 3.72386 6.77614 3.5 6.5 3.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M12.5 3.5H9.5C9.22386 3.5 9 3.72386 9 4V7C9 7.27614 9.22386 7.5 9.5 7.5H12.5C12.7761 7.5 13 7.27614 13 7V4C13 3.72386 12.7761 3.5 12.5 3.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.5 9.5H3.5C3.22386 9.5 3 9.72386 3 10V13C3 13.2761 3.22386 13.5 3.5 13.5H6.5C6.77614 13.5 7 13.2761 7 13V10C7 9.72386 6.77614 9.5 6.5 9.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M12.5 9.5H9.5C9.22386 9.5 9 9.72386 9 10V13C9 13.2761 9.22386 13.5 9.5 13.5H12.5C12.7761 13.5 13 13.2761 13 13V10C13 9.72386 12.7761 9.5 12.5 9.5Z"
					stroke={fill || '#7D7D7D'}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_6906_53726">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(SquareFour);
