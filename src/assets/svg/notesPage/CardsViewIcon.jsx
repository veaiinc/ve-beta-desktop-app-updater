import { memo } from 'react';

const CardsViewIcon = ({ active = false }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
		>
			<g clip-path="url(#clip0_4929_31252)">
				<path
					d="M11.5 5H2.5C2.22386 5 2 5.22386 2 5.5V12.5C2 12.7761 2.22386 13 2.5 13H11.5C11.7761 13 12 12.7761 12 12.5V5.5C12 5.22386 11.7761 5 11.5 5Z"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M4 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5V11"
					stroke={active ? 'var(--primary-font)' : 'var(--secondary-font)'}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_4929_31252">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(CardsViewIcon);
