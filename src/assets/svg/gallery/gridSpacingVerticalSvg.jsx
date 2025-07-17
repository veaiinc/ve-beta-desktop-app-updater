import React, { memo } from 'react';
const GridSpacingVerticalSvg = (props) => {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill={props.fill}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="8" height="8" fill={props.fill} />
			<rect x="9" width="8" height="8" fill={props.fill} />
			<rect y="9" width="8" height="8" fill={props.fill} />
			<rect x="9" y="9" width="8" height="8" fill={props.fill} />
		</svg>
	);
};
export default memo(GridSpacingVerticalSvg);
