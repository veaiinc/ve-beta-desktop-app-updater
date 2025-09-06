// import React from "react";

const SquareSticker = ({ stickerFill, stickerStroke, preserveAspectRatio }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${preserveAspectRatio == true ? '100%' : '266'}`}
			height={`${preserveAspectRatio == true ? '100%' : '266'}`}
			viewBox="0 0 264 265"
			fill="none"
			preserveAspectRatio={preserveAspectRatio == true ? 'none' : ''}
		>
			<path
				d="M261.562 2.02637L2.21875 2.02637L2.21875 262.026H261.562V2.02637Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
		</svg>
	);
};

export default SquareSticker;
