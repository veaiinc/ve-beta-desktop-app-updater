import React, { memo } from 'react';

const VerticalAlignSvg = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill={props.fill}
		>
			<rect width="8" height="11" fill={props.fill} />
			<rect x="9" y="6" width="8" height="11" fill={props.fill} />
			<rect y="12" width="8" height="5" fill={props.fill} />
			<rect x="9" width="8" height="5" fill={props.fill} />
		</svg>
	);
};

export default memo(VerticalAlignSvg);
