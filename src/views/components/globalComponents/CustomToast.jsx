import React, { memo, useEffect, useRef, useState } from 'react';
import { ReactComponent as Success } from '../../../assets/svg/custom_notification/tickmark.svg';
import { ReactComponent as Error } from '../../../assets/svg/custom_notification/exclamatory.svg';
import { ReactComponent as Warning } from '../../../assets/svg/custom_notification/warning.svg';
import { SpinnerIcon } from '@livekit/components-react';
import '../../../assets/scss/toast/toast.scss';

const defaultDuration = 3; // 3 seconds
const exitDuration = 500;

let triggerToastFn = null;
let activeToasts = new Set(); // Track active toast IDs to prevent duplicates

const CustomToast = () => {
	const toastRefs = useRef({});
	const timeoutRefs = useRef({});
	const [toasts, setToasts] = useState([]);

	useEffect(() => {
		triggerToastFn = ({ type, content, duration = defaultDuration }) => {
			// Create a unique content-based ID to prevent duplicates
			const contentHash = hashCode(content + type);
			const id = `${contentHash}-${Date.now()}`;

			// Check if this toast is already active
			if (activeToasts.has(contentHash)) {
				return id; // Skip if already showing
			}

			activeToasts.add(contentHash);

			setToasts((prevToasts) => [
				...prevToasts,
				{ id, type, content, duration, isVisible: true, contentHash },
			]);

			// Schedule the exit animation
			timeoutRefs.current[id] = setTimeout(() => {
				startExitAnimation(id, contentHash);
			}, duration);

			return id;
		};

		return () => {
			// Clear all timeouts on unmount
			Object.values(timeoutRefs.current).forEach(clearTimeout);
			triggerToastFn = null;
			activeToasts.clear();
		};
	}, []);

	const startExitAnimation = (id, contentHash) => {
		setToasts((prevToasts) =>
			prevToasts.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast)),
		);

		// Remove the toast from DOM after exit animation completes
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

	// Simple hash function for content identification
	function hashCode(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	return (
		<div className="toast-container">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					ref={(el) => (toastRefs.current[toast.id] = el)}
					className={`toast ${toast.type} ${toast.isVisible ? 'slide-in' : 'slide-out'}`}
				>
					<div className="left-part">
						<div className="toast__icon">
							{toast.type === 'success' && <Success />}
							{toast.type === 'warning' && <Warning />}
							{toast.type === 'error' && <Error />}
							{toast.type === 'loading' && (
								<SpinnerIcon className="loading-spinner" />
							)}
						</div>
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
			))}
		</div>
	);
};

function isMessageEmpty(message) {
	return !message || message.trim() === '';
}

const message = {
	show({ type, content, duration = defaultDuration }) {
		if (isMessageEmpty(content)) {
			type = 'error';
			content = 'Message is empty';
		}
		if (triggerToastFn) {
			triggerToastFn({ type, content, duration: duration * 1000 }); // passing the duration in seconds
		} else {
			console.warn('CustomToast component not mounted yet.');
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
