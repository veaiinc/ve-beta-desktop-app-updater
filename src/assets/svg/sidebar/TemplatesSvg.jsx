import React, { memo } from 'react';

const TemplatesSvg = ({ fill }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
		>
			<path
				d="M14.6666 11.66V3.61336C14.6666 2.81336 14.0133 2.22002 13.2199 2.28669H13.1799C11.7799 2.40669 9.65325 3.12002 8.46658 3.86669L8.35325 3.94002C8.15992 4.06002 7.83992 4.06002 7.64659 3.94002L7.47992 3.84002C6.29325 3.10002 4.17325 2.39336 2.77325 2.28002C1.97992 2.21336 1.33325 2.81336 1.33325 3.60669V11.66C1.33325 12.3 1.85325 12.9 2.49325 12.98L2.68659 13.0067C4.13325 13.2 6.36659 13.9334 7.64659 14.6334L7.67325 14.6467C7.85325 14.7467 8.13992 14.7467 8.31325 14.6467C9.59325 13.94 11.8333 13.2 13.2866 13.0067L13.5066 12.98C14.1466 12.9 14.6666 12.3 14.6666 11.66Z"
				stroke={fill}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 4.15997V14.16"
				stroke={fill}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5.16675 6.15997H3.66675"
				stroke={fill}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5.66675 8.15997H3.66675"
				stroke={fill}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default memo(TemplatesSvg);
