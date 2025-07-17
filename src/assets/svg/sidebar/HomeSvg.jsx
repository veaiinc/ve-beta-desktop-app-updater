import React, { memo } from 'react';

const HomeSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
		>
			<g clip-path="url(#clip0_9845_15364)">
				<path
					d="M8.125 16.8745V11.8745H11.875V16.8745H16.875V9.37452C16.8751 9.29242 16.859 9.21111 16.8276 9.13523C16.7962 9.05936 16.7502 8.99041 16.6922 8.93233L10.4422 2.68233C10.3841 2.62422 10.3152 2.57812 10.2393 2.54667C10.1635 2.51521 10.0821 2.49902 10 2.49902C9.91787 2.49902 9.83654 2.51521 9.76066 2.54667C9.68479 2.57812 9.61586 2.62422 9.55781 2.68233L3.30781 8.93233C3.24979 8.99041 3.20378 9.05936 3.17241 9.13523C3.14105 9.21111 3.12494 9.29242 3.125 9.37452V16.8745H8.125Z"
					stroke="#F2F2F3"
					stroke-width="1.25"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_9845_15364">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(HomeSvg);
