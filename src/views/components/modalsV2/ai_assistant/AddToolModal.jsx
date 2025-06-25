import { memo, useContext, useState, useEffect, useRef, useCallback } from 'react';
import '../../../../assets/scss/ai_assistant/modal/addTool.scss';
import ReactModal from '../index';
import { createFrontendClient } from '@pipedream/sdk/browser';
import Context from '../../../../context/context';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/docs/cross.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../loaders/Spinner';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';
import PayloadField from './PayloadField';
import { ReactComponent as Delete } from '../../../../assets/svg/delete.svg';

// Helper function to convert app name to camelCase
const toCamelCase = (str) => {
	return str
		.replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters except spaces
		.split(' ')
		.map((word, index) => {
			if (index === 0) {
				return word.charAt(0).toLowerCase() + word.slice(1); // First word: first letter lowercase, rest unchanged
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Subsequent words: capitalize first letter
		})
		.join('');
};

const AddToolModal = ({ isOpen, onClose, onToolAdded }) => {
	const {
		knowledgeAgent: {
			connectTool,
			getPipedreamApps,
			getPipedreamAppActions,
			getPipedreamActionPayload,
			addActionToKnowledgeAgent,
			getExistingconnectedAccounts,
			deleteConnectedAccount,
		},
		profileInfo: { userDetailsData, getUserDetails },
	} = useContext(Context);
	const { agentId } = useParams();
	const pageRef = useRef(1);
	const searchTimeoutRef = useRef(null);
	const isSubmittingRef = useRef(false);
	const [info, setInfo] = useState({
		step: 0, // 0: Select Account (if exists), 1: Select App, 2: Select Action, 3: Configure Payload
		selectedApp: '',
		selectedAppObj: null,
		isConnecting: false,
		error: null,
		success: null,
		apps: [],
		hasNextPage: true,
		isLoading: false,
		totalApps: 0,
		totalPages: 0,
		perPage: 10,
		searchQuery: '',
		actions: [],
		actionsLoading: false,
		totalActions: 0,
		selectedAction: '',
		selectedActionObj: null,
		actionPayloadConfig: null,
		actionPayloadValues: {},
		payloadLoading: false,
		validationErrors: {},
		isSubmitting: false,
		connectedAccounts: [],
		selectedAccount: null,
		accountsLoading: false,
		payloadMode: 'manual',
		payloadFieldModes: {}, // key: field name, value: 'ai' or 'manual'
		payloadVariableDescriptions: {}, // key: field name, value: description string
		deletingAccountId: null,
	});

	// Fetch user details if not available
	useEffect(() => {
		if (!userDetailsData) {
			getUserDetails();
		}
	}, [userDetailsData]);

	const tenatUserId = userDetailsData?._id;

	// Step 1: Fetch Apps
	const fetchApps = useCallback(
		async (page, reset = false) => {
			if (info.isLoading) return;
			setInfo((prev) => ({ ...prev, isLoading: true }));
			try {
				const [success, response] = await getPipedreamApps(
					page,
					info.perPage,
					info.searchQuery.trim(),
				);
				if (success) {
					setInfo((prev) => ({
						...prev,
						apps: reset ? response.data : [...prev.apps, ...response.data],
						hasNextPage: response.hasNextPage,
						totalApps: response.totalApps,
						totalPages: response.totalPages,
						perPage: response.perPage,
					}));
				}
			} catch (error) {
				console.error('Error fetching apps:', error);
			} finally {
				setInfo((prev) => ({ ...prev, isLoading: false }));
			}
		},
		[info.isLoading, info.perPage, info.searchQuery],
	);

	const handleSearch = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({ ...prev, searchQuery: value }));
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
			if (!value.trim()) {
				pageRef.current = 1;
				fetchApps(1, true);
				return;
			}
			searchTimeoutRef.current = setTimeout(() => {
				pageRef.current = 1;
				getPipedreamApps(1, info.perPage, value.trim()).then(([success, response]) => {
					if (success) {
						setInfo((prev) => ({
							...prev,
							apps: response.data,
							hasNextPage: response.hasNextPage,
							totalApps: response.totalApps,
							totalPages: response.totalPages,
							perPage: response.perPage,
						}));
					}
				});
			}, 300);
		},
		[info.perPage],
	);

	const fetchMoreApps = useCallback(() => {
		if (info?.hasNextPage) {
			const nextPage = pageRef.current + 1;
			pageRef.current = nextPage;
			fetchApps(nextPage, false);
		}
	}, [info?.hasNextPage, fetchApps]);

	useEffect(() => {
		if (isOpen) {
			pageRef.current = 1;
			setInfo((prev) => ({
				...prev,
				apps: [],
				searchQuery: '',
				step: 0, // Start with account selection
				actions: [],
				selectedApp: '',
				selectedAppObj: null,
				selectedAction: '',
				selectedActionObj: null,
				actionPayloadConfig: null,
				actionPayloadValues: {},
				error: null,
				success: null,
				connectedAccounts: [],
				selectedAccount: null,
				validationErrors: {}, // reset errors
				payloadVariableDescriptions: {}, // reset descriptions
			}));
			fetchConnectedAccounts();
		}
	}, [isOpen]);

	// Step 1: Select App
	const handleAppSelect = (appId) => {
		const appObj = info.apps.find((app) => app.id === appId);
		setInfo((prev) => ({
			...prev,
			selectedApp: appId,
			selectedAppObj: appObj,
			error: null,
			success: null,
		}));
	};

	const handleConnect = async () => {
		if (!info?.selectedApp) return;
		setInfo((prev) => ({
			...prev,
			isConnecting: true,
			error: null,
			success: null,
		}));
		try {
			const selectedApp = info.selectedAppObj;
			if (!selectedApp) {
				throw new Error('Selected app not found');
			}
			const [success, response] = await connectTool({ app: selectedApp.name_slug });
			if (!success || !response?.data?.token) {
				throw new Error('Failed to get connection token');
			}
			const { token } = response.data;
			const pd = createFrontendClient();
			await pd.connectAccount({
				app: selectedApp.name_slug,
				token: token,
				onSuccess: async () => {
					setInfo((prev) => ({ ...prev, success: `Connected to ${selectedApp.name}` }));

					// Fetch connected accounts to get the account ID
					try {
						const accountsResponse = await getExistingconnectedAccounts({
							tenatUserId,
						});
						if (accountsResponse?.data?.connected_accounts) {
							// Find the newly connected account for this app
							const newAccount = accountsResponse.data.connected_accounts.find(
								(account) => account.app.name_slug === selectedApp.name_slug,
							);

							if (newAccount) {
								// Set the selected account so account ID is available
								setInfo((prev) => ({
									...prev,
									selectedAccount: newAccount,
									connectedAccounts: accountsResponse.data.connected_accounts,
								}));
							}
						}
					} catch (error) {
						console.error('Error fetching connected accounts after connection:', error);
					}

					setTimeout(() => {
						fetchActionsList(selectedApp.name_slug);
					}, 1000);
				},
				onError: (err) => {
					setInfo((prev) => ({
						...prev,
						error: err.message || 'Failed to connect to the app',
					}));
				},
			});
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				error: error.message || 'An unexpected error occurred',
			}));
		} finally {
			setInfo((prev) => ({ ...prev, isConnecting: false }));
		}
	};

	// Step 2: Fetch Actions
	const fetchActionsList = async (appNameSlug) => {
		setInfo((prev) => ({
			...prev,
			actionsLoading: true,
			step: 2,
			actions: [],
			selectedAction: '',
			selectedActionObj: null,
			actionPayloadConfig: null,
			actionPayloadValues: {},
		}));
		try {
			const [success, response] = await getPipedreamAppActions(appNameSlug, 1, 20, '');
			if (success) {
				setInfo((prev) => ({
					...prev,
					actions: response.data,
					totalActions: response.totalActions,
					actionsLoading: false,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					actionsLoading: false,
					error: 'Failed to fetch actions',
				}));
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				actionsLoading: false,
				error: error.message || 'Failed to fetch actions',
			}));
		}
	};

	// Step 2: Select Action
	const handleActionSelect = async (actionId) => {
		const actionObj = info.actions.find((a) => a.id === actionId);
		setInfo((prev) => ({
			...prev,
			selectedAction: actionId,
			selectedActionObj: actionObj,
			payloadLoading: true,
			error: null,
		}));
		try {
			const [success, response] = await getPipedreamActionPayload(
				info.selectedAppObj.name_slug,
				actionId,
			);
			if (success) {
				setInfo((prev) => ({
					...prev,
					actionPayloadConfig: response.action,
					payloadLoading: false,
					step: 3,
					actionPayloadValues: {},
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					payloadLoading: false,
					error: 'Failed to fetch action payload config',
				}));
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				payloadLoading: false,
				error: error.message || 'Failed to fetch action payload config',
			}));
		}
	};

	// Validation logic
	const validatePayloadField = (prop, value) => {
		// Skip validation for hidden, app, and any type starting with $
		if (
			prop.hidden ||
			prop.type === 'app' ||
			(typeof prop.type === 'string' && prop.type.startsWith('$'))
		) {
			return null;
		}
		const mode = info.payloadFieldModes?.[prop.name] || 'ai';
		if (mode === 'ai') {
			if (!prop.optional) {
				const description = info.payloadVariableDescriptions?.[prop.name];
				if (!description || !description.trim()) {
					message.error('Please provide a description for the agent');
					return 'Please provide a description for the agent';
				}
			}
			return null;
		}
		if (
			!prop.optional &&
			(value === undefined || value === '' || (Array.isArray(value) && value.length === 0))
		) {
			return 'This field is required';
		}
		if (prop.type === 'string[]' && ['to', 'cc', 'bcc'].includes(prop.name.toLowerCase())) {
			if (Array.isArray(value)) {
				for (const email of value) {
					const err = validateEmail(email);
					if (err) return err;
				}
			}
		}
		if (
			prop.options &&
			value &&
			!prop.options.includes(value) &&
			!prop.options.find((o) => o.value === value)
		) {
			return 'Invalid selection';
		}
		return null;
	};

	const handlePayloadInput = (name, value) => {
		const prop = info.actionPayloadConfig?.configurable_props?.find((p) => p.name === name);
		const error = validatePayloadField(prop, value);
		setInfo((prev) => ({
			...prev,
			actionPayloadValues: {
				...prev.actionPayloadValues,
				[name]: value,
			},
			validationErrors: {
				...prev.validationErrors,
				[name]: error,
			},
		}));
	};

	const validateAllFields = () => {
		const errors = {};
		let hasErrors = false;
		info.actionPayloadConfig?.configurable_props?.forEach((prop) => {
			if (
				prop.hidden ||
				prop.type === 'app' ||
				(typeof prop.type === 'string' && prop.type.startsWith('$'))
			) {
				return;
			}
			const value = info.actionPayloadValues[prop.name];
			const error = validatePayloadField(prop, value);
			if (error) {
				errors[prop.name] = error;
				hasErrors = true;
			}
		});
		setInfo((prev) => ({
			...prev,
			validationErrors: errors,
		}));
		return !hasErrors;
	};

	// Handler for per-field mode change
	const handleFieldModeChange = (fieldName, mode) => {
		setInfo((prev) => ({
			...prev,
			payloadFieldModes: {
				...prev.payloadFieldModes,
				[fieldName]: mode,
			},
		}));
	};

	// Handler for variable description change
	const handleVariableDescriptionChange = (fieldName, desc) => {
		setInfo((prev) => ({
			...prev,
			payloadVariableDescriptions: {
				...prev.payloadVariableDescriptions,
				[fieldName]: desc,
			},
		}));
	};

	// Update handlePayloadSubmit to build variables array for outer payload
	const handlePayloadSubmit = async () => {
		if (isSubmittingRef.current) return; // Synchronous guard
		isSubmittingRef.current = true;
		setInfo((prev) => ({ ...prev, isSubmitting: true }));
		if (!validateAllFields()) {
			setInfo((prev) => ({ ...prev, isSubmitting: false }));
			isSubmittingRef.current = false;
			return;
		}

		try {
			const action = info.selectedActionObj;
			const app = info.selectedAppObj?.name_slug;
			const configurableProps = info.actionPayloadConfig?.configurable_props || [];
			const userValues = info.actionPayloadValues || {};
			const fieldModes = info.payloadFieldModes || {};
			const variableDescriptions = info.payloadVariableDescriptions || {};

			const props = {};
			const variables = [];
			for (const prop of configurableProps) {
				const mode = fieldModes[prop.name] || 'ai';
				let desc = variableDescriptions[prop.name];
				if (!desc || !desc.trim()) {
					// If field is optional, use prop.description from API response
					if (prop.optional && prop.description) {
						desc = prop.description;
					} else {
						desc = `No description provided for "${prop.name}"`;
					}
				}

				// Always skip double braces for 'app' and types starting with '$'
				if (typeof prop.type === 'string' && prop.type.startsWith('$')) {
					props[prop.name] = '';
					continue;
				}
				if (prop.type === 'app') {
					// For app type, we need to add the authProvisionId from the selected account
					if (info.selectedAccount) {
						props[toCamelCase(info.selectedAccount.app.name)] = {
							authProvisionId: info.selectedAccount?.id,
						};
					}
					continue;
				}

				if (mode === 'ai') {
					variables.push({
						name: prop.name,
						type: prop.type,
						description: desc,
					});
					// Use placeholder for later replacement
					props[prop.name] = `__VAR__${prop.name}__`;
				} else {
					const val = userValues[prop.name];
					if (val !== undefined && val !== null && val !== '') {
						props[prop.name] = val;
					} else {
						switch (prop.type) {
							case 'string':
								props[prop.name] = '';
								break;
							case 'string[]':
								props[prop.name] = [];
								break;
							case 'boolean':
								props[prop.name] = false;
								break;
							case 'integer':
							case 'number':
								props[prop.name] = null;
								break;
							case 'any':
							default:
								props[prop.name] = null;
						}
					}
				}
			}

			// Get the account ID from the selected account
			const accountId = info.selectedAccount?.id || null;

			// Create the output object with normal values for non-props fields
			const output = {
				action_key: action?.key || action?.id || '',
				app: app || '',
				account_id: accountId,
				props: props, // This will contain the placeholders for AI mode fields
			};

			const workspaceId = localStorage.getItem('workspaceId');
			let body = JSON.stringify(output);
			// Replace all "__VAR__variable__" (with quotes) with {{variable}} (no quotes)
			body = body.replace(/"__VAR__(.*?)__"/g, '{{$1}}');
			const payload = {
				name: action?.name || action?.id || '',
				description: action?.description || '',
				url:
					'https://us.api.ve.ai/third-party-integrations/1.0/pipedream/execute-action/' +
					workspaceId,
				method: 'POST',
				contentType: 'json',
				body,
				headers: [
					{
						name: 'Content-Type',
						value: 'application/json',
					},
				],
				variables,
				isAuthenticated: true,
				agent: 'knowledgeAgent',
			};

			const response = await addActionToKnowledgeAgent(agentId, payload);
			if (response) {
				message.success('Action added successfully');
				onToolAdded();
				onClose();
			}
		} catch (error) {
			if (error?.message) {
				message.error(error.message);
			} else {
				message.error('An unexpected error occurred');
			}
		} finally {
			setInfo((prev) => ({ ...prev, isSubmitting: false }));
			isSubmittingRef.current = false;
		}
	};

	const renderStepIndicator = () => {
		const steps = [
			{ label: 'Select Account' },
			{ label: 'Select App' },
			{ label: 'Select Action' },
			{ label: 'Configure Payload' },
		];
		return (
			<div className="step-indicator">
				{steps.map((step, idx) => (
					<div className="step" key={step.label}>
						<div className={`step-circle${info.step === idx ? ' active' : ''}`}>
							{idx + 1}
						</div>
						<div
							className={`step-label${info.step === idx ? ' active' : ''}`}
						>{`${step.label}`}</div>
					</div>
				))}
				<div className="progress-bar-segments">
					{steps.map((_, idx) => (
						<div
							key={idx}
							className={`progress-bar-segment${info.step > idx ? ' filled' : ''}`}
						/>
					))}
				</div>
			</div>
		);
	};

	// Add handler for Connect New App button
	const handleConnectNewApp = () => {
		setInfo((prev) => ({
			...prev,
			step: 1,
			isLoading: true,
			apps: [],
			searchQuery: '',
			// reset other relevant state if needed
		}));
		fetchApps(1, true); // fetch first page of apps immediately
	};

	const handleDeleteAccount = async (accountId, appName, e) => {
		if (info?.deletingAccountId === accountId) return;
		e.stopPropagation();
		setInfo((prev) => ({
			...prev,
			deletingAccountId: accountId,
		}));

		const response = await deleteConnectedAccount({
			app: appName,
			account_id: accountId,
		});

		if (response?.[0] === true) {
			message.success('Account deleted successfully');
			fetchConnectedAccounts();
		}

		setInfo((prev) => ({
			...prev,
			deletingAccountId: null,
		}));
	};

	const renderAccountStep = () => (
		<>
			<div className="actions-modal-description">
				<h2>Select Account</h2>
				<p>Choose an existing connected account or connect a new one</p>
			</div>
			{info.accountsLoading ? (
				<div className="loading">
					<Spinner width="20px" height="20px" color="var(--primary-font)" />
					<span>Loading accounts...</span>
				</div>
			) : info.connectedAccounts.length === 0 ? (
				<div className="error-message">
					No connected accounts found. Please connect a new account.
				</div>
			) : (
				<div className="account-list">
					{info.connectedAccounts.map((account) => (
						<div
							key={account.id}
							className={`account-item ${
								info.selectedAccount?.id === account.id ? 'selected' : ''
							}`}
							onClick={() => handleAccountSelect(account)}
						>
							<img
								src={account.app.img_src}
								alt={account.app.name}
								className="app-icon"
							/>
							<div className="account-info">
								<h3>{account.app.name}</h3>
								<p>{account.name}</p>
								<span className="account-date">
									Connected on {new Date(account.created_at).toLocaleDateString()}
								</span>
							</div>
							<div
								className="delete-account-button"
								onClick={(e) =>
									handleDeleteAccount(account.id, account.app.name_slug, e)
								}
								disabled={info.deletingAccountId === account.id}
							>
								{info.deletingAccountId === account.id ? (
									<Spinner
										width="16px"
										height="16px"
										color="var(--primary-font)"
									/>
								) : (
									<Delete />
								)}
							</div>
						</div>
					))}
				</div>
			)}
			<div className="actions-modal-footer">
				<button className="primary-button connect-button" onClick={handleConnectNewApp}>
					Connect New Account
				</button>
			</div>
		</>
	);

	const renderAppStep = () => (
		<>
			<div className="actions-modal-description">
				<h2>Select App</h2>
				<p>Choose an app to connect with VE.AI</p>
			</div>
			<div className="search-container">
				<input
					type="text"
					placeholder="Search apps..."
					value={info.searchQuery}
					onChange={handleSearch}
					className="search-input"
				/>
			</div>
			<div id="scrollableDiv" style={{ height: '400px', overflow: 'auto' }}>
				{info.isLoading && info.apps.length === 0 ? (
					<div className="centered-loading">
						<Spinner width="20px" height="20px" color="var(--primary-font)" />
						<span className="centered-loading-text">Loading apps...</span>
					</div>
				) : (
					<InfiniteScroll
						dataLength={info.apps.length}
						next={fetchMoreApps}
						hasMore={info.hasNextPage}
						loader={
							info.isLoading ? (
								<div className="centered-loading">
									<Spinner
										width="20px"
										height="20px"
										color="var(--primary-font)"
									/>
									<span className="bottom-loading-text">
										Loading more apps...
									</span>
								</div>
							) : null
						}
						scrollableTarget="scrollableDiv"
						endMessage={<div className="loading">No more apps to load</div>}
					>
						<div className="app-list">
							{info.apps.map((app) => (
								<div
									key={app.id}
									className={`app-item ${
										info.selectedApp === app.id ? 'selected' : ''
									}`}
									onClick={() => handleAppSelect(app.id)}
								>
									<img src={app.img_src} alt={app.name} className="app-icon" />
									<div className="app-info">
										<h3>{app.name}</h3>
										<p>{app.description}</p>
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
			{info?.error && <div className="error-message">{info?.error}</div>}
			{info?.success && <div className="success-message">{info?.success}</div>}
			<div className="actions-modal-footer">
				<button
					className="primary-button connect-button"
					onClick={handleConnect}
					disabled={!info?.selectedApp || info?.isConnecting}
				>
					{info?.isConnecting ? (
						<>
							<Spinner width="16px" height="16px" color="var(--white)" />
							<span>Connecting...</span>
						</>
					) : (
						'Connect App'
					)}
				</button>
			</div>
		</>
	);

	const renderActionStep = () => (
		<>
			<div className="actions-modal-description">
				<h2>Select Action</h2>
				<p>Choose an action to connect with {info.selectedAppObj?.name}</p>
			</div>
			{info.actionsLoading ? (
				<div className="centered-loading">
					<Spinner width="20px" height="20px" color="var(--primary-font)" />
					<span className="centered-loading-text">Loading actions...</span>
				</div>
			) : info.actions.length === 0 ? (
				<div className="error-message centered">No actions available for this app.</div>
			) : (
				<div className="action-list">
					{info.actions.map((action) => (
						<div
							key={action.id}
							className={`action-item ${
								info.selectedAction === action.id ? 'selected' : ''
							}`}
							onClick={() => handleActionSelect(action.id)}
						>
							<div className="action-info">
								<h3>{action.name}</h3>
								<p>{action.description}</p>
							</div>
						</div>
					))}
				</div>
			)}
			{info?.error && <div className="error-message">{info?.error}</div>}
		</>
	);

	const renderPayloadStep = () => {
		return (
			<>
				<div className="actions-modal-description">
					<h2>Configure Action</h2>
					<p>{info.actionPayloadConfig?.description}</p>
				</div>
				{info.payloadLoading ? (
					<div className="loading">
						<Spinner width="20px" height="20px" color="var(--primary-font)" />
						<span>Loading configuration...</span>
					</div>
				) : (
					<div className="form-container">
						{info.actionPayloadConfig?.configurable_props?.map((prop) => (
							<PayloadField
								key={prop.name}
								prop={prop}
								value={info.actionPayloadValues[prop.name]}
								error={info.validationErrors[prop.name]}
								setValue={(v) => handlePayloadInput(prop.name, v)}
								mode={info.payloadFieldModes[prop.name] || 'ai'}
								onModeChange={handleFieldModeChange}
								variableDescription={info.payloadVariableDescriptions[prop.name]}
								onVariableDescriptionChange={handleVariableDescriptionChange}
							/>
						))}
					</div>
				)}
				<div className="actions-modal-footer">
					<button
						type="button"
						className="primary-button connect-button"
						onClick={handlePayloadSubmit}
						disabled={info.payloadLoading || info.isSubmitting}
					>
						{info.isSubmitting ? (
							<>
								<Spinner width="16px" height="16px" color="var(--primary-font)" />
								<span>Submitting...</span>
							</>
						) : (
							'Submit'
						)}
					</button>
				</div>
			</>
		);
	};

	// Add new function to fetch connected accounts
	const fetchConnectedAccounts = async () => {
		setInfo((prev) => ({ ...prev, accountsLoading: true }));
		try {
			const response = await getExistingconnectedAccounts({ tenatUserId });
			if (response?.data?.connected_accounts) {
				const hasAccounts = response.data.connected_accounts.length > 0;
				setInfo((prev) => ({
					...prev,
					connectedAccounts: response.data.connected_accounts,
					step: hasAccounts ? 0 : 1,
				}));
				if (!hasAccounts) {
					fetchApps(1, true); // fetch the app list if no accounts
				}
			} else {
				setInfo((prev) => ({ ...prev, step: 1 }));
				fetchApps(1, true); // fetch the app list if no accounts
			}
		} catch (error) {
			console.error('Error fetching connected accounts:', error);
			setInfo((prev) => ({ ...prev, step: 1 }));
			fetchApps(1, true); // fetch the app list if error
		} finally {
			setInfo((prev) => ({ ...prev, accountsLoading: false }));
		}
	};

	// Update handleAccountSelect to ensure we're storing the full account object
	const handleAccountSelect = async (account) => {
		setInfo((prev) => ({
			...prev,
			selectedAccount: account,
			selectedAppObj: account.app,
			selectedApp: account.app.id || account.app.name_slug,
			step: 2, // Go directly to action selection
			isLoading: true,
			actionsLoading: true, // set loading true immediately
			actions: [],
			selectedAction: '',
			selectedActionObj: null,
			actionPayloadConfig: null,
			actionPayloadValues: {},
			error: null,
			success: null,
		}));

		// Fetch actions for the selected app
		try {
			const [success, response] = await getPipedreamAppActions(
				account.app.name_slug,
				1,
				20,
				'',
			);
			if (success) {
				setInfo((prev) => ({
					...prev,
					actions: response.data,
					totalActions: response.totalActions,
					actionsLoading: false,
					isLoading: false,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					actionsLoading: false,
					isLoading: false,
					error: 'Failed to fetch actions',
				}));
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				actionsLoading: false,
				isLoading: false,
				error: error.message || 'Failed to fetch actions',
			}));
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="actions-modal">
				<div className="actions-modal-header">
					{renderStepIndicator()}
					<CrossIcon onClick={onClose} className="cross-icon" />
				</div>
				<div className="actions-modal-inputs">
					{info.step === 0 && renderAccountStep()}
					{info.step === 1 && renderAppStep()}
					{info.step === 2 && renderActionStep()}
					{info.step === 3 && renderPayloadStep()}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AddToolModal);
