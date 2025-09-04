import * as React from 'react';
// import _ from 'lodash';
const Down = (props) => {
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
				d="M7.49988 15L14.5371 8.75L13.5449 7.86875L8.2036 12.6063V0H6.79615V12.6063L1.45489 7.86875L0.462642 8.75L7.49988 15Z"
				fill={ props?.color ||  "#9B9290"}
			/>
		</svg>
	);
};
export default Down;
