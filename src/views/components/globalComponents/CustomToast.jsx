import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Success } from '../../../assets/svg/custom_notification/tickmark.svg';
import { ReactComponent as Error } from '../../../assets/svg/custom_notification/exclamatory.svg';
import { ReactComponent as Warning } from '../../../assets/svg/custom_notification/warning.svg';
import '../../../assets/scss/toast/toast.scss';
import { SpinnerIcon } from '@livekit/components-react';

// Duration constants
const exitDuration = 500;

let triggerToast; // External trigger for the toast

const CustomToast = () => {
	const [toastData, setToastData] = useState(null);
	const [visible, setVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	const lastToastRef = useRef(null);

	useEffect(() => {
		triggerToast = ({ type, content, duration }) => {
			const newToast = { type, content };

			const isSameToast =
				visible && JSON.stringify(lastToastRef.current) === JSON.stringify(newToast);
			if (isSameToast) return;

			const showNewToast = () => {
				lastToastRef.current = newToast;
				setToastData(newToast);
				setIsExiting(false);
				setVisible(true);

				if (type !== 'loading' && duration > 0) {
					setTimeout(() => {
						setIsExiting(true);
						setTimeout(() => {
							setVisible(false);
							setToastData(null);
							lastToastRef.current = null;
						}, exitDuration);
					}, duration);
				}
			};

			if (visible) {
				// Start exiting current toast
				setIsExiting(true);
				setTimeout(() => {
					setVisible(false);
					setToastData(null);
					lastToastRef.current = null;

					// Delay to retrigger animation for the new toast
					setTimeout(showNewToast, 50);
				}, exitDuration);
			} else {
				showNewToast();
			}
		};
	}, [visible]);

	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => {
			setVisible(false);
			setToastData(null);
			lastToastRef.current = null;
		}, exitDuration);
	};

	return (
		<div className="toast-container">
			{visible && toastData && (
				<div className={`toast ${isExiting ? 'slide-out' : 'slide-in'}`}>
					<div className="left-part">
						<div className="toast__icon">
							{toastData.type === 'success' && <Success />}
							{toastData.type === 'warning' && <Warning />}
							{toastData.type === 'error' && <Error />}
							{toastData.type === 'loading' && (
								<SpinnerIcon className="loading-spinner" />
							)}
						</div>
						<div className="toast__content">
							<p className="toast__message">{toastData.content}</p>
						</div>
					</div>
					<div className="vertical-line" />
					<button className="toast__close-btn" onClick={handleClose}>
						Close
					</button>
				</div>
			)}
		</div>
	);
};

// Toast controller
const message = {
	show({ type, content, duration = 3000 }) {
		if (triggerToast) {
			triggerToast({ type, content, duration });
		} else {
			console.warn('CustomToast component is not mounted yet.');
		}
	},
	success(content, duration = 3000) {
		this.show({ type: 'success', content, duration });
	},
	warning(content, duration = 3000) {
		this.show({ type: 'warning', content, duration });
	},
	error(content, duration = 3000) {
		this.show({ type: 'error', content, duration });
	},
	loading(content) {
		this.show({ type: 'loading', content, duration: 0 });
	},
};

export { CustomToast, message };
