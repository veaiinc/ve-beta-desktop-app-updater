import { memo, useState, useEffect, useContext } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/integrations/integrationModel.scss';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import Service from '../../../../services/index';

const customStyles = {
	content: {
		width: '100%',
		maxWidth: '600px',
		background: 'var(--background-color, #0C0C0D)',
		borderRadius: '24px',
		padding: '0',
		margin: '0',
		border: 'none',
	},
	overlay: {
		backdropFilter: 'blur(5px)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1200,
	},
};

const IntegrationConnectModel = ({
	isOpen,
	closeModal,
	integration,
	onConnectionSuccess,
	onModalClose,
	// activeTab = 'private',
}) => {
	const [connectionStep, setConnectionStep] = useState(1);
	const [isConnecting, setIsConnecting] = useState(false);
	const [connectionError, setConnectionError] = useState(null);
	const [authWindow, setAuthWindow] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle', 'connecting', 'success', 'failed'
	const [checkInterval, setCheckInterval] = useState(null);
	const [verificationAttempt, setVerificationAttempt] = useState(0);

	const {
		templates: { getAuthUrlForThirdParty },
	} = useContext(Context);

	// Reset state when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			// Fresh start
			setConnectionStep(1);
			setIsConnecting(false);
			setConnectionError(null);
			setConnectionStatus('idle');
			setAuthWindow(null);
			if (checkInterval) {
				clearInterval(checkInterval);
				setCheckInterval(null);
			}
		}
	}, [isOpen]);

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			if (checkInterval) {
				clearInterval(checkInterval);
			}
		};
	}, [checkInterval]);

	const verifyConnection = async () => {
		try {
			// Add a small delay to allow the backend to process the authorization
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Make an API call to check if the connection was successful
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/connected-accounts-v2/${workspaceId}`;

			const response = await Service?.fetchGet(path, token, 'third_party_integrations_api');

			if (response?.[0] === true && response?.[1]?.data) {
				// Check if the specific integration is now connected
				const connectedAccounts = response[1].data;

				// Create an array of possible app names to match against
				const possibleAppNames = [
					integration?.connectType,
					integration?.title?.toLowerCase(),
					integration?.title?.toLowerCase().replace(/\s+/g, '-'),
					integration?.title?.toLowerCase().replace(/\s+/g, '_'),
					// Add common variations
					'google-drive',
					'google-calendar',
					'google_drive',
					'google_calendar',
				].filter(Boolean); // Remove undefined/null values

				const isConnected = connectedAccounts.some((account) => {
					const accountApp = account.app;
					return possibleAppNames.includes(accountApp);
				});

				return isConnected;
			}

			return false;
		} catch (error) {
			return false;
		}
	};

	const verifyConnectionWithRetry = async (maxRetries = 3) => {
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			setVerificationAttempt(attempt);

			const isConnected = await verifyConnection();

			if (isConnected) {
				setVerificationAttempt(0);
				return true;
			}

			if (attempt < maxRetries) {
				// Wait longer between each retry
				const delay = attempt * 2000; // 2s, 4s, 6s
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		setVerificationAttempt(0);
		return false;
	};

	const handleConnect = async (access) => {
		if (!integration) return;

		setIsConnecting(true);
		setConnectionStep(2);
		setConnectionError(null);
		setConnectionStatus('connecting');

		try {
			// Get the authorization URL
			const authUrl = await getAuthUrlForThirdParty(integration.connectType, access);

			if (authUrl) {
				// Open authorization window
				const windowFeatures =
					'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes';
				const newWindow = window.open(authUrl, '_blank', windowFeatures);
				setAuthWindow(newWindow);

				// Check if window was blocked
				if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
					setConnectionError('Popup blocked. Please allow popups and try again.');
					setIsConnecting(false);
					setConnectionStatus('failed');
					return;
				}

				// Monitor the auth window with better logic
				const interval = setInterval(async () => {
					try {
						// Check if window is still open
						if (newWindow.closed) {
							clearInterval(interval);
							setCheckInterval(null);

							// Verify the connection was successful
							const isConnected = await verifyConnectionWithRetry();

							if (isConnected) {
								setConnectionStep(3);
								setConnectionStatus('success');
								setIsConnecting(false);

								setTimeout(() => {
									// Call the success callback to refresh data
									if (onConnectionSuccess) {
										onConnectionSuccess();
									}
									setConnectionStep(1);
									setConnectionStatus('idle');
									message.success(
										`${integration?.title} connected successfully!`,
									);
								}, 2000);
							} else {
								// Connection verification failed
								setConnectionError(
									'Authorization was not completed. Please try again.',
								);
								setIsConnecting(false);
								setConnectionStatus('failed');
							}
						} else {
							// Window is still open, check if we can access the URL (optional)
							try {
								// This is a basic check - you might want to implement a more sophisticated verification
								// For now, we'll just keep monitoring
								if (
									newWindow.location.href &&
									newWindow.location.href.includes('success')
								) {
									// If we detect a success URL, we can close the window and proceed
									newWindow.close();
								}
							} catch (e) {
								// Cross-origin error, which is expected - continue monitoring
							}
						}
					} catch (error) {
						console.error('Error monitoring auth window:', error);
						clearInterval(interval);
						setCheckInterval(null);
						setConnectionError('Error monitoring authorization. Please try again.');
						setIsConnecting(false);
						setConnectionStatus('failed');
					}
				}, 1000);

				setCheckInterval(interval);
			} else {
				setConnectionError('Failed to get authorization URL');
				setIsConnecting(false);
				setConnectionStatus('failed');
			}
		} catch (error) {
			console.error('Error connecting integration:', error);
			setConnectionError(error.message || 'Failed to connect. Please try again.');
			setIsConnecting(false);
			setConnectionStatus('failed');
		}
	};

	const handleManualVerification = async () => {
		setIsConnecting(true);
		setConnectionError(null);

		try {
			const isConnected = await verifyConnectionWithRetry(5); // More retries for manual verification

			if (isConnected) {
				setConnectionStep(3);
				setConnectionStatus('success');
				setIsConnecting(false);

				setTimeout(() => {
					// Call the success callback to refresh data
					if (onConnectionSuccess) {
						onConnectionSuccess();
					}
					setConnectionStep(1);
					setConnectionStatus('idle');
					message.success(`${integration?.title} connected successfully!`);
				}, 2000);
			} else {
				setConnectionError(
					'Connection not found. Please complete the authorization process and try again.',
				);
				setIsConnecting(false);
				setConnectionStatus('failed');
			}
		} catch (error) {
			console.error('Error in manual verification:', error);
			setConnectionError('Verification failed. Please try again.');
			setIsConnecting(false);
			setConnectionStatus('failed');
		}
	};

	const getStepStatus = (step) => {
		if (connectionStatus === 'failed' && step === 2) return 'error';
		if (connectionStatus === 'success' && step === 3) return 'completed';
		if (step < connectionStep) return 'completed';
		if (step === connectionStep) return 'active';
		return 'pending';
	};

	const handleClose = () => {
		if (isConnecting && connectionStatus === 'connecting') {
			message.info('Please complete the authorization process first');
			return;
		}

		// Close auth window if it's still open
		if (authWindow && !authWindow.closed) {
			authWindow.close();
		}

		// Clear any monitoring intervals
		if (checkInterval) {
			clearInterval(checkInterval);
			setCheckInterval(null);
		}

		// Reset connection status when closing
		setConnectionStatus('idle');

		if (onModalClose) {
			onModalClose();
		}

		closeModal();
	};

	const handleRetry = () => {
		setConnectionError(null);
		setConnectionStep(1);
		setIsConnecting(false);
		setConnectionStatus('idle');
		if (checkInterval) {
			clearInterval(checkInterval);
			setCheckInterval(null);
		}
		if (authWindow && !authWindow.closed) {
			authWindow.close();
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={handleClose}
			modalType="center"
			customStyles={customStyles}
		>
			<div className="integration-modal">
				<div className="modal-content-wrapper">
					<div className="modal-header">
						<div className="integration-info">
							<img
								src={integration?.icon}
								alt={integration?.title}
								className="integration-icon"
							/>
							<div className="integration-text">
								<h2 className="integration-title">{integration?.title}</h2>
							</div>
						</div>
						<CloseIcon onClick={handleClose} className="close-button" />
					</div>

					<div className="modal-content">
						{connectionStep === 1 && (
							<>
								<div className="steps-section">
									<h3 className="steps-title">Steps</h3>
									<div className="connection-flow">
										<div className={`flow-step ${getStepStatus(1)}`}>
											<span className="step-text">Connect</span>
										</div>
										<div className="flow-arrow">→</div>
										<div className={`flow-step ${getStepStatus(2)}`}>
											<span className="step-text">Authorize</span>
										</div>
										<div className="flow-arrow">→</div>
										<div className={`flow-step ${getStepStatus(3)}`}>
											<span className="step-text">Ready</span>
										</div>
									</div>
								</div>

								<p className="connection-description">
									Experience superior search and use docs, sheets, slides, and
									other {integration?.title} files as context in your chats.
								</p>

								<div className="connect-button-container-wrapper">
									<div
										className="connect-button-container"
										onClick={() => handleConnect('private')}
										style={{ cursor: isConnecting ? 'not-allowed' : 'pointer' }}
									>
										{isConnecting ? (
											<>
												<span className="loading-spinner"></span>
												<span className="connect-text">Connecting...</span>
											</>
										) : (
											<span className="connect-text">
												Connect just for me
											</span>
										)}
									</div>
									<div
										className="connect-button-container"
										onClick={() => handleConnect('shared')}
										style={{ cursor: isConnecting ? 'not-allowed' : 'pointer' }}
									>
										{isConnecting ? (
											<>
												<span className="loading-spinner"></span>
												<span className="connect-text">Connecting...</span>
											</>
										) : (
											<span className="connect-text">
												Connect for Everyone
											</span>
										)}
									</div>
								</div>
							</>
						)}

						{connectionStep === 2 && (
							<div className="connection-content">
								<div className="step-content">
									<h3 className="step-title">
										{connectionError ? 'Connection Failed' : 'Authorizing...'}
									</h3>
									<p className="step-description">
										{connectionError
											? connectionError
											: 'Please complete the authorization in the popup window. Do not close the popup until you have finished the authorization process.'}
									</p>
									{!connectionError && (
										<div className="authorization-status">
											<div className="status-indicator">
												<span className="status-dot"></span>
												<span className="status-text">
													{verificationAttempt > 0
														? `Verifying connection... (Attempt ${verificationAttempt})`
														: 'Waiting for authorization...'}
												</span>
											</div>
											<div style={{ marginTop: '16px', textAlign: 'center' }}>
												<p
													style={{
														fontSize: '12px',
														color: '#94989e',
														margin: '0 0 12px 0',
													}}
												>
													If you've completed the authorization, click the
													button below to verify.
												</p>
												<button
													className="verify-button"
													onClick={handleManualVerification}
													disabled={verificationAttempt > 0}
												>
													{verificationAttempt > 0
														? 'Verifying...'
														: 'Verify Connection'}
												</button>
											</div>
										</div>
									)}
									{connectionError && (
										<button className="retry-button" onClick={handleRetry}>
											Try Again
										</button>
									)}
								</div>
							</div>
						)}

						{connectionStep === 3 && (
							<div className="connection-content">
								<div className="step-content">
									<h3 className="step-title">Connection Successful!</h3>
									<p className="step-description">
										Your {integration?.title} account has been successfully
										connected.
									</p>
									<div className="success-message">
										<span className="success-icon">🎉</span>
										<span className="success-text">
											You can now use {integration?.title} in your workflows
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(IntegrationConnectModel);
