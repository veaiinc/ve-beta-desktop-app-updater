import React, { memo, useEffect, useRef, useState } from 'react';
import { ReactComponent as Success } from '../../../assets/svg/custom_notification/tickmark.svg';
import { ReactComponent as Error } from '../../../assets/svg/custom_notification/exclamatory.svg';
import { ReactComponent as Warning } from '../../../assets/svg/custom_notification/warning.svg';
import '../../../assets/scss/toast/toast.scss';
import { SpinnerIcon } from '@livekit/components-react';

const exitDuration = 500;
const defaultDuration = 3000;
let triggerToast;

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

				if (duration > 0) {
					setTimeout(() => {
						if (
							lastToastRef.current &&
							JSON.stringify(lastToastRef.current) === JSON.stringify(newToast)
						) {
							handleClose();
						}
					}, duration);
				}
			};

			if (visible) {
				setIsExiting(true);
				setTimeout(() => {
					setVisible(false);
					setToastData(null);
					lastToastRef.current = null;
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

function isMessageEmpty(message) {
	return message === undefined || message === null || message === '';
}

const message = {
	show({ type, content, duration = defaultDuration }) {
		if (isMessageEmpty(content)) {
			type = 'error';
			content = 'Message is empty';
			duration = defaultDuration;
		}

		if (triggerToast) {
			triggerToast({ type, content, duration });
		} else {
			console.warn('CustomToast component is not mounted yet.');
		}
	},
	success(content, duration) {
		this.show({ type: 'success', content, duration });
	},
	warning(content, duration) {
		this.show({ type: 'warning', content, duration });
	},
	error(content, duration) {
		this.show({ type: 'error', content, duration });
	},
	loading(content, duration = defaultDuration) {
		this.show({ type: 'loading', content, duration });
	},
};

export default memo(CustomToast);
export { message };
