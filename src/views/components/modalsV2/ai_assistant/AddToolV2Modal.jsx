import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import '../../../../assets/scss/ai_assistant/modal/addToolV2.scss';
import '../../../../assets/scss/ai_assistant/modal/apiKeyModal.scss';
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/docs/cross.svg';
import Spinner from '../../loaders/Spinner';
import { useParams } from 'react-router-dom';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/ai_assistant/search.svg';
import { ReactComponent as AddIcon } from '../../../../assets/svg/ai_assistant/add.svg';
import { message } from '../../globalComponents/CustomToast';
import ListConnectModal from '../../agents/agentDetails/configureAgent/tabs/triggersTab/modals/ListConnectModal';

// AddToolV2Modal component for adding tools to a knowledge agent
const AddToolV2Modal = ({ isOpen, onClose, onToolAdded }) => {
	const {
		knowledgeAgent: {
			listofAllappsActions,
			connectTool,
			addActionToKnowledgeAgent,
			getComposioConnectedAccounts,
		},
		profileInfo: { userDetailsData, getUserDetails, tennantSettingsData },
		knowledgeAgent: { actionsInfo },
	} = useContext(Context);

	const { agentId } = useParams();

	// State to manage modal data and UI states
	const [info, setInfo] = useState({
		actions: [],
		isLoading: false,
		error: null,
		search: '',
		addLoading: {},
		addError: {},
		hasNextPage: false,
		page: 1,
		perPage: 10,
		totalActions: 0,
		isConnecting: false,
		connectedAccounts: [],
		accountsLoading: false,
		checkingAccounts: false,
		showApiKeyModal: false,
		selectedActionForApiKey: null,
		apiKeyModalLoading: false,
	});

	const searchTimeoutRef = useRef(null);
	const pageRef = useRef(1);

	// Fetch user details if not present
	useEffect(() => {
		if (!userDetailsData) getUserDetails();
	}, [userDetailsData, getUserDetails]);

	// Fetch actions from API
	const fetchActions = useCallback(
		async (page = 1, reset = false, search = '') => {
			setInfo((prev) => ({ ...prev, isLoading: true, error: null }));
			try {
				const [success, response] = await listofAllappsActions(page, info.perPage, search);
				if (success && response?.data) {
					const actionsData = Array.isArray(response.data.items)
						? response.data.items
						: [];
					setInfo((prev) => ({
						...prev,
						actions: reset
							? actionsData
							: [
									...(Array.isArray(prev.actions) ? prev.actions : []),
									...actionsData,
							  ],
						hasNextPage: response?.hasNextPage || false,
						totalActions: response?.totalDocs || response?.totalActions || 0,
						page,
					}));
				} else {
					setInfo((prev) => ({
						...prev,
						error: response?.message || 'Failed to fetch actions',
					}));
				}
			} catch (error) {
				console.error('fetchActions error:', error);
				setInfo((prev) => ({ ...prev, error: error.message || 'Failed to fetch actions' }));
			} finally {
				setInfo((prev) => ({ ...prev, isLoading: false }));
			}
		},
		[listofAllappsActions, info.perPage],
	);

	// Reset and fetch accounts when modal opens
	useEffect(() => {
		if (isOpen) {
			pageRef.current = 1;
			setInfo((prev) => ({
				...prev,
				actions: [],
				page: 1,
				search: '',
				error: null,
				isConnecting: false,
				connectedAccounts: [],
				checkingAccounts: true,
				showApiKeyModal: false,
				selectedActionForApiKey: null,
				apiKeyModalLoading: false,
			}));
			fetchConnectedAccounts();
		}
	}, [isOpen]);

	// Handle search input with debouncing
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

	// Fetch more actions for infinite scroll
	const fetchMoreActions = useCallback(() => {
		if (info.hasNextPage && !info.isLoading) {
			const nextPage = pageRef.current + 1;
			pageRef.current = nextPage;
			fetchActions(nextPage, false, info.search.trim());
		}
	}, [info.hasNextPage, info.isLoading, fetchActions, info.search]);

	// Group actions by app name
	const groupedActions = (Array.isArray(info.actions) ? info.actions : []).reduce(
		(acc, action) => {
			if (!action?.toolkit?.name) {
				console.warn('Action missing toolkit name:', action);
				return acc;
			}
			const appName = action.toolkit.name
				.replace(/_/g, ' ')
				.replace(/\b\w/g, (l) => l.toUpperCase());
			if (!acc[appName]) acc[appName] = [];
			acc[appName].push(action);
			return acc;
		},
		{},
	);

	// List of added action keys
	const addedActionKeys = Array.isArray(actionsInfo?.data)
		? actionsInfo.data.map((a) => a.action_key || a.key || a.id)
		: [];

	// Fetch connected accounts
	const fetchConnectedAccounts = async () => {
		setInfo((prev) => ({ ...prev, accountsLoading: true }));
		try {
			const [success, response] = await getComposioConnectedAccounts();
			if (success && Array.isArray(response?.data?.connected_accounts)) {
				setInfo((prev) => ({
					...prev,
					connectedAccounts: response.data.connected_accounts,
				}));
			} else {
				console.warn('No connected accounts found or invalid response:', response);
			}
		} catch (error) {
			console.error('Error fetching connected accounts:', error);
			setInfo((prev) => ({ ...prev, error: error.message || 'Failed to fetch accounts' }));
		} finally {
			setInfo((prev) => ({ ...prev, accountsLoading: false, checkingAccounts: false }));
			fetchActions(1, true, '');
		}
	};

	// Handle adding a tool
	const handleAddTool = async (action) => {
		if (!action?.toolkit?.slug) {
			message.error('Invalid tool data');
			return;
		}

		setInfo((prev) => ({
			...prev,
			addLoading: { ...prev.addLoading, [action.slug]: true },
			addError: { ...prev.addError, [action.slug]: undefined },
			isConnecting: true,
			error: null,
		}));

		try {
			const existingAccount = (
				Array.isArray(info.connectedAccounts) ? info.connectedAccounts : []
			).find((account) => account.app?.name_slug === action.toolkit.slug);

			if (existingAccount) {
				// Account is already connected, proceed with adding the tool
				await handleCreateAction(action, existingAccount.id);
			} else if (action.auth_type === 'api_key') {
				setInfo((prev) => ({
					...prev,
					showApiKeyModal: true,
					selectedActionForApiKey: action,
					addLoading: { ...prev.addLoading, [action.slug]: false },
					isConnecting: false,
				}));
			} else if (action.auth_type === 'oauth') {
				const [connectSuccess, response] = await connectTool({
					slug: action.toolkit.slug,
				});
				if (connectSuccess && response?.data?.oauth_url) {
					window.open(response.data.oauth_url, '_blank');
					// Note: handleCreateAction should be called after OAuth flow completion
					// You may need to handle OAuth callback separately
					setInfo((prev) => ({
						...prev,
						addLoading: { ...prev.addLoading, [action.slug]: false },
						isConnecting: false,
					}));
				} else {
					throw new Error('Failed to initiate OAuth connection');
				}
			} else {
				throw new Error('Unsupported authentication type');
			}
		} catch (error) {
			console.error('handleAddTool error:', error);
			setInfo((prev) => ({
				...prev,
				addLoading: { ...prev.addLoading, [action.slug]: false },
				addError: {
					...prev.addError,
					[action.slug]: error.message || 'Failed to add tool',
				},
				isConnecting: false,
			}));
			message.error(error.message || 'Failed to add tool');
		}
	};

	// Create and add action to knowledge agent
	const handleCreateAction = async (action, accountId, skipLoadingState = false) => {
		try {
			if (!skipLoadingState) {
				setInfo((prev) => ({
					...prev,
					addLoading: { ...prev.addLoading, [action.slug]: true },
					addError: { ...prev.addError, [action.slug]: undefined },
					isConnecting: true,
					error: null,
				}));
			}

			const name = action.name || action.slug || 'Unnamed Action';
			const description = action.description || '';
			const tenantId = tennantSettingsData?._id;
			const tenantUserId = userDetailsData?._id;

			if (!tenantId || !tenantUserId) {
				throw new Error('Missing tenant or user information');
			}

			const userId = `${tenantId}_${tenantUserId}`;
			const variables = action.input_parameters?.properties || {};

			const payload = {
				name,
				description,
				variables,
				isAuthenticated: true,
				agent: 'knowledgeAgent',
				userId,
				key: action.toolkit.slug,
				platform: 'composio',
				logoUrl: action.toolkit.logo || '',
				accountId,
			};

			const [success, response] = await addActionToKnowledgeAgent(agentId, payload);
			if (success) {
				message.success('Tool added successfully');
				if (onToolAdded) onToolAdded();
				onClose();
			} else {
				throw new Error(response?.message || 'Failed to add tool');
			}
		} catch (error) {
			console.error('handleCreateAction error:', error);
			if (!skipLoadingState) {
				setInfo((prev) => ({
					...prev,
					error: error.message || 'An unexpected error occurred',
					isConnecting: false,
					addLoading: { ...prev.addLoading, [action.slug]: false },
					addError: {
						...prev.addError,
						[action.slug]: error.message || 'Failed to add tool',
					},
				}));
			}
			message.error(error.message || 'Failed to add tool');
			throw error;
		}
	};

	// Handle API key submission
	const handleApiKeySubmit = async (apiKey, action) => {
		setInfo((prev) => ({
			...prev,
			apiKeyModalLoading: true,
		}));

		try {
			// First, connect the tool with API key
			const [connectSuccess, connectResponse] = await connectTool({
				slug: action.toolkit.slug,
				apiKey: apiKey,
			});

			if (connectSuccess && connectResponse?.data?.account_id) {
				// Tool connected successfully, now add it to the knowledge agent
				await handleCreateAction(action, connectResponse.data.account_id, true);

				// Close the API key modal
				setInfo((prev) => ({
					...prev,
					showApiKeyModal: false,
					selectedActionForApiKey: null,
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
			// Don't throw the error, let the ListConnectModal handle it
			return Promise.reject(error);
		}
	};

	// Handle API key modal close
	const handleApiKeyModalClose = () => {
		setInfo((prev) => ({
			...prev,
			showApiKeyModal: false,
			selectedActionForApiKey: null,
			apiKeyModalLoading: false,
		}));
	};

	return (
		<div className="add-tool-v2-modal-container">
			<ReactModal
				isOpen={isOpen}
				closeModal={onClose}
				modalType="center"
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
						{info.checkingAccounts ? (
							<div className="centered-loading">
								<Spinner width="20px" height="20px" color="var(--primary-font)" />
								<span className="centered-loading-text">
									Checking existing accounts...
								</span>
							</div>
						) : info.isLoading && info.actions.length === 0 ? (
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
								hasMore={info.hasNextPage}
								loader={
									<div className="centered-loading">
										<Spinner
											width="16px"
											height="16px"
											color="var(--primary-font)"
										/>
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
										<div className="error-message centered">
											No tools found.
										</div>
									) : (
										Object.entries(groupedActions).map(
											([appName, actions], idx) => (
												<div key={appName} className="app-group">
													<div className="app-group-header">
														{appName}
													</div>
													<div className="app-group-grid">
														{actions.map((action) => {
															const isAdded =
																addedActionKeys.includes(
																	action.toolkit.slug,
																);
															return (
																<div
																	key={action.slug}
																	className="app-item-grid"
																	onClick={() =>
																		handleAddTool(action)
																	}
																>
																	<img
																		src={
																			action.toolkit.logo ||
																			''
																		}
																		alt={action.name || 'Tool'}
																		className="app-icon"
																	/>
																	<div className="app-info">
																		<span className="app-action-name">
																			{action.name ||
																				'Unnamed'}
																		</span>
																	</div>
																	{isAdded ? (
																		<span className="added-badge">
																			✓ Added
																		</span>
																	) : (
																		<button
																			className="primary-button connect-button"
																			disabled={
																				!!info.addLoading[
																					action.slug
																				] ||
																				info.isConnecting
																			}
																		>
																			{info.addLoading[
																				action.slug
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
																	{info.addError[action.slug] && (
																		<div
																			className="field-error"
																			style={{
																				marginTop: 4,
																				color: 'var(--error)',
																				fontSize: '12px',
																				fontWeight: '500',
																			}}
																		>
																			{
																				info.addError[
																					action.slug
																				]
																			}
																		</div>
																	)}
																</div>
															);
														})}
													</div>
													{idx <
														Object.keys(groupedActions).length - 1 && (
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
				</div>
			</ReactModal>

			{/* API Key Modal */}
			<ListConnectModal
				isOpen={info.showApiKeyModal}
				onClose={handleApiKeyModalClose}
				action={info.selectedActionForApiKey}
				onApiKeySubmit={handleApiKeySubmit}
				isLoading={info.apiKeyModalLoading}
			/>
		</div>
	);
};

export default AddToolV2Modal;
