import { useState, useContext } from 'react';
import ReactModal from '../../../../../../../components/modalsV2/';
import { ReactComponent as CrossIcon } from '../../../../../../../../assets/svg/docs/cross.svg';
import { ReactComponent as EyeIcon } from '../../../../../../../../assets/svg/activity/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../../../../../../../assets/svg/gallery/crossedOpenEye.svg';
import Spinner from '../../../../../../loaders/Spinner';

const ListConnectModal = ({ isOpen, onClose, action, onApiKeySubmit, isLoading = false }) => {
	const [apiKey, setApiKey] = useState('');
	const [showApiKey, setShowApiKey] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		if (!apiKey.trim()) {
			setError('API key is required');
			return;
		}

		setError('');

		try {
			if (onApiKeySubmit) {
				await onApiKeySubmit(apiKey, action);
			}
		} catch (error) {
			console.error('API key submission error:', error);
			setError(error.message || 'Failed to connect with API key');
		}
	};

	const handleClose = () => {
		setApiKey('');
		setError('');
		setShowApiKey(false);
		onClose();
	};

	const toggleApiKeyVisibility = () => {
		setShowApiKey(!showApiKey);
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={handleClose}
			modalType="center"
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="api-key-modal">
				<div className="api-key-modal-header">
					<div className="header-content">
						<img
							src={action?.toolkit?.logo || ''}
							alt={action?.toolkit?.name || 'Tool'}
							className="tool-logo"
						/>
						<div className="tool-info">
							<h2>Connect {action?.toolkit?.name || 'Tool'}</h2>
							<p>Enter your API key to connect this tool</p>
						</div>
					</div>
					<CrossIcon onClick={handleClose} className="cross-icon" />
				</div>

				<div className="api-key-modal-body">
					<div className="form-field">
						<label htmlFor="apiKey">
							API Key
							<span className="required">*</span>
						</label>
						<div className="input-container">
							<input
								id="apiKey"
								type={showApiKey ? 'text' : 'password'}
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								placeholder="Enter your API key"
								className="api-key-input"
								disabled={isLoading}
							/>
							<button
								type="button"
								className="toggle-visibility"
								onClick={toggleApiKeyVisibility}
								disabled={isLoading}
							>
								{showApiKey ? <EyeSlashIcon /> : <EyeIcon />}
							</button>
						</div>
						{error && <div className="field-error">{error}</div>}
					</div>

					<div className="help-text">
						<p>
							You can find your API key in your {action?.toolkit?.name || 'tool'}{' '}
							account settings. This key will be securely stored and used to
							authenticate your requests.
						</p>
					</div>
				</div>

				<div className="api-key-modal-footer">
					<button
						type="button"
						className="cancel-button"
						onClick={handleClose}
						disabled={isLoading}
					>
						Cancel
					</button>
					<button
						type="button"
						className="connect-button"
						onClick={handleSubmit}
						disabled={isLoading || !apiKey.trim()}
					>
						{isLoading ? (
							<>
								<Spinner width="16px" height="16px" color="var(--primary-font)" />
								<span>Connecting...</span>
							</>
						) : (
							'Connect'
						)}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default ListConnectModal;
