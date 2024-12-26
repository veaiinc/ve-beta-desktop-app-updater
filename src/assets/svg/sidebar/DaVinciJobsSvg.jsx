import React, { memo } from 'react';

const DaVinciJobsSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
		>
			<path
				d="M6.00011 16.5H12.0001C15.0151 16.5 15.5551 15.2925 15.7126 13.8225L16.2751 7.8225C16.4776 5.9925 15.9526 4.5 12.7501 4.5H5.25011C2.04761 4.5 1.52261 5.9925 1.72511 7.8225L2.28761 13.8225C2.44511 15.2925 2.98511 16.5 6.00011 16.5Z"
				stroke={fill}
				stroke-width="1.125"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6 4.5V3.9C6 2.5725 6 1.5 8.4 1.5H9.6C12 1.5 12 2.5725 12 3.9V4.5"
				stroke={fill}
				stroke-width="1.125"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10.5 9.75V10.5C10.5 10.5075 10.5 10.5075 10.5 10.515C10.5 11.3325 10.4925 12 9 12C7.515 12 7.5 11.34 7.5 10.5225V9.75C7.5 9 7.5 9 8.25 9H9.75C10.5 9 10.5 9 10.5 9.75Z"
				stroke={fill}
				stroke-width="1.125"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.2375 8.25C14.505 9.51 12.525 10.26 10.5 10.515"
				stroke={fill}
				stroke-width="1.125"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.96484 8.45251C3.65234 9.60751 5.55734 10.305 7.49984 10.5225"
				stroke={fill}
				stroke-width="1.125"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default memo(DaVinciJobsSvg);
