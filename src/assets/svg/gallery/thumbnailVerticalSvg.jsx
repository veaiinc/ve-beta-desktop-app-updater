import React, { memo } from 'react';
const ThumbnailVerticalSvg = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill={props.fill}
		>
			<rect width="5" height="8" fill={props.fill} />
			<rect x="6" width="5" height="8" fill={props.fill} />
			<rect x="12" width="5" height="8" fill={props.fill} />
			<rect y="9" width="5" height="8" fill={props.fill} />
			<rect x="6" y="9" width="5" height="8" fill={props.fill} />
			<rect x="12" y="9" width="5" height="8" fill={props.fill} />
		</svg>
	);
};
export default memo(ThumbnailVerticalSvg);
