import React, { memo, useState, useEffect } from 'react';
import moment from 'moment';

const MonthEventWrapper = ({ event }) => {
	// const [truncateLength, setTruncateLength] = useState(25);
	const isMultiDay = !moment(event.start).isSame(event.end, 'day');

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		const width = window.innerWidth;
	// 		if (width < 320) {
	// 			// Mobile - Extra small
	// 			setTruncateLength(1);
	// 		} else if (width < 480) {
	// 			// Mobile - Small
	// 			setTruncateLength(2);
	// 		} else if (width < 640) {
	// 			// Mobile - Medium
	// 			setTruncateLength(6);
	// 		} else if (width < 768) {
	// 			// Tablet - Small
	// 			setTruncateLength(6);
	// 		} else if (width < 1024) {
	// 			// Laptop - Small
	// 			setTruncateLength(2);
	// 		} else if (width < 1200) {
	// 			// Laptop - Medium
	// 			setTruncateLength(3);
	// 		} else if (width < 1400) {
	// 			// Laptop - Large
	// 		} else if (width < 1500) {
	// 			// Tablet - Medium
	// 			setTruncateLength(6);
	// 		} else if (width < 1600) {
	// 			// Desktop - Small
	// 			setTruncateLength(15);
	// 		} else if (width < 1800) {
	// 			// Desktop - Medium
	// 			setTruncateLength(18);
	// 		} else if (width < 2000) {
	// 			// Desktop - Large
	// 			setTruncateLength(20);
	// 		} else if (width < 2400) {
	// 			// Desktop - Extra Large
	// 			setTruncateLength(25);
	// 		} else {
	// 			// Desktop - Ultra Wide
	// 			setTruncateLength(25);
	// 		}
	// 	};

	// 	handleResize();
	// 	window.addEventListener('resize', handleResize);
	// 	return () => window.removeEventListener('resize', handleResize);
	// }, []);

	// const truncatedTitle =
	// 	event?.title?.length > truncateLength
	// 		? `${event.title.substring(0, truncateLength)}...`
	// 		: event?.title;

	return (
		<div
			className="monthEventWrapper"
			style={{ background: isMultiDay ? 'var(--info)' : 'none' }}
		>
			<span
				className="leftColorBar"
				style={{
					backgroundColor: event?.calendarCategory?.color || '#989898',
					// boxShadow: `0px 0px 10px 0px ${event?.calendarCategory?.color || '#989898'}`,
				}}
			/>
			<div
				className="textContainer"
				style={{ color: 'var(--primary-font)' }}
				title={event?.title}
			>
				{event?.title}
			</div>
		</div>
	);
};

export default memo(MonthEventWrapper);
