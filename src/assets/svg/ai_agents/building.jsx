import { memo } from 'react';
const BuildingSvg = ({ selected }) => {
	const strokeColor = selected ? 'black' : 'var(--primary-font)';
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 20 20"
			fill="none"
		>
			<g clipPath="url(#clip0_4624_145358)">
				<path
					d="M1.25 16.875H18.75"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M17.5 16.875V5.625H13.75V3.125H6.25V8.125H2.5V16.875"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.375 5.625H10.625"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.375 8.125H10.625"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.75 8.125H15"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 10.625H6.25"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 13.125H6.25"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.375 10.625H10.625"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.75 10.625H15"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.75 13.125H15"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8.75 16.875V13.125H11.25V16.875"
					stroke={strokeColor}
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_4624_145358">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};
export default memo(BuildingSvg);
