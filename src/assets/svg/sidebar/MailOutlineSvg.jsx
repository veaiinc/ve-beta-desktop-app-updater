import React, { memo } from 'react';

const MailOutlineSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<path
				d="M13.25 3.5H2.75C2.05964 3.5 1.5 4.05964 1.5 4.75V12.25C1.5 12.9404 2.05964 13.5 2.75 13.5H13.25C13.9404 13.5 14.5 12.9404 14.5 12.25V4.75C14.5 4.05964 13.9404 3.5 13.25 3.5Z"
				stroke={fill || '#7D7D7D'}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4 5L8.5 8.5L13 5"
				stroke={fill || '#7D7D7D'}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default memo(MailOutlineSvg);
