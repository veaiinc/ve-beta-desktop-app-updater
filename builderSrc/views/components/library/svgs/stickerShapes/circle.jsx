// import React from "react";

const CircleSticker = ({ stickerFill, stickerStroke, preserveAspectRatio }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${preserveAspectRatio == true ? '100%' : '266'}`}
			height={`${preserveAspectRatio == true ? '100%' : '266'}`}
			viewBox="0 0 265 266"
			fill="none"
			preserveAspectRatio={preserveAspectRatio == true ? 'none' : ''}
		>
			<path
				d="M132.5 263.273C204.573 263.273 263 204.847 263 132.773C263 60.7003 204.573 2.27344 132.5 2.27344C60.4268 2.27344 2 60.7003 2 132.773C2 204.847 60.4268 263.273 132.5 263.273Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
		</svg>
	);
};
export default CircleSticker;
