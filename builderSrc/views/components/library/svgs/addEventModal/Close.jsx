// import React from 'react';

const CloseButton = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
		>
			<g clip-path="url(#clip0_7524_197883)">
				<path
					d="M18.75 5.75L5.25 19.25"
					stroke="#111111"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M18.75 19.25L5.25 5.75"
					stroke="#111111"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_7524_197883">
					<rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default CloseButton;
