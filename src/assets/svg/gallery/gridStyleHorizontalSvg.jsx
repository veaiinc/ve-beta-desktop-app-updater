import React, { memo } from 'react';
const GridStyleHorizontalSvg = (props) => {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill={props.fill}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="0.5" width="10" height="8" fill={props.fill} />
			<rect x="11.5" width="5" height="8" fill={props.fill} />
			<rect x="0.5" y="9" width="5" height="8" fill={props.fill} />
			<rect x="6.5" y="9" width="10" height="8" fill={props.fill} />
		</svg>
	);
};
export default memo(GridStyleHorizontalSvg);
