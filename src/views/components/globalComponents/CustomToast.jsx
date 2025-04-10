import React, { useEffect, useRef, useState } from 'react';
import success from '../../../assets/svg/custom_toast/tickmark.svg';
import error from '../../../assets/svg/custom_toast/exclamatory.svg';
import warning from '../../../assets/svg/custom_toast/warning.svg';
import '../../../assets/scss/toast/toast.scss';

const MESSAGE_TYPES = {
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error',
	LOADING: 'loading',
};

const CheckIcon = () => <img src={success} alt="Success" />;
const WarningIcon = () => <img src={warning} alt="Warning" />;
const ErrorIcon = () => <img src={error} alt="Error" />;
const LoadingIcon = () => (
	<svg viewBox="0 0 24 24" className="loading-spinner">
		<circle cx="12" cy="12" r="10" stroke="#f2f2f3" strokeWidth="3" fill="none" />
	</svg>
);

// Duration constants
const EXIT_ANIMATION_DURATION = 500;

let triggerToast; // External trigger for the toast

const CustomToast = ({ duration = 3000 }) => {
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

				if (type !== MESSAGE_TYPES.LOADING && duration > 0) {
					setTimeout(() => {
						setIsExiting(true);
						setTimeout(() => {
							setVisible(false);
							setToastData(null);
							lastToastRef.current = null;
						}, EXIT_ANIMATION_DURATION);
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
				}, EXIT_ANIMATION_DURATION);
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
		}, EXIT_ANIMATION_DURATION);
	};

	return (
		<div className="toast-container">
			{visible && toastData && (
				<div
					className={`toast toast--${toastData.type} ${
						isExiting ? 'slide-out' : 'slide-in'
					}`}
				>
					<div className="left-part">
						<div className="toast__icon">
							{toastData.type === MESSAGE_TYPES.SUCCESS && <CheckIcon />}
							{toastData.type === MESSAGE_TYPES.WARNING && <WarningIcon />}
							{toastData.type === MESSAGE_TYPES.ERROR && <ErrorIcon />}
							{toastData.type === MESSAGE_TYPES.LOADING && <LoadingIcon />}
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
		this.show({ type: MESSAGE_TYPES.SUCCESS, content, duration });
	},
	warning(content, duration = 3000) {
		this.show({ type: MESSAGE_TYPES.WARNING, content, duration });
	},
	error(content, duration = 3000) {
		this.show({ type: MESSAGE_TYPES.ERROR, content, duration });
	},
	loading(content) {
		this.show({ type: MESSAGE_TYPES.LOADING, content, duration: 0 });
	},
};

export { CustomToast, message };
