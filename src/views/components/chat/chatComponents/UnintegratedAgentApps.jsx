import { memo, useCallback } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.module.scss';

const UnintegratedAgentApps = ({ apps = ['google', 'slack'] }) => {
	const handleAppClick = useCallback((app) => {}, []);

	// const handleAddTool = async (app) => {
	// 	try {
	// 		// 1. Connect tool to get connection token
	// 		const [connectSuccess, connectRes] = await connectTool({ app: app });
	// 		if (!connectSuccess || !connectRes?.data?.token) {
	// 			throw new Error(connectRes?.message || 'Failed to get connection token');
	// 		}

	// 		const { token } = connectRes.data;
	// 		const pd = createFrontendClient();

	// 		// 2. Use Pipedream SDK to connect account
	// 		await pd.connectAccount({
	// 			app: app,
	// 			token: token,
	// 			onSuccess: async () => {
	// 				setInfo((prev) => ({
	// 					...prev,
	// 					// success: `Connected to ${action.app_name || action.app}`,
	// 					isConnecting: false,
	// 				}));

	// 				// Fetch connected accounts to get the account ID
	// 				try {
	// 					const tenatUserId = userDetailsData?._id;
	// 					const accountsResponse = await getExistingconnectedAccounts({
	// 						tenatUserId,
	// 					});

	// 					let accountId = null;
	// 					if (accountsResponse?.data?.connected_accounts) {
	// 						// Find the newly connected account for this app
	// 						const newAccount = accountsResponse.data.connected_accounts.find(
	// 							(account) => account.app.name_slug === app,
	// 						);
	// 						if (newAccount) {
	// 							accountId = newAccount.id;
	// 						}
	// 					}

	// 					// 3. Prepare payload for addActionToKnowledgeAgent (tool definition format)
	// 					const name = action.name || action.key || action.id || '';
	// 					const description = action.description || '';
	// 					const workspaceId = localStorage.getItem('workspaceId');
	// 					const url = `https://us.api.ve.ai/third-party-integrations/1.0/pipedream/execute-action/${workspaceId}`;
	// 					const method = 'POST';
	// 					const contentType = 'json';
	// 					const headers = [{ name: 'Content-Type', value: 'application/json' }];

	// 					// Build props with variable placeholders
	// 					const props = {};
	// 					const variables = [];
	// 					(action.configurable_props || []).forEach((prop) => {
	// 						if (prop.type === 'app') {
	// 							// For app type, we'll use a placeholder that will be resolved later
	// 							props[prop.name] = `{{${prop.name}}}`;
	// 						} else {
	// 							// Use variable placeholder
	// 							props[prop.name] = `{{${prop.name}}}`;
	// 							variables.push({
	// 								name: prop.name,
	// 								type: prop.type,
	// 								description:
	// 									prop.description ||
	// 									`No description provided for ${prop.name}`,
	// 							});
	// 						}
	// 					});

	// 					// Build body as string, replacing objects with JSON
	// 					const bodyObj = {
	// 						action_key: action.key || action.id || '',
	// 						app: action.app || '',
	// 						account_id: accountId, // Use the actual account ID
	// 						props,
	// 					};
	// 					let body = JSON.stringify(bodyObj);
	// 					// Remove quotes around variable placeholders
	// 					body = body.replace(/"{{(.*?)}}"/g, '{{$1}}');

	// 					const payload = {
	// 						name,
	// 						description,
	// 						url,
	// 						method,
	// 						contentType,
	// 						body,
	// 						headers,
	// 						variables,
	// 						isAuthenticated: true,
	// 						agent: 'knowledgeAgent',
	// 					};

	// 					// 4. Submit action to backend
	// 					await addActionToKnowledgeAgent(agentId, payload);

	// 					message.success('Tool added successfully');
	// 					setInfo((prev) => ({
	// 						...prev,
	// 						addLoading: { ...prev.addLoading, [action._id]: false },
	// 						addError: { ...prev.addError, [action._id]: undefined },
	// 					}));
	// 					// onClose();
	// 				} catch (error) {
	// 					console.error('Error fetching connected accounts after connection:', error);
	// 					throw new Error('Failed to complete tool setup');
	// 				}
	// 			},
	// 			onError: (err) => {
	// 				setInfo((prev) => ({
	// 					...prev,
	// 					error: err.message || 'Failed to connect to the app',
	// 					isConnecting: false,
	// 					addLoading: { ...prev.addLoading, [action._id]: false },
	// 					addError: {
	// 						...prev.addError,
	// 						[action._id]: err.message || 'Failed to connect to the app',
	// 					},
	// 				}));
	// 			},
	// 		});
	// 	} catch (error) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			error: error.message || 'An unexpected error occurred',
	// 			isConnecting: false,
	// 			addLoading: { ...prev.addLoading, [action._id]: false },
	// 			addError: { ...prev.addError, [action._id]: error.message || 'Failed to add tool' },
	// 		}));
	// 	}
	// };
	return (
		<div className={s.unintegratedAgentAppsContainer}>
			<div className={s.text}>Connect these tools</div>
			<div className={s.appsContainer}>
				{apps?.map((app, index) => (
					<div className={s.appContainer} key={index} onClick={() => handleAppClick(app)}>
						{app || ''}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(UnintegratedAgentApps);
