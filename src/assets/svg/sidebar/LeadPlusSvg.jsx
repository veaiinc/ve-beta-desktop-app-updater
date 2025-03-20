import React, { memo } from 'react';

const LeadPlusSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
		>
			<path
				d="M15 8L1 8"
				stroke="#E8E8E8"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 1L8 15"
				stroke="#E8E8E8"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default memo(LeadPlusSvg);
