import React, { memo } from 'react';

const PlusSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="19"
			viewBox="0 0 18 19"
			fill="none"
		>
			<g clip-path="url(#clip0_17116_22987)">
				<path
					d="M9 16.25C12.7279 16.25 15.75 13.2279 15.75 9.5C15.75 5.77208 12.7279 2.75 9 2.75C5.27208 2.75 2.25 5.77208 2.25 9.5C2.25 13.2279 5.27208 16.25 9 16.25Z"
					stroke="var(--primary-font)"
					stroke-width="1.125"
					stroke-miterlimit="10"
				/>
				<path
					d="M6.1875 9.5H11.8125"
					stroke="var(--primary-font)"
					stroke-width="1.125"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M9 6.6875V12.3125"
					stroke="var(--primary-font)"
					stroke-width="1.125"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_17116_22987">
					<rect width="18" height="18" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(PlusSvg);
