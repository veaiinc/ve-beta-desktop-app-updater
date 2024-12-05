import React, { memo } from 'react';

const Transcript = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clip-path="url(#clip0_12126_68918)">
				<path
					d="M12.5 11.5V4.5C12.5 4.10218 12.342 3.72064 12.0607 3.43934C11.7794 3.15804 11.3978 3 11 3H2.5"
					stroke="#E8E8E8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M6.5 7H10.5"
					stroke="#E8E8E8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M6.5 9H10.5"
					stroke="#E8E8E8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M1.5 5.5C1.5 5.5 1 5.125 1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3C2.89782 3 3.27936 3.15804 3.56066 3.43934C3.84196 3.72064 4 4.10218 4 4.5V12.5C4 12.8978 4.15804 13.2794 4.43934 13.5607C4.72064 13.842 5.10218 14 5.5 14M5.5 14C5.89782 14 6.27936 13.842 6.56066 13.5607C6.84196 13.2794 7 12.8978 7 12.5C7 11.875 6.5 11.5 6.5 11.5H13.5C13.5 11.5 14 11.875 14 12.5C14 12.8978 13.842 13.2794 13.5607 13.5607C13.2794 13.842 12.8978 14 12.5 14H5.5Z"
					stroke="#E8E8E8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_12126_68918">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(Transcript);
