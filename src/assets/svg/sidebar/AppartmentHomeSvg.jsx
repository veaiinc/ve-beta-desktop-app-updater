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
				stroke="#E8E8E8"
				stroke-width="1.2"
				stroke-miterlimit="10"
				stroke-linejoin="round"
			/>
			<path
				d="M6.71416 1.87998L2.09416 5.57998C1.57416 5.99331 1.24083 6.86665 1.35416 7.51998L2.24083 12.8266C2.40083 13.7733 3.30749 14.54 4.26749 14.54L11.7342 14.54C12.6875 14.54 13.6008 13.7666 13.7608 12.8266L14.6475 7.51998C14.7542 6.86665 14.4208 5.99332 13.9075 5.57998L9.28749 1.88665C8.57416 1.31332 7.42083 1.31332 6.71416 1.87998Z"
				stroke="#E8E8E8"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default memo(AppartmentHomeSvg);
