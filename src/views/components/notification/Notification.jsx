import React, { useEffect } from 'react';
import '../../../assets/scss/notification/notification.scss';
const Notification = ({ duration = 3000, onClose, open, children, width = 300 }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<div
			className={`custom-notification ${open ? 'slide-in' : 'slide-out'}`}
			style={{ width: `${width}px`, right: !open ? `${-(width + 50)}px` : '' }}
		>
			{children}
		</div>
	);
};

export default Notification;
