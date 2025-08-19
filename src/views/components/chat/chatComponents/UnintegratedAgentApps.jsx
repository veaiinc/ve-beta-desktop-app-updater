import { memo, useContext, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.module.scss';
import { createFrontendClient } from '@pipedream/sdk/browser';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as CircleTick } from '../../../../assets/svg/circleTick.svg';
import ListConnectModal from '../../agents/agentDetails/configureAgent/tabs/triggersTab/modals/ListConnectModal';

const UnintegratedAgentApps = ({ apps = [] }) => {
	const {
		templates: { updateStateValues },
		knowledgeAgent: { connectTool },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
		selectedIndex: null,
		connectedTools: {},
		showApiKeyModal: false,
		selectedAppForApiKey: null,
		apiKeyModalLoading: false,
	});

	const handleAddTool = async (appData, index) => {
		if (info?.loading) return;

		// Check requires_auth and primary_auth_scheme to determine the flow
		const requiresAuth = appData?.requires_auth;
		const primaryAuthScheme = appData?.primary_auth_scheme;

		// Check if we have auth_schemes data
		// const authSchemes = appData?.auth_schemes;
		// const firstAuthScheme = authSchemes && authSchemes.length > 0 ? authSchemes[0] : null;

		if (requiresAuth === true && primaryAuthScheme === 'OAUTH2') {
			// OAuth flow - make API call to get OAuth URL
			setInfo((prev) => ({
				...prev,
				loading: true,
				selectedIndex: index,
			}));

			try {
				const [connectSuccess, response] = await connectTool({
					slug: appData.app,
					auth_scheme: 'OAUTH2',
				});

				if (connectSuccess && response?.data?.oauth_url) {
					// OAuth flow - open URL in new tab
					window.open(response.data.oauth_url, '_blank');
					message.success('App connected successfully');
					updateStateValues({ activeInputForChat: 'I have integrated, please proceed' });
					setInfo((prev) => ({
						...prev,
						connectedTools: {
							...prev?.connectedTools,
							[index]: true,
						},
					}));
				} else {
					// OAuth failed, show API key modal as fallback
					setInfo((prev) => ({
						...prev,
						showApiKeyModal: true,
						selectedAppForApiKey: { app: appData.app, index, appData },
					}));
				}
			} catch (error) {
				console.error('OAuth connection error:', error);
				// OAuth failed, show API key modal as fallback
				setInfo((prev) => ({
					...prev,
					showApiKeyModal: true,
					selectedAppForApiKey: { app: appData.app, index, appData },
				}));
			} finally {
				setInfo((prev) => ({
					...prev,
					loading: false,
					selectedIndex: null,
				}));
			}
		} else {
			// Show API key modal for other cases (API_KEY, BEARER_TOKEN, etc.)
			setInfo((prev) => ({
				...prev,
				showApiKeyModal: true,
				selectedAppForApiKey: { app: appData.app, index, appData },
			}));
		}
	};

	// Handle API key submission
	const handleApiKeySubmit = async (payload) => {
		setInfo((prev) => ({
			...prev,
			apiKeyModalLoading: true,
		}));

		try {
			const { index } = info.selectedAppForApiKey;

			// // Prepare payload based on whether it's WhatsApp or other tools
			// let payload = { slug: app };

			// if (action?.toolkit?.slug === 'whatsapp' && typeof apiKeyData === 'object') {
			// 	// For WhatsApp, apiKeyData is an object with multiple fields
			// 	payload = {
			// 		...payload,
			// 		...apiKeyData,
			// 	};
			// } else {
			// 	// For other tools, apiKeyData is just the API key string
			// 	payload.apiKey = apiKeyData;
			// }

			// Connect tool with payload
			const [connectSuccess, connectResponse] = await connectTool(payload);

			if (connectSuccess) {
				// Check for OAuth URL first
				if (connectResponse?.data?.oauth_url) {
					// If API key submission returns OAuth URL, open it
					window.open(connectResponse.data.oauth_url, '_blank');
				}

				// Success case - close modal and update state
				message.success('App connected successfully');
				updateStateValues({ activeInputForChat: 'I have integrated, please proceed' });
				setInfo((prev) => ({
					...prev,
					connectedTools: {
						...prev?.connectedTools,
						[index]: true,
					},
					showApiKeyModal: false,
					selectedAppForApiKey: null,
					apiKeyModalLoading: false,
				}));
			} else {
				throw new Error(connectResponse?.message || 'Failed to connect tool with API key');
			}
		} catch (error) {
			console.error('API key submission error:', error);
			setInfo((prev) => ({
				...prev,
				apiKeyModalLoading: false,
			}));
			return Promise.reject(error);
		}
	};

	// Handle API key modal close
	const handleApiKeyModalClose = () => {
		setInfo((prev) => ({
			...prev,
			showApiKeyModal: false,
			selectedAppForApiKey: null,
			apiKeyModalLoading: false,
		}));
	};

	return (
		<div>
			<div className={s.unintegratedAgentAppsContainer}>
				<div className={s.text}>Connect these tools</div>
				<div className={s.appsContainer}>
					{apps?.map((app, index) => (
						<div className={s.appContainer} key={index}>
							<img src={app?.image_url} alt={app?.app} className={s.appIcon} />
							<div className={s.title}>{app?.app || ''}</div>
							{info?.connectedTools[index] && <CircleTick />}
							{!info?.connectedTools[index] && (
								<button
									className={s.connectBtn}
									onClick={() => handleAddTool(app, index)}
								>
									Connect
									{info?.loading && info?.selectedIndex === index && (
										<Spinner width={'12px'} height={'12px'} />
									)}
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			{/* API Key Modal */}
			<ListConnectModal
				isOpen={info.showApiKeyModal}
				onClose={handleApiKeyModalClose}
				action={
					info.selectedAppForApiKey
						? {
								toolkit: {
									slug: info.selectedAppForApiKey.app,
									name:
										info.selectedAppForApiKey.appData?.app ||
										info.selectedAppForApiKey.app,
									logo: info.selectedAppForApiKey.appData?.image_url || '',
									auth_scheme:
										info.selectedAppForApiKey.appData?.primary_auth_scheme ||
										'API_KEY',
									auth_schemes:
										info.selectedAppForApiKey.appData?.auth_schemes || [],
								},
						  }
						: null
				}
				onApiKeySubmit={handleApiKeySubmit}
				isLoading={info.apiKeyModalLoading}
			/>
		</div>
	);
};

export default memo(UnintegratedAgentApps);
