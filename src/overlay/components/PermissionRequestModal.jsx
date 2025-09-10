import React from 'react';
import { Mic, Settings, RefreshCw } from 'lucide-react';
import './permission-request-modal.scss';

const PermissionRequestModal = ({ isVisible, onClose, onRetry, permissionType = 'request' }) => {
	if (!isVisible) return null;

	const getContent = () => {
		switch (permissionType) {
			case 'request':
				return {
					title: 'Microphone Access Required',
					message:
						'Ve AI needs access to your microphone to enable voice transcription and live intelligence features.',
					steps: [
						'Click "Allow" when your browser prompts for microphone access',
						"If you don't see a prompt, look for a microphone icon in your browser's address bar",
						'You can change this permission anytime in your browser settings',
					],
					icon: <Mic size={24} />,
					buttonText: 'Request Access',
				};
			case 'denied':
				return {
					title: 'Microphone Access Denied',
					message:
						"Microphone access was previously denied. To enable voice features, you'll need to manually allow microphone access.",
					steps: [
						"Look for a microphone icon in your browser's address bar and click it",
						'Select "Allow" for microphone access',
						'On macOS: Go to System Preferences > Privacy & Security > Microphone',
						'Restart the app if needed after changing system permissions',
					],
					icon: <Settings size={24} />,
					buttonText: 'Try Again',
				};
			case 'system':
				return {
					title: 'System Permission Required',
					message:
						'Ve AI needs system-level microphone permission. Please enable it in your system settings.',
					steps: [
						'Open System Preferences (macOS) or Settings (Windows)',
						'Go to Privacy & Security > Microphone',
						'Enable microphone access for Ve AI',
						'Restart the application',
					],
					icon: <Settings size={24} />,
					buttonText: 'Restart App',
				};
			default:
				return {
					title: 'Microphone Access Required',
					message: 'Please allow microphone access to use voice features.',
					steps: [],
					icon: <Mic size={24} />,
					buttonText: 'Try Again',
				};
		}
	};

	const content = getContent();

	return (
		<div className="permission-modal-overlay">
			<div className="permission-modal">
				<div className="permission-modal__header">
					<div className="permission-modal__icon">{content.icon}</div>
					<h2 className="permission-modal__title">{content.title}</h2>
				</div>

				<div className="permission-modal__content">
					<p className="permission-modal__message">{content.message}</p>

					{content.steps.length > 0 && (
						<div className="permission-modal__steps">
							<h4>How to enable:</h4>
							<ol>
								{content.steps.map((step, index) => (
									<li key={index}>{step}</li>
								))}
							</ol>
						</div>
					)}
				</div>

				<div className="permission-modal__actions">
					<button
						className="permission-modal__button permission-modal__button--secondary"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="permission-modal__button permission-modal__button--primary"
						onClick={onRetry}
					>
						<RefreshCw size={16} />
						{content.buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PermissionRequestModal;
