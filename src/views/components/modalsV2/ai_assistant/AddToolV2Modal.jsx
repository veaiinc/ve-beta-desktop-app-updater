import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import '../../../../assets/scss/ai_assistant/modal/addToolV2.scss';
import ReactModal from '../index';
import { createFrontendClient } from '@pipedream/sdk/browser';
import Context from '../../../../context/context';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/docs/cross.svg';
import Spinner from '../../loaders/Spinner';
import { useParams } from 'react-router-dom';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/ai_assistant/search.svg';
import { ReactComponent as AddIcon } from '../../../../assets/svg/ai_assistant/add.svg';
import { message } from '../../globalComponents/CustomToast';

const AddToolV2Modal = ({ isOpen, onClose, onToolAdded }) => {
	const {
		knowledgeAgent: {
			listofAllappsActions,
			connectTool,
			addActionToKnowledgeAgent,
			getExistingconnectedAccounts,
		},
		profileInfo: { userDetailsData, getUserDetails },
		knowledgeAgent: { actionsInfo }, // for already added actions
	} = useContext(Context);
	const { agentId } = useParams();
	const [info, setInfo] = useState({
		actions: [],
		isLoading: false,
		error: null,
		search: '',
		addLoading: {}, // { [actionId]: boolean }
		addError: {}, // { [actionId]: string }
		hasNextPage: false,
		page: 1,
		perPage: 10,
		totalActions: 0,
		isConnecting: false,
		// success: null,
	});
	const searchTimeoutRef = useRef(null);
	const pageRef = useRef(1);

	// Fetch user details if not available
	useEffect(() => {
		if (!userDetailsData) getUserDetails();
	}, [userDetailsData]);

	// Fetch all actions
	const fetchActions = useCallback(
		async (page = 1, reset = false, search = '') => {
			setInfo((prev) => ({ ...prev, isLoading: true, error: null }));
			try {
				const [success, response] = await listofAllappsActions(page, info.perPage, search);
				if (success) {
					setInfo((prev) => ({
						...prev,
						actions: reset ? response.data : [...prev.actions, ...response.data],
						hasNextPage: response.hasNextPage,
						totalActions: response.totalDocs || response.totalActions || 0,
						page,
					}));
				} else {
					setInfo((prev) => ({
						...prev,
						error: response?.message || 'Failed to fetch actions',
					}));
				}
			} catch (error) {
				setInfo((prev) => ({ ...prev, error: error.message || 'Failed to fetch actions' }));
			} finally {
				setInfo((prev) => ({ ...prev, isLoading: false }));
			}
		},
		[listofAllappsActions, info.perPage],
	);

	// Initial fetch and on open
	useEffect(() => {
		if (isOpen) {
			pageRef.current = 1;
			setInfo((prev) => ({
				...prev,
				actions: [],
				page: 1,
				search: '',
				error: null,
				// success: null,
				isConnecting: false,
			}));
			fetchActions(1, true, '');
		}
	}, [isOpen]);

	// Debounced search
	const handleSearch = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({ ...prev, search: value }));
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
			if (!value.trim()) {
				pageRef.current = 1;
				setInfo((prev) => ({ ...prev, actions: [] }));
				fetchActions(1, true, '');
				return;
			}
			searchTimeoutRef.current = setTimeout(() => {
				pageRef.current = 1;
				setInfo((prev) => ({ ...prev, actions: [] }));
				fetchActions(1, true, value.trim());
			}, 400);
		},
		[fetchActions],
	);

	// Infinite scroll fetch more
	const fetchMoreActions = useCallback(() => {
		if (info.hasNextPage && !info.isLoading) {
			const nextPage = pageRef.current + 1;
			pageRef.current = nextPage;
			fetchActions(nextPage, false, info.search.trim());
		}
	}, [info.hasNextPage, info.isLoading, fetchActions, info.search]);

	// Group actions by app name
	const groupedActions = info.actions.reduce((acc, action) => {
		const appName = (action.app_name || action.app || '')
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());
		if (!acc[appName]) acc[appName] = [];
		acc[appName].push(action);
		return acc;
	}, {});

	// Get already added action keys (from actionsInfo)
	const addedActionKeys = Array.isArray(actionsInfo?.data)
		? actionsInfo.data.map((a) => a.action_key || a.key || a.id)
		: [];

	// Add tool handler with Pipedream SDK integration
	const handleAddTool = async (action) => {
		setInfo((prev) => ({
			...prev,
			addLoading: { ...prev.addLoading, [action._id]: true },
			addError: { ...prev.addError, [action._id]: undefined },
			isConnecting: true,
			error: null,
			// success: null,
		}));

		try {
			// 1. Connect tool to get connection token
			const [connectSuccess, connectRes] = await connectTool({ app: action.app });
			if (!connectSuccess || !connectRes?.data?.token) {
				throw new Error(connectRes?.message || 'Failed to get connection token');
			}

			const { token } = connectRes.data;
			const pd = createFrontendClient();

			// 2. Use Pipedream SDK to connect account
			await pd.connectAccount({
				app: action.app,
				token: token,
				onSuccess: async () => {
					setInfo((prev) => ({
						...prev,
						// success: `Connected to ${action.app_name || action.app}`,
						isConnecting: false,
					}));

					// Fetch connected accounts to get the account ID
					try {
						const tenatUserId = userDetailsData?._id;
						const accountsResponse = await getExistingconnectedAccounts({
							tenatUserId,
						});

						let accountId = null;
						if (accountsResponse?.data?.connected_accounts) {
							// Find the newly connected account for this app
							const newAccount = accountsResponse.data.connected_accounts.find(
								(account) => account.app.name_slug === action.app,
							);
							if (newAccount) {
								accountId = newAccount.id;
							}
						}

						// 3. Prepare payload for addActionToKnowledgeAgent (tool definition format)
						const name = action.name || action.key || action.id || '';
						const description = action.description || '';
						const workspaceId = localStorage.getItem('workspaceId');
						const url = `https://us.api.ve.ai/third-party-integrations/1.0/pipedream/execute-action/${workspaceId}`;
						const method = 'POST';
						const contentType = 'json';
						const headers = [{ name: 'Content-Type', value: 'application/json' }];

						// Build props with variable placeholders
						const props = {};
						const variables = [];
						(action.configurable_props || []).forEach((prop) => {
							if (prop.type === 'app') {
								// For app type, we'll use a placeholder that will be resolved later
								props[prop.name] = `{{${prop.name}}}`;
							} else {
								// Use variable placeholder
								props[prop.name] = `{{${prop.name}}}`;
								variables.push({
									name: prop.name,
									type: prop.type,
									description:
										prop.description ||
										`No description provided for ${prop.name}`,
								});
							}
						});

						// Build body as string, replacing objects with JSON
						const bodyObj = {
							action_key: action.key || action.id || '',
							app: action.app || '',
							account_id: accountId, // Use the actual account ID
							props,
						};
						let body = JSON.stringify(bodyObj);
						// Remove quotes around variable placeholders
						body = body.replace(/"{{(.*?)}}"/g, '{{$1}}');

						const payload = {
							name,
							description,
							url,
							method,
							contentType,
							body,
							headers,
							variables,
							isAuthenticated: true,
							agent: 'knowledgeAgent',
						};

						// 4. Submit action to backend
						await addActionToKnowledgeAgent(agentId, payload);

						message.success('Tool added successfully');
						setInfo((prev) => ({
							...prev,
							addLoading: { ...prev.addLoading, [action._id]: false },
							addError: { ...prev.addError, [action._id]: undefined },
						}));
						if (onToolAdded) onToolAdded();
					} catch (error) {
						console.error('Error fetching connected accounts after connection:', error);
						throw new Error('Failed to complete tool setup');
					}
				},
				onError: (err) => {
					setInfo((prev) => ({
						...prev,
						error: err.message || 'Failed to connect to the app',
						isConnecting: false,
						addLoading: { ...prev.addLoading, [action._id]: false },
						addError: {
							...prev.addError,
							[action._id]: err.message || 'Failed to connect to the app',
						},
					}));
				},
			});
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				error: error.message || 'An unexpected error occurred',
				isConnecting: false,
				addLoading: { ...prev.addLoading, [action._id]: false },
				addError: { ...prev.addError, [action._id]: error.message || 'Failed to add tool' },
			}));
		}
	};

	// Render
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
			<div className="actions-modal addtoolv2-modal">
				<div className="addtoolv2-header">
					<div className="search-container">
						<SearchIcon className="search-icon" />
						<input
							type="text"
							placeholder="Browse tools"
							value={info.search}
							onChange={handleSearch}
							className="search-input"
						/>
					</div>
					<CrossIcon onClick={onClose} className="cross-icon" />
				</div>
				<div className="actions-modal-inputs">
					{info.isLoading && info.actions.length === 0 ? (
						<div className="centered-loading">
							<Spinner width="20px" height="20px" color="var(--primary-font)" />
							<span className="centered-loading-text">Loading tools...</span>
						</div>
					) : info.error ? (
						<div className="error-message">{info.error}</div>
					) : (
						<InfiniteScroll
							dataLength={info.actions.length || 0}
							next={fetchMoreActions}
							hasMore={info.hasNextPage || false}
							loader={
								<div className="centered-loading">
									<Spinner
										width="16px"
										height="16px"
										color="var(--primary-font)"
									/>{' '}
									Loading more...
								</div>
							}
							height={535}
							style={{
								overflowY: 'auto',
								width: '100%',
							}}
						>
							<div className="grouped-app-list">
								{Object.keys(groupedActions).length === 0 ? (
									<div className="error-message centered">No tools found.</div>
								) : (
									Object.entries(groupedActions).map(
										([appName, actions], idx) => (
											<div key={appName} className="app-group">
												<div className="app-group-header">{appName}</div>
												<div className="app-group-grid">
													{actions.map((action) => {
														const isAdded = addedActionKeys.includes(
															action.key ||
																action.id ||
																action.action_key,
														);
														return (
															<div
																key={action._id}
																className="app-item-grid"
																onClick={() =>
																	handleAddTool(action)
																}
															>
																<img
																	src={action.image_src}
																	alt={action.name}
																	className="app-icon"
																/>
																<div className="app-info">
																	<span className="app-action-name">
																		{action.name}
																	</span>
																</div>
																{isAdded ? (
																	<span className="added-badge">
																		&#10003; Added
																	</span>
																) : (
																	<button
																		className="primary-button connect-button"
																		disabled={
																			!!info.addLoading[
																				action._id
																			] || info.isConnecting
																		}
																	>
																		{info.addLoading[
																			action._id
																		] ? (
																			<div className="add-button-container">
																				<Spinner
																					width="16px"
																					height="16px"
																					color="var(--primary-font)"
																				/>
																				{info.isConnecting
																					? 'Connecting...'
																					: 'Adding...'}
																			</div>
																		) : (
																			<div className="add-button-container">
																				<AddIcon className="add-icon" />
																				Add
																			</div>
																		)}
																	</button>
																)}
																{info.addError[action._id] && (
																	<div
																		className="field-error"
																		style={{
																			marginTop: 4,
																			color: 'var(--error)',
																			fontSize: '12px',
																			fontWeight: '500',
																		}}
																	>
																		{info.addError[action._id]}
																	</div>
																)}
															</div>
														);
													})}
												</div>
												{idx < Object.keys(groupedActions).length - 1 && (
													<div className="app-group-divider" />
												)}
											</div>
										),
									)
								)}
							</div>
						</InfiniteScroll>
					)}
				</div>
				{/* {info.success && (
					<div
						className="success-message"
						style={{
							marginTop: '10px',
							padding: '8px 12px',
							backgroundColor: 'var(--success-bg)',
							color: 'var(--success)',
							borderRadius: '4px',
							fontSize: '14px',
						}}
					>
						{info.success}
					</div>
				)} */}
			</div>
		</ReactModal>
	);
};

export default AddToolV2Modal;
