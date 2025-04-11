import { memo } from 'react';
const BuildingSvg = ({ selected }) => {
	const fillColor = selected ? 'var(--primary-button-font)' : 'var(--secondary-font)';
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
		>
			<path opacity="0.2" d="M13 5.5H9.5V2L13 5.5Z" fill={fillColor} />
			<path
				d="M13.5 5.5C13.501 5.43348 13.4882 5.36747 13.4623 5.30615C13.4365 5.24484 13.3983 5.18954 13.35 5.14375L9.85625 1.64375L9.81875 1.6125H9.80625L9.775 1.59375H9.76875L9.7375 1.56875H9.73125L9.69375 1.55H9.6875L9.64375 1.53125H3.5C3.24011 1.53112 2.99038 1.63218 2.80372 1.81301C2.61705 1.99384 2.50812 2.24024 2.5 2.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V5.5ZM10 3.20625L11.7937 5H10V3.20625ZM12.5 13.5H3.5V2.5H9V5.5C9 5.63261 9.05268 5.75979 9.14645 5.85355C9.24021 5.94732 9.36739 6 9.5 6H12.5V13.5ZM9.65625 10.45C9.92469 10.0166 10.0398 9.50569 9.98315 8.99908C9.92648 8.49248 9.70131 8.01958 9.34375 7.65625C8.91995 7.23566 8.34708 6.99964 7.75 6.99964C7.15292 6.99964 6.58005 7.23566 6.15625 7.65625C5.73566 8.08005 5.49964 8.65292 5.49964 9.25C5.49964 9.84708 5.73566 10.42 6.15625 10.8438C6.51843 11.2033 6.99153 11.4298 7.4987 11.4865C8.00587 11.5433 8.51733 11.4269 8.95 11.1562L9.63125 11.8438C9.72723 11.9355 9.85473 11.9869 9.9875 11.9875C10.12 11.9857 10.2471 11.9344 10.3438 11.8438C10.4376 11.749 10.4903 11.6209 10.4903 11.4875C10.4903 11.3541 10.4376 11.226 10.3438 11.1313L9.65625 10.45ZM6.86875 10.1313C6.75272 10.0157 6.66065 9.87836 6.59783 9.72713C6.53501 9.5759 6.50267 9.41376 6.50267 9.25C6.50267 9.08624 6.53501 8.9241 6.59783 8.77287C6.66065 8.62164 6.75272 8.48431 6.86875 8.36875C6.98388 8.25197 7.12108 8.15923 7.27236 8.09594C7.42365 8.03264 7.58601 8.00004 7.75 8.00004C7.91399 8.00004 8.07635 8.03264 8.22764 8.09594C8.37892 8.15923 8.51612 8.25197 8.63125 8.36875C8.74728 8.48431 8.83935 8.62164 8.90217 8.77287C8.96499 8.9241 8.99733 9.08624 8.99733 9.25C8.99733 9.41376 8.96499 9.5759 8.90217 9.72713C8.83935 9.87836 8.74728 10.0157 8.63125 10.1313C8.51612 10.248 8.37892 10.3408 8.22764 10.4041C8.07635 10.4674 7.91399 10.5 7.75 10.5C7.58601 10.5 7.42365 10.4674 7.27236 10.4041C7.12108 10.3408 6.98388 10.248 6.86875 10.1313Z"
				fill={fillColor}
			/>
		</svg>
		// <svg
		// 	xmlns="http://www.w3.org/2000/svg"
		// 	width="15"
		// 	height="15"
		// 	viewBox="0 0 20 20"
		// 	fill="none"
		// >
		// 	<g clipPath="url(#clip0_4624_145358)">
		// 		<path
		// 			d="M1.25 16.875H18.75"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M17.5 16.875V5.625H13.75V3.125H6.25V8.125H2.5V16.875"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M9.375 5.625H10.625"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M9.375 8.125H10.625"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M13.75 8.125H15"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M5 10.625H6.25"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M5 13.125H6.25"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M9.375 10.625H10.625"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M13.75 10.625H15"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M13.75 13.125H15"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 		<path
		// 			d="M8.75 16.875V13.125H11.25V16.875"
		// 			stroke={strokeColor}
		// 			strokeWidth="1.25"
		// 			strokeLinecap="round"
		// 			strokeLinejoin="round"
		// 		/>
		// 	</g>
		// 	<defs>
		// 		<clipPath id="clip0_4624_145358">
		// 			<rect width="20" height="20" fill="white" />
		// 		</clipPath>
		// 	</defs>
		// </svg>
	);
};
export default memo(BuildingSvg);
