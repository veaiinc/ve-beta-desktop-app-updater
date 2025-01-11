import React, { memo } from 'react';
const GridSpacingHorizontalSvg = (props) => {
	return (
		<svg
			width="21"
			height="20"
			viewBox="0 0 21 20"
			fill={props.fill}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="0.5" width="8" height="8" fill={props.fill} />
			<rect x="12.5" width="8" height="8" fill={props.fill} />
			<rect x="0.5" y="12" width="8" height="8" fill={props.fill} />
			<rect x="12.5" y="12" width="8" height="8" fill={props.fill} />
		</svg>
	);
};
export default memo(GridSpacingHorizontalSvg);
