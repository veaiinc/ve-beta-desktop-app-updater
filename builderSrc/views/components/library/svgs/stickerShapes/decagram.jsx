// import React from "react";

const DecagramSticker = ({ stickerFill, stickerStroke, preserveAspectRatio }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${preserveAspectRatio == true ? '100%' : '259'}`}
			height={`${preserveAspectRatio == true ? '100%' : '257'}`}
			viewBox="0 0 259 257"
			fill="none"
			preserveAspectRatio={preserveAspectRatio == true ? 'none' : ''}
		>
			<path
				d="M5 154.273L57 170.273L45 221.773L96.5 205.773L117.5 252.773L149 210.773L195.5 235.273V184.273L248 178.773L216.5 136.773L255 101.773L205 85.7734L216 35.2734L165 50.2734L143.5 4.27344L112 45.7734L66.5 20.2734V72.7734L12.5 77.2734L44.5 119.773L5 154.273Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
		</svg>
	);
};
export default DecagramSticker;
