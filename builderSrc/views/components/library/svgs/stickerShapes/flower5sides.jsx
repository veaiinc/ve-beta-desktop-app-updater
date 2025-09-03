// import React from "react";

const Flower5SidesSticker = ({ stickerFill, stickerStroke, preserveAspectRatio }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={`${preserveAspectRatio == true ? '100%' : '248'}`}
			height={`${preserveAspectRatio == true ? '100%' : '248'}`}
			viewBox="0 0 248 248"
			fill="none"
			preserveAspectRatio={preserveAspectRatio == true ? 'none' : ''}
		>
			<path
				d="M111.479 4.28317C64.6282 20.4305 84.074 73.6885 84.074 73.6885C84.074 73.6885 36.5625 41.0231 9.06449 83.9388C3.06278 93.3056 0.60256 104.922 2.78358 115.908C10.5506 155.035 50.8744 155.035 50.8744 155.035C50.8744 155.035 11.2097 181.671 34.1413 221.947C40.0084 232.251 49.9019 239.806 61.111 242.962C115.887 258.382 123.439 188.159 123.439 188.159C123.439 188.159 127.871 250.735 178.113 245.713C193.403 244.185 207.165 234.14 213.867 219.942C232.481 180.505 197.427 157.958 197.427 157.958C197.427 157.958 240.275 157.958 245.668 113.284C247.144 101.058 243.667 88.3873 235.859 79.0349C206.678 44.0831 166.599 75.1498 166.599 75.1498C166.599 75.1498 187.417 18.5517 137.408 3.75901C128.965 1.26155 119.809 1.41228 111.479 4.28317Z"
				fill={stickerFill || '#F67987'}
				stroke={stickerStroke || 'white'}
				stroke-width="4"
			/>
		</svg>
	);
};

export default Flower5SidesSticker;
