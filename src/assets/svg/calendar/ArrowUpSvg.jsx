import React from 'react';

const ArrowUpSvg = ({ className, style }) => {
	return (
		<svg
			className={className}
			style={{ fill: 'var(--primary-font)', ...style }}
			width="12"
			height="7"
			viewBox="0 0 12 7"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.00009 2.00762L1.46921 6.53849L0.563163 5.63245L5.54706 0.648546C5.66723 0.52842 5.83018 0.460937 6.00009 0.460937C6.17 0.460937 6.33295 0.52842 6.45311 0.648546L11.437 5.63245L10.531 6.53849L6.00009 2.00762Z"
				fill="var(--primary-font)"
				fillOpacity="0.48"
			/>
		</svg>
	);
};

export default ArrowUpSvg;
