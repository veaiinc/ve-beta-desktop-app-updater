import React from 'react';

export const HamburgerOne = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to #F2F2F3
	const strokeColor = fillColor || '#F2F2F3';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path
				d="M2 3H14"
				stroke={strokeColor}
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.8374 6.33594H11.1574"
				stroke={strokeColor}
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 9.66406H14"
				stroke={strokeColor}
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.8374 13H11.1574"
				stroke={strokeColor}
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const HamburgerTwo = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const strokeColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path d="M2 3H14" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M2 6.33594H8.31333"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 9.66406H14"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 13H8.31333"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const HamburgerThree = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const strokeColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path d="M2 3H14" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M7.68652 6.33594H13.9999"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 9.66406H14"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.68652 13H13.9999"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const HamburgerFour = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const strokeColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path d="M2 3H14" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M2 6.33594H14"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 9.66406H14"
				stroke={strokeColor}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M2 13H14" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const HamburgerFive = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const strokeColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path d="M8 3H14" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M5 7L11 7" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M2 11H8" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const HamburgerSix = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '11',
		medium: '16',
		large: '22',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const dotColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 11 11"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<g clipPath="url(#clip0_7920_171144)">
				<path
					d="M0.75 1.5C1.16421 1.5 1.5 1.16421 1.5 0.75C1.5 0.335786 1.16421 0 0.75 0C0.335786 0 0 0.335786 0 0.75C0 1.16421 0.335786 1.5 0.75 1.5Z"
					fill={dotColor}
				/>
				<path
					d="M5.25 1.5C5.66421 1.5 6 1.16421 6 0.75C6 0.335786 5.66421 0 5.25 0C4.83579 0 4.5 0.335786 4.5 0.75C4.5 1.16421 4.83579 1.5 5.25 1.5Z"
					fill={dotColor}
				/>
				<path
					d="M9.75 1.5C10.1642 1.5 10.5 1.16421 10.5 0.75C10.5 0.335786 10.1642 0 9.75 0C9.33579 0 9 0.335786 9 0.75C9 1.16421 9.33579 1.5 9.75 1.5Z"
					fill={dotColor}
				/>
				<path
					d="M0.75 6C1.16421 6 1.5 5.66421 1.5 5.25C1.5 4.83579 1.16421 4.5 0.75 4.5C0.335786 4.5 0 4.83579 0 5.25C0 5.66421 0.335786 6 0.75 6Z"
					fill={dotColor}
				/>
				<path
					d="M5.25 6C5.66421 6 6 5.66421 6 5.25C6 4.83579 5.66421 4.5 5.25 4.5C4.83579 4.5 4.5 4.83579 4.5 5.25C4.5 5.66421 4.83579 6 5.25 6Z"
					fill={dotColor}
				/>
				<path
					d="M9.75 6C10.1642 6 10.5 5.66421 10.5 5.25C10.5 4.83579 10.1642 4.5 9.75 4.5C9.33579 4.5 9 4.83579 9 5.25C9 5.66421 9.33579 6 9.75 6Z"
					fill={dotColor}
				/>
				<path
					d="M0.75 10.5C1.16421 10.5 1.5 10.1642 1.5 9.75C1.5 9.33579 1.16421 9 0.75 9C0.335786 9 0 9.33579 0 9.75C0 10.1642 0.335786 10.5 0.75 10.5Z"
					fill={dotColor}
				/>
				<path
					d="M5.25 10.5C5.66421 10.5 6 10.1642 6 9.75C6 9.33579 5.66421 9 5.25 9C4.83579 9 4.5 9.33579 4.5 9.75C4.5 10.1642 4.83579 10.5 5.25 10.5Z"
					fill={dotColor}
				/>
				<path
					d="M9.75 10.5C10.1642 10.5 10.5 10.1642 10.5 9.75C10.5 9.33579 10.1642 9 9.75 9C9.33579 9 9 9.33579 9 9.75C9 10.1642 9.33579 10.5 9.75 10.5Z"
					fill={dotColor}
				/>
			</g>
			<defs>
				<clipPath id="clip0_7920_171144">
					<rect width="11" height="11" fill={dotColor} />
				</clipPath>
			</defs>
		</svg>
	);
};

export const HamburgerSeven = ({ fillColor, iconSize, style, onClick }) => {
	const sizeValues = {
		small: '16',
		medium: '20',
		large: '24',
	};
	const size = sizeValues[iconSize] || sizeValues.small;

	// Use fillColor prop or fall back to white
	const strokeColor = fillColor || 'white';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 16 16"
			fill="none"
			style={style}
			onClick={onClick}
		>
			<path d="M8 3H2" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M11 7L5 7" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 11H8" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};
