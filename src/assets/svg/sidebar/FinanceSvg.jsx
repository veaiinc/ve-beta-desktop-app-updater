import React, { memo } from 'react';

const FinanceSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<path
				d="M4 11.5L2 13.46V7.83333H4M7.33333 10.2733L6.28667 9.38L5.33333 10.26V5.16667H7.33333M10.6667 9.16667L8.66667 11.1667V2.5H10.6667M12.54 9.04L11.3333 7.83333H14.6667V11.1667L13.4733 9.97333L8.66667 14.74L6.35333 12.7267L3.83333 15.1667H2L6.31333 10.94L8.66667 12.9267"
				fill={fill || '#7D7D7D'}
			/>
		</svg>
	);
};

export default memo(FinanceSvg);
