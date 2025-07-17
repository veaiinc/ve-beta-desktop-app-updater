import React, { memo } from 'react';

const BookSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<g clipPath="url(#clip0_2337_2929)">
				<path
					d="M12 1.83398H4.00002C3.26669 1.83398 2.66669 2.43398 2.66669 3.16732V13.834C2.66669 14.5673 3.26669 15.1673 4.00002 15.1673H12C12.7334 15.1673 13.3334 14.5673 13.3334 13.834V3.16732C13.3334 2.43398 12.7334 1.83398 12 1.83398ZM4.00002 3.16732H7.33335V8.50065L5.66669 7.50065L4.00002 8.50065V3.16732Z"
					fill={fill || '#7D7D7D'}
				/>
			</g>
			<defs>
				<clipPath id="clip0_2337_2929">
					<rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(BookSvg);
