// import React from 'react';

const Cart = ({ fillColor, iconSize }) => {
	const sizeValues = {
		small: '20px',
		medium: '25px',
		large: '30px',
	};
	const size = sizeValues[iconSize] || sizeValues.medium;

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0_2431_40684)">
				<path
					d="M8.93735 22.029C9.77486 22.029 10.4538 21.3501 10.4538 20.5125C10.4538 19.675 9.77486 18.9961 8.93735 18.9961C8.09984 18.9961 7.4209 19.675 7.4209 20.5125C7.4209 21.3501 8.09984 22.029 8.93735 22.029Z"
					fill={fillColor}
				/>
				<path
					d="M18.7938 22.029C19.6313 22.029 20.3102 21.3501 20.3102 20.5125C20.3102 19.675 19.6313 18.9961 18.7938 18.9961C17.9563 18.9961 17.2773 19.675 17.2773 20.5125C17.2773 21.3501 17.9563 22.029 18.7938 22.029Z"
					fill={fillColor}
				/>
				<path
					d="M2.1123 3.07227H4.38698L7.87008 15.6095C7.95872 15.9288 8.14951 16.2103 8.41327 16.4109C8.67703 16.6115 8.99924 16.7202 9.33061 16.7203H18.6985C19.03 16.7204 19.3525 16.6118 19.6164 16.4112C19.8804 16.2106 20.0713 15.929 20.16 15.6095L22.5844 6.86339H5.43997"
					stroke={fillColor}
					strokeWidth="1.67333"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2431_40684">
					<rect
						width="24.2632"
						height="24.2632"
						fill="white"
						transform="translate(0.59668 0.03125)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default Cart;
