import React, { memo } from 'react';

const GiftSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clip-path="url(#clip0_14262_4874)">
				<path
					d="M13.5 5.5H2.5C2.22386 5.5 2 5.72386 2 6V8C2 8.27614 2.22386 8.5 2.5 8.5H13.5C13.7761 8.5 14 8.27614 14 8V6C14 5.72386 13.7761 5.5 13.5 5.5Z"
					stroke={fill}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M13 8.5V13C13 13.1326 12.9473 13.2598 12.8536 13.3536C12.7598 13.4473 12.6326 13.5 12.5 13.5H3.5C3.36739 13.5 3.24021 13.4473 3.14645 13.3536C3.05268 13.2598 3 13.1326 3 13V8.5"
					stroke={fill}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M8 5.5V13.5"
					stroke={fill}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M11.0494 2.4508C11.6331 3.03455 11.6675 4.01705 11.0494 4.56455C9.9925 5.50017 8 5.50017 8 5.50017C8 5.50017 8 3.50767 8.9375 2.4508C9.48312 1.83267 10.4656 1.86705 11.0494 2.4508Z"
					stroke={fill}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M4.9508 2.4508C4.36705 3.03455 4.33267 4.01705 4.9508 4.56455C6.00767 5.50017 8.00017 5.50017 8.00017 5.50017C8.00017 5.50017 8.00017 3.50767 7.06267 2.4508C6.51705 1.83267 5.53455 1.86705 4.9508 2.4508Z"
					stroke={fill}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_14262_4874">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(GiftSvg);
