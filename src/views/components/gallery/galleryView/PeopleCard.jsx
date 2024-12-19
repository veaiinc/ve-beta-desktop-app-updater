import React, { useRef, useEffect } from 'react';
import _ from 'lodash';

function Peopleitem(props) {
	const peopleCardOuterContainer = useRef();

	let url;
	let maxWidth = 1920;
	let maxHeight = 1080;

	url = props.url;

	let imageOptimisedheight =
		props.originalWidth > props.originalHeight
			? Math.ceil((maxWidth / props.originalWidth) * props.originalHeight)
			: Math.ceil((maxHeight / props.originalWidth) * props.originalHeight);

	let imageOptimisedWidth = props.originalWidth > props.originalHeight ? maxWidth : maxHeight;
	let top = _.has(props.people, 'boundingBox')
		? props.people.boundingBox.Top * imageOptimisedheight
		: 0;
	let left = _.has(props.people, 'boundingBox')
		? props.people.boundingBox.Left * imageOptimisedWidth
		: 0;
	let width = _.has(props.people, 'boundingBox')
		? props.people.boundingBox.Width * imageOptimisedWidth
		: imageOptimisedWidth;
	let height = _.has(props.people, 'boundingBox')
		? props.people.boundingBox.Height * imageOptimisedheight
		: imageOptimisedheight;

	let paddingPercentage = 0;
	let paddingWidth = width + (width * paddingPercentage) / 100;
	let paddingHeight = height + (height * paddingPercentage) / 100;

	let paddingLeft = left - (width * paddingPercentage) / 200;
	let paddingTop = top - (width * paddingPercentage) / 200;

	let squareWidth;
	let squareHeight;
	let squareLeft;
	let squareTop;
	let difference;
	let scaleRatio;
	if (paddingWidth < paddingHeight) {
		squareHeight = paddingHeight;
		squareWidth = paddingHeight;
		difference = squareWidth - paddingWidth;
		squareLeft = paddingLeft - difference / 2;
		squareTop = paddingTop;
		scaleRatio = parseFloat(props.thumbwidth / squareHeight);
	} else if (paddingWidth >= paddingHeight) {
		squareHeight = paddingWidth;
		squareWidth = paddingWidth;

		difference = squareHeight - paddingHeight;
		squareLeft = paddingLeft;
		squareTop = paddingTop - difference / 2;
		scaleRatio = parseFloat(props.thumbwidth / squareWidth);
	}

	return (
		<div
			ref={peopleCardOuterContainer}
			className={`people-card f-left`}
			style={{
				width: props.thumbwidth,
				height: _.has(props, 'url') ? props.thumbwidth : props.thumbwidth,
				display: _.has(props, 'navBarIcon') && props.dontShowPhotosCount ? '' : 'flex',
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
				className="img  f-left"
				style={{
					width: props.thumbwidth,
					height: props.thumbwidth,
					borderRadius: 0,
					position: 'relative',
					maxWidth: props.thumbwidth,
				}}
			>
				<div
					style={{
						width: squareWidth,
						height: squareHeight,
						background: `  url(${url})`,
						backgroundRepeat: 'no-repeat',
						backgroundPositionX: -squareLeft,
						backgroundPositionY: -squareTop,
						transform: `scale(${scaleRatio})`,
						position: 'absolute',
						top: `${(props.thumbwidth - squareHeight) / 2}px`,
						left: `${(props.thumbwidth - squareWidth) / 2}px`,
						borderRadius: '50%',
						backgroundColor: '#f5f5f5',
						zIndex: 2,
					}}
				></div>
				<div
					style={{
						width: props.thumbwidth,
						height: props.thumbwidth,
						zIndex: 1,
						position: 'absolute',

						borderRadius: '50%',
						backgroundColor: `${'#fff'}`,
					}}
				></div>
			</div>
		</div>
	);
}

export default Peopleitem;
