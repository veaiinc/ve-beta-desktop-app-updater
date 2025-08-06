import { memo, useEffect, useRef, useState } from 'react';
import { ReactComponent as Success } from '../../../assets/svg/custom_toast/tickmark.svg';
import { ReactComponent as Error } from '../../../assets/svg/custom_toast/exclamatory.svg';
import { ReactComponent as Warning } from '../../../assets/svg/custom_toast/warning.svg';
import Spinner from '../loaders/Spinner';

import '../../../assets/scss/toast/toast.scss';

const defaultDuration = 3; // 3 seconds
const exitDuration = 500;

let triggerToastFn = null;
let activeToasts = new Set(); // Track active toast IDs to prevent duplicates

const toastIcon = {
	success: <Success />,
	warning: <Warning />,
	error: <Error />,
	loading: <Spinner className="loading-spinner" />,
};

const CustomToast = () => {
	const toastRefs = useRef({});
	const timeoutRefs = useRef({});
	const [toasts, setToasts] = useState([]);

	useEffect(() => {
		triggerToastFn = ({ type, content, duration = defaultDuration, customStyle = {} }) => {
			const contentHash = hashCode(content + type);
			const id = `${contentHash}-${Date.now()}`;

			if (activeToasts.has(contentHash)) return id;

			activeToasts.add(contentHash);

			setToasts((prevToasts) => [
				...prevToasts,
				{ id, type, content, duration, isVisible: true, contentHash, customStyle },
			]);

			timeoutRefs.current[id] = setTimeout(() => {
				startExitAnimation(id, contentHash);
			}, duration * 1000);

			return id;
		};

		triggerToastFn.destroy = (id = null) => {
			if (id === null) {
				setToasts((prevToasts) => {
					prevToasts.forEach((toast) => {
						if (timeoutRefs.current[toast.id]) {
							clearTimeout(timeoutRefs.current[toast.id]);
						}
						activeToasts.delete(toast.contentHash);
					});
					return [];
				});
				toastRefs.current = {};
				timeoutRefs.current = {};
			} else {
				setToasts((prevToasts) => {
					const toastToDestroy = prevToasts.find((t) => t.id === id);
					if (toastToDestroy) {
						if (timeoutRefs.current[id]) {
							clearTimeout(timeoutRefs.current[id]);
						}
						activeToasts.delete(toastToDestroy.contentHash);
						return prevToasts.filter((toast) => toast.id !== id);
					}
					return prevToasts;
				});
			}
		};

		return () => {
			Object.values(timeoutRefs.current).forEach(clearTimeout);
			triggerToastFn = null;
			activeToasts.clear();
		};
	}, []);

	const startExitAnimation = (id, contentHash) => {
		setToasts((prevToasts) =>
			prevToasts.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast)),
		);

		timeoutRefs.current[id] = setTimeout(() => {
			setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
			delete timeoutRefs.current[id];
			delete toastRefs.current[id];
			activeToasts.delete(contentHash);
		}, exitDuration);
	};

	const handleClose = (id, contentHash) => {
		if (timeoutRefs.current[id]) {
			clearTimeout(timeoutRefs.current[id]);
		}
		startExitAnimation(id, contentHash);
	};

	function hashCode(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0;
		}
		return hash;
	}

	return (
		<div className="toast-container">
			{toasts.map((toast) => {
				const { customStyle = {} } = toast;
				const { style = {} } = customStyle;

				return (
					<div
						key={toast.id}
						ref={(el) => (toastRefs.current[toast.id] = el)}
						className={`toast ${toast.type} ${
							toast.isVisible ? 'slide-in' : 'slide-out'
						}`}
						style={style}
					>
						<div className="left-part">
							<div className="toast__icon">{toastIcon[toast?.type]}</div>
							<div className="toast__content">
								<p className="toast__message">{toast.content}</p>
							</div>
						</div>
						<div className="vertical-line" />
						<button
							className="toast__close-btn"
							onClick={() => handleClose(toast.id, toast.contentHash)}
						>
							Close
						</button>
					</div>
				);
			})}
		</div>
	);
};

function isMessageEmpty(message) {
	return !message || message.trim() === '';
}

const message = {
	show({ type, content, duration = defaultDuration, customStyle = {} }) {
		if (isMessageEmpty(content)) {
			type = 'error';
			content = 'Message is empty';
		}
		if (triggerToastFn) {
			return triggerToastFn({ type, content, duration, customStyle });
		}
		console.warn('CustomToast component not mounted yet.');
		return null;
	},

	success(content, duration, customStyle) {
		return this.show({ type: 'success', content, duration, customStyle });
	},

	warning(content, duration, customStyle) {
		return this.show({ type: 'warning', content, duration, customStyle });
	},

	error(content, duration, customStyle) {
		return this.show({ type: 'error', content, duration, customStyle });
	},

	loading(content, duration = defaultDuration, customStyle) {
		return this.show({ type: 'loading', content, duration, customStyle });
	},

	destroy(id = null) {
		if (triggerToastFn && triggerToastFn.destroy) {
			triggerToastFn.destroy(id);
		} else {
			console.warn('CustomToast component not mounted yet.');
		}
	},
};

export { message };
export default memo(CustomToast);
