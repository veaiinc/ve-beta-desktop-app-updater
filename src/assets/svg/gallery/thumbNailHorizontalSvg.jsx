import React, { memo } from 'react';
const ThumbnailHorizontalSvg = (props) => {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill={props.fill}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect y="0.5" width="8" height="16" fill={props.fill} />
			<rect x="9" y="0.5" width="8" height="7" fill={props.fill} />
			<rect x="9" y="9.5" width="8" height="7" fill={props.fill} />
		</svg>
	);
};
export default memo(ThumbnailHorizontalSvg);
