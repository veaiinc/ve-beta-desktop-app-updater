import React, { memo } from 'react';

const SearchIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
		>
			<circle
				cx="6.60742"
				cy="6.29688"
				r="5.15625"
				stroke="var(--primary-font)"
				strokeWidth="1.33"
			/>
			<path
				d="M10.3887 10.0781L14.0347 13.7241"
				stroke="var(--primary-font)"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default memo(SearchIcon);
