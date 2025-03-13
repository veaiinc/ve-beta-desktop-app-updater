import React from 'react';

const MeetingSvg = ({ className, style }) => {
	return (
		<svg
			className={className}
			style={{ stroke: 'var(--primary-font)', fill: 'none', ...style }}
			width="16"
			height="16"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0)">
				<path
					d="M11 6.5L8 8V4.5"
					stroke="var(--primary-font)"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8 14C6.81331 14 5.65328 13.6481 4.66658 12.9888C3.67989 12.3295 2.91085 11.3925 2.45673 10.2961C2.0026 9.19975 1.88378 7.99335 2.11529 6.82946C2.3468 5.66558 2.91825 4.59648 3.75736 3.75736C4.59648 2.91825 5.66558 2.3468 6.82946 2.11529C7.99335 1.88378 9.19975 2.0026 10.2961 2.45673C11.3925 2.91085 12.3295 3.67989 12.9888 4.66658C13.6481 5.65328 14 6.81331 14 8"
					stroke="var(--primary-font)"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M12 12.5C12.8284 12.5 13.5 11.8284 13.5 11C13.5 10.1716 12.8284 9.5 12 9.5C11.1716 9.5 10.5 10.1716 10.5 11C10.5 11.8284 11.1716 12.5 12 12.5Z"
					stroke="var(--primary-font)"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M10 14C10.2294 13.1375 11.0375 12.5 12 12.5C12.9625 12.5 13.7706 13.1375 14 14"
					stroke="var(--primary-font)"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default MeetingSvg;
