import { useState, useContext } from 'react';
import ReactModal from '../../../../../../../components/modalsV2/';
import { ReactComponent as CrossIcon } from '../../../../../../../../assets/svg/docs/cross.svg';
import { ReactComponent as EyeIcon } from '../../../../../../../../assets/svg/activity/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../../../../../../../assets/svg/gallery/crossedOpenEye.svg';
import Spinner from '../../../../../../loaders/Spinner';
import '../../../../../../../../assets/scss/ai_assistant/modal/apiKeyModal.scss';

const ListConnectModal = ({ isOpen, onClose, action, onApiKeySubmit, isLoading = false }) => {
	const [apiKey, setApiKey] = useState('');
	const [showApiKey, setShowApiKey] = useState(false);
	const [bearerToken, setBearerToken] = useState('');
	const [showBearerToken, setShowBearerToken] = useState(false);
	const [userId, setUserId] = useState('');
	const [phoneNumberId, setPhoneNumberId] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		if (!apiKey.trim()) {
			setError('API key is required');
			return;
		}

		// For WhatsApp, additional fields are required
		if (action?.toolkit?.slug === 'whatsapp') {
			if (!bearerToken.trim()) {
				setError('Bearer token is required for WhatsApp');
				return;
			}
			if (!userId.trim()) {
				setError('User ID is required for WhatsApp');
				return;
			}
			if (!phoneNumberId.trim()) {
				setError('Phone number ID is required for WhatsApp');
				return;
			}
		}

		setError('');

		if (onApiKeySubmit) {
			// For WhatsApp, pass additional fields
			if (action?.toolkit?.slug === 'whatsapp') {
				await onApiKeySubmit(
					{
						apiKey,
						bearer_token: bearerToken,
						user_id: userId,
						phone_number_id: phoneNumberId,
					},
					action,
				);
			} else {
				await onApiKeySubmit(apiKey, action);
			}
		}
	};

	const handleClose = () => {
		setApiKey('');
		setBearerToken('');
		setUserId('');
		setPhoneNumberId('');
		setError('');
		setShowApiKey(false);
		setShowBearerToken(false);
		onClose();
	};

	const toggleApiKeyVisibility = () => {
		setShowApiKey(!showApiKey);
	};

	const toggleBearerTokenVisibility = () => {
		setShowBearerToken(!showBearerToken);
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
					</div>

					{/* WhatsApp specific fields */}
					{action?.toolkit?.slug === 'whatsapp' && (
						<div className="whatsapp-fields">
							<div className="whatsapp-header">
								<h4>WhatsApp Business API Settings</h4>
								<p>Additional credentials required for WhatsApp integration</p>
							</div>
							<div className="form-field">
								<label htmlFor="bearerToken">
									Auth Token
									<span className="required">*</span>
								</label>
								<p>
									The auth token for WhatsApp API requests. Visit{' '}
									<a
										href="https://developers.facebook.com/blog/post/2022/12/05/auth-tokens"
										target="_blank"
										rel="noopener noreferrer"
									>
										https://developers.facebook.com/blog/post/2022/12/05/auth-tokens
									</a>{' '}
									for more information
								</p>
								<div className="input-container">
									<input
										id="bearerToken"
										type={showBearerToken ? 'text' : 'password'}
										value={bearerToken}
										onChange={(e) => setBearerToken(e.target.value)}
										placeholder="Enter your bearer token"
										className="api-key-input"
										disabled={isLoading}
									/>
									<button
										type="button"
										className="toggle-visibility"
										onClick={toggleBearerTokenVisibility}
										disabled={isLoading}
									>
										{showBearerToken ? <EyeSlashIcon /> : <EyeIcon />}
									</button>
								</div>
							</div>

							<div className="form-field">
								<label htmlFor="userId">
									User ID
									<span className="required">*</span>
								</label>
								<input
									id="userId"
									type="text"
									value={userId}
									onChange={(e) => setUserId(e.target.value)}
									placeholder="Enter your user ID"
									className="api-key-input"
									disabled={isLoading}
								/>
							</div>

							<div className="form-field">
								<label htmlFor="phoneNumberId">
									Phone Number ID
									<span className="required">*</span>
								</label>
								<p>
									For phone number ID, go to a{' '}
									<a
										href="https://developers.facebook.com/apps"
										target="_blank"
										rel="noopener noreferrer"
									>
										https://developers.facebook.com/apps
									</a>{' '}
									and select the app where you have added WhatsApp. On the left
									side, click WhatsApp → API Setup. Select 'Start using the API'
									On the next page you can find your Phone number ID:
								</p>
								<input
									id="phoneNumberId"
									type="text"
									value={phoneNumberId}
									onChange={(e) => setPhoneNumberId(e.target.value)}
									placeholder="Enter your phone number ID"
									className="api-key-input"
									disabled={isLoading}
								/>
							</div>
						</div>
					)}

					{error && <div className="field-error">{error}</div>}
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
						disabled={
							isLoading ||
							!apiKey.trim() ||
							(action?.toolkit?.slug === 'whatsapp' &&
								(!bearerToken.trim() || !userId.trim() || !phoneNumberId.trim()))
						}
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
