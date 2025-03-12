import React, { memo } from 'react';

const FilterSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="17"
			viewBox="0 0 18 17"
			fill="none"
		>
			<path
				d="M1.89062 4.4375H16.1094"
				stroke="var(--primary-font)"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.9375 8.5H13.0625"
				stroke="var(--primary-font)"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.96875 12.5625H11.0312"
				stroke="var(--primary-font)"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default memo(FilterSvg);
