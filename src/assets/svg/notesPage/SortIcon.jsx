import { memo } from 'react';

const SortIcon = ({ active = false }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
		>
			<g clip-path="url(#clip0_4929_32158)">
				<path
					d="M3 8H7.5"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M3 4H6.5"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M3 12H11.5"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M9 5.5L11.5 3L14 5.5"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M11.5 3V9"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_4929_32158">
					<rect
						width="16"
						height="16"
						fill={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(SortIcon);
