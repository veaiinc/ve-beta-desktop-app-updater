import React, { memo } from 'react';

const AppartmentHomeSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
		>
			<path
				d="M8.66732 11L7.33398 11C6.78065 11 6.33398 11.4467 6.33398 12L6.33398 14.3333L9.66732 14.3333L9.66732 12C9.66732 11.4467 9.22065 11 8.66732 11Z"
				stroke={fill || '#7D7D7D'}
				strokeWidth="1.2"
				strokeMiterlimit="10"
				strokeLinejoin="round"
			/>
			<path
				d="M6.71416 1.8773L2.09416 5.5773C1.57416 5.99063 1.24083 6.86396 1.35416 7.5173L2.24083 12.824C2.40083 13.7706 3.30749 14.5373 4.26749 14.5373L11.7342 14.5373C12.6875 14.5373 13.6008 13.764 13.7608 12.824L14.6475 7.5173C14.7542 6.86396 14.4208 5.99063 13.9075 5.5773L9.28749 1.88396C8.57416 1.31063 7.42083 1.31063 6.71416 1.8773Z"
				stroke={fill || '#7D7D7D'}
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default memo(AppartmentHomeSvg);
