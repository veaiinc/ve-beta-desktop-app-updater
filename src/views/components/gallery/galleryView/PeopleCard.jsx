import React, { useRef, useEffect } from 'react';
import _ from 'lodash';

function Peopleitem(props) {
	const peopleCardOuterContainer = useRef();

	// Validate required props
	if (
		!props.url ||
		!props.people?.boundingBox ||
		typeof props.originalWidth !== 'number' ||
		typeof props.originalHeight !== 'number' ||
		props.originalWidth <= 0 ||
		props.originalHeight <= 0 ||
		!props.thumbwidth ||
		props.thumbwidth <= 0
	) {
		return null;
	}

	const { boundingBox } = props.people;
	const { originalWidth, originalHeight, thumbwidth, url } = props;

	// Add padding around the face (e.g., 20% extra on all sides)
	const paddingFactor = 0.2; // 20% padding
	const paddedWidth = boundingBox.Width * originalWidth * (1 + paddingFactor);
	const paddedHeight = boundingBox.Height * originalHeight * (1 + paddingFactor);

	// Calculate face center in original image
	const faceCenterX = (boundingBox.Left + boundingBox.Width / 2) * originalWidth;
	const faceCenterY = (boundingBox.Top + boundingBox.Height / 2) * originalHeight;

	// Compute crop bounds (centered on face)
	let cropX = faceCenterX - paddedWidth / 2;
	let cropY = faceCenterY - paddedHeight / 2;
	let cropWidth = paddedWidth;
	let cropHeight = paddedHeight;

	// Constrain crop to image boundaries
	cropX = Math.max(0, Math.min(cropX, originalWidth - cropWidth));
	cropY = Math.max(0, Math.min(cropY, originalHeight - cropHeight));
	cropWidth = Math.min(cropWidth, originalWidth - cropX);
	cropHeight = Math.min(cropHeight, originalHeight - cropY);

	// If crop is too small, fallback to full image centered
	if (cropWidth <= 0 || cropHeight <= 0) {
		cropX = 0;
		cropY = 0;
		cropWidth = originalWidth;
		cropHeight = originalHeight;
	}

	// Compute scale to fit crop into thumbwidth (maintain aspect by covering)
	const scale = thumbwidth / Math.max(cropWidth, cropHeight);

	// Background size and position
	const bgSizeX = originalWidth * scale;
	const bgSizeY = originalHeight * scale;
	const bgPosX = -cropX * scale;
	const bgPosY = -cropY * scale;

	// Avoid NaN or infinite values
	if (
		isNaN(bgPosX) ||
		isNaN(bgPosY) ||
		isNaN(bgSizeX) ||
		isNaN(bgSizeY) ||
		!isFinite(bgPosX) ||
		!isFinite(bgPosY) ||
		bgSizeX <= 0 ||
		bgSizeY <= 0
	) {
		return null;
	}

	return (
		<div
			ref={peopleCardOuterContainer}
			className="people-card f-left"
			style={{
				width: thumbwidth,
				height: thumbwidth,
				display: props.navBarIcon && props.dontShowPhotosCount ? '' : 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				justifyContent: 'center',
				background: 'none',
				boxShadow: 'none',
				position: 'relative',
			}}
			id={props.people._id}
		>
			<div
				className="img f-left"
				style={{
					width: thumbwidth,
					height: thumbwidth,
					borderRadius: 0,
					position: 'relative',
					maxWidth: thumbwidth,
				}}
			>
				{/* Circular cropped image using background */}
				<div
					style={{
						width: '100%',
						height: '100%',
						backgroundImage: `url(${url})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: `${bgPosX}px ${bgPosY}px`,
						backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
						borderRadius: '50%',
						overflow: 'hidden',
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 2,
						backgroundColor: '#f5f5f5',
					}}
				/>

				{/* Optional: White circular mask behind (if needed for contrast) */}
				<div
					style={{
						width: thumbwidth,
						height: thumbwidth,
						zIndex: 1,
						position: 'absolute',
						borderRadius: '50%',
						backgroundColor: '#fff',
					}}
				></div>
			</div>
		</div>
	);
}

export default React.memo(Peopleitem);
