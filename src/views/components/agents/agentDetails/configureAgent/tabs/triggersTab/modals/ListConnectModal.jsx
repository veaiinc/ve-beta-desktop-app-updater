import { useState, useContext } from 'react';
import ReactModal from '../../../../../../../components/modalsV2/';
import { ReactComponent as CrossIcon } from '../../../../../../../../assets/svg/docs/cross.svg';
import { ReactComponent as EyeIcon } from '../../../../../../../../assets/svg/activity/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../../../../../../../assets/svg/gallery/crossedOpenEye.svg';
import Spinner from '../../../../../../loaders/Spinner';
import '../../../../../../../../assets/scss/ai_assistant/modal/apiKeyModal.scss';

const ListConnectModal = ({ isOpen, onClose, action, onApiKeySubmit, isLoading = false }) => {
	const [info, setInfo] = useState({
		apiKey: '',
		showApiKey: false,
		bearerToken: '',
		showBearerToken: false,
		userId: '',
		phoneNumberId: '',
		error: '',
	});

	const handleSubmit = async () => {
		if (!info.apiKey.trim()) {
			setInfo({ ...info, error: 'API key is required' });
			return;
		}

		// For WhatsApp, additional fields are required
		if (action?.toolkit?.slug === 'whatsapp') {
			if (!info.bearerToken.trim()) {
				setInfo({ ...info, error: 'Bearer token is required for WhatsApp' });
				return;
			}
			if (!info.userId.trim()) {
				setInfo({ ...info, error: 'User ID is required for WhatsApp' });
				return;
			}
			if (!info.phoneNumberId.trim()) {
				setInfo({ ...info, error: 'Phone number ID is required for WhatsApp' });
				return;
			}
		}

		setInfo({ ...info, error: '' });

		if (onApiKeySubmit) {
			// For WhatsApp, pass additional fields
			if (action?.toolkit?.slug === 'whatsapp') {
				await onApiKeySubmit(
					{
						apiKey: info.apiKey,
						bearer_token: info.bearerToken,
						user_id: info.userId,
						phone_number_id: info.phoneNumberId,
					},
					action,
				);
			} else {
				await onApiKeySubmit(info.apiKey, action);
			}
		}
	};

	const handleClose = () => {
		setInfo({
			apiKey: '',
			showApiKey: false,
			bearerToken: '',
			showBearerToken: false,
			userId: '',
			phoneNumberId: '',
			error: '',
		});
		onClose();
	};

	const toggleApiKeyVisibility = () => {
		setInfo({ ...info, showApiKey: !info.showApiKey });
	};

	const toggleBearerTokenVisibility = () => {
		setInfo({ ...info, showBearerToken: !info.showBearerToken });
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
								type={info.showApiKey ? 'text' : 'password'}
								value={info.apiKey}
								onChange={(e) => setInfo({ ...info, apiKey: e.target.value })}
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
								{info.showApiKey ? <EyeSlashIcon /> : <EyeIcon />}
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
										type={info.showBearerToken ? 'text' : 'password'}
										value={info.bearerToken}
										onChange={(e) =>
											setInfo({ ...info, bearerToken: e.target.value })
										}
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
										{info.showBearerToken ? <EyeSlashIcon /> : <EyeIcon />}
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
									value={info.userId}
									onChange={(e) => setInfo({ ...info, userId: e.target.value })}
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
									value={info.phoneNumberId}
									onChange={(e) =>
										setInfo({ ...info, phoneNumberId: e.target.value })
									}
									placeholder="Enter your phone number ID"
									className="api-key-input"
									disabled={isLoading}
								/>
							</div>
						</div>
					)}

					{info.error && <div className="field-error">{info.error}</div>}
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
							!info.apiKey.trim() ||
							(action?.toolkit?.slug === 'whatsapp' &&
								(!info.bearerToken.trim() ||
									!info.userId.trim() ||
									!info.phoneNumberId.trim()))
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
