// import React from "react";

const PolygonSticker = ({ stickerFill, stickerStroke, preserveAspectRatio }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${preserveAspectRatio == true ? '100%' : '265'}`}
			height={`${preserveAspectRatio == true ? '100%' : '265'}`}
			viewBox="0 0 265 265"
			fill="none"
			preserveAspectRatio={preserveAspectRatio == true ? 'none' : ''}
		>
			<path
				d="M225 43.7734L168 73.2734V8.77344L133.5 62.2734L101 7.27344L99 72.2734L42.5 39.7734L72.5 97.7734H7L61.5 131.773L7 164.773L71 167.273L39.5 223.273L96 194.273L97 256.273L130.5 204.273L163 258.273L166.5 194.773L222 226.273L193.5 169.273H257.5L202.5 134.273L257.5 102.273L193.5 99.2734L225 43.7734Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
		</svg>
	);
};
export default PolygonSticker;
