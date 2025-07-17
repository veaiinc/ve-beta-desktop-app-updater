import * as React from 'react';
// import _ from 'lodash';
const Overlay = (props) => {
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
			<rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2"></rect>
			<rect x="18" y="18" width="2" height="2" fill="currentColor"></rect>
			<rect x="14" y="18" width="2" height="2" fill="currentColor"></rect>
			<rect x="10" y="18" width="2" height="2" fill="currentColor"></rect>
			<rect x="6" y="18" width="2" height="2" fill="currentColor"></rect>
			<rect x="6" y="15" width="2" height="1" fill="currentColor"></rect>
			<rect x="18" y="14" width="2" height="2" fill="currentColor"></rect>
			<rect x="18" y="10" width="2" height="2" fill="currentColor"></rect>
			<rect x="18" y="6" width="2" height="2" fill="currentColor"></rect>
			<rect x="15" y="6" width="1" height="2" fill="currentColor"></rect>
		</svg>
	);
};

export default Overlay;
