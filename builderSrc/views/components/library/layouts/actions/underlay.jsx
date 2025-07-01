import * as React from 'react';
// import _ from 'lodash';
const Underlay = (props) => {
	let theme;
	if (props.theme === 'light') {
		theme = '#707070';
	} else {
		theme = '#c4c4c4';
	}
	return (
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M8 17V20H20V8H17" stroke="currentColor" strokeWidth="2"></path>
			<rect x="2" y="2" width="2" height="2" fill="currentColor"></rect>
			<rect x="2" y="6" width="2" height="2" fill="currentColor"></rect>
			<rect x="2" y="10" width="2" height="2" fill="currentColor"></rect>
			<rect x="2" y="14" width="2" height="2" fill="currentColor"></rect>
			<rect x="6" y="14" width="2" height="2" fill="currentColor"></rect>
			<rect x="10" y="14" width="2" height="2" fill="currentColor"></rect>
			<rect x="14" y="14" width="2" height="2" fill="currentColor"></rect>
			<rect x="14" y="10" width="2" height="2" fill="currentColor"></rect>
			<rect x="14" y="6" width="2" height="2" fill="currentColor"></rect>
			<rect x="14" y="2" width="2" height="2" fill="currentColor"></rect>
			<rect x="10" y="2" width="2" height="2" fill="currentColor"></rect>
			<rect x="6" y="2" width="2" height="2" fill="currentColor"></rect>
		</svg>
	);
};

export default Underlay;
