import * as React from 'react';
// import _ from 'lodash';
const Up = (props) => {
	let theme;
	if (props.theme === 'light') {
		theme = '#707070';
	} else {
		theme = '#c4c4c4';
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
		>
			<path
				d="M7.69153 0L0.654297 6.25L1.64655 7.13125L6.98781 2.39375V15H8.39525V2.39375L13.7365 7.13125L14.7288 6.25L7.69153 0Z"
				fill={props?.color || '#9B9290'}
			/>
		</svg>
	);
};
export default Up;
