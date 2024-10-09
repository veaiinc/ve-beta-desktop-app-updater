import React, { memo } from 'react';

const HomeSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 18 18"
			fill="none"
		>
			<path
				d="M14.25 6.74977V14.2498C14.25 15.0782 13.5784 15.7498 12.75 15.7498H5.25C4.42157 15.7498 3.75 15.0782 3.75 14.2498V6.74977M11.25 15.7498V11.9998C11.25 11.1713 10.5784 10.4998 9.75 10.4998H8.25C7.42157 10.4998 6.75 11.1713 6.75 11.9998V15.7498M15.75 8.24977L10.0606 2.56043C9.4749 1.97465 8.5251 1.97465 7.93935 2.56043L2.25 8.24977"
				stroke={fill || '#7D7D7D'}
				strokeWidth="1.25"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default memo(HomeSvg);
