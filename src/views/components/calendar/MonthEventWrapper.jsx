import React, { memo, useState, useEffect } from 'react';

const MonthEventWrapper = ({ event }) => {
	const [truncateLength, setTruncateLength] = useState(12);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 480) {
				setTruncateLength(2);
			} else if (width < 768) {
				setTruncateLength(4);
			} else if (width < 1200) {
				setTruncateLength(6);
			} else if (width < 1400) {
				setTruncateLength(12);
			} else {
				setTruncateLength(15);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const truncatedTitle =
		event?.title?.length > truncateLength
			? `${event.title.substring(0, truncateLength)}...`
			: event?.title;

	return (
		<div className="monthEventWrapper">
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
				{truncatedTitle}
			</div>
		</div>
	);
};

export default memo(MonthEventWrapper);
