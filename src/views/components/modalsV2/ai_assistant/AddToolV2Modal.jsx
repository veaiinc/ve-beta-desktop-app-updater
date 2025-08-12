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
		selectedCategory: 'all',
		selectedUseCase: null,
		selectedApp: null,
	});

	const searchTimeoutRef = useRef(null);
	const pageRef = useRef(1);

	// Categories for left panel
	const categories = [
		{ id: 'all', name: 'All tools', active: true },
		// { id: 'premium', name: 'Premium' },
		// { id: 'trending', name: 'Trending' },
		// { id: 'your-tools', name: 'Your tools' },
	];
	// Generate apps list dynamically from the actual actions data
	const generateAppsFromActions = (actions) => {
		const appMap = new Map();

		actions.forEach((action) => {
			if (action.toolkit?.name && action.toolkit?.slug) {
				const appName = action.toolkit.name
					.replace(/_/g, ' ')
					.replace(/\b\w/g, (l) => l.toUpperCase());

				if (!appMap.has(action.toolkit.slug)) {
					appMap.set(action.toolkit.slug, {
						name: appName,
						icon: '🔧', // Default icon
						slug: action.toolkit.slug,
						logo: action.toolkit.logo,
					});
				}
			}
		});

		return Array.from(appMap.values());
	};

	// Get apps list from actions data
	const availableApps = generateAppsFromActions(info.actions);

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
				selectedCategory: 'all',
				selectedUseCase: null,
				selectedApp: null,
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

	// Handle category selection
	const handleCategorySelect = (categoryId) => {
		setInfo((prev) => ({ ...prev, selectedCategory: categoryId }));
		// Reset filters when changing category
		setInfo((prev) => ({
			...prev,
			selectedUseCase: null,
			selectedApp: null,
		}));
	};

	// Handle use case selection
	const handleUseCaseSelect = (useCase) => {
		setInfo((prev) => ({
			...prev,
			selectedUseCase: prev.selectedUseCase === useCase ? null : useCase,
		}));
	};

	// Handle app selection
	const handleAppSelect = (app) => {
		setInfo((prev) => ({
			...prev,
			selectedApp: prev.selectedApp?.slug === app.slug ? null : app,
		}));
	};

	// Fetch more actions for infinite scroll
	const fetchMoreActions = useCallback(() => {
		if (info.hasNextPage && !info.isLoading) {
			const nextPage = pageRef.current + 1;
			pageRef.current = nextPage;
			fetchActions(nextPage, false, info.search.trim());
		}
	}, [info.hasNextPage, info.isLoading, fetchActions, info.search]);

	// Filter actions based on selected filters
	const filteredActions = (Array.isArray(info.actions) ? info.actions : []).filter((action) => {
		

		// Filter by app if selected
		if (info.selectedApp && action.toolkit?.slug !== info.selectedApp.slug) {
			return false;
		}

		// Filter by use case (this would need to be implemented based on your data structure)
		if (info.selectedUseCase) {
			// Add logic to filter by use case based on your data structure
			// For now, we'll skip this filter
		}

		return true;
	});
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
			} else if (action.requires_auth === true && action.primary_auth_scheme === 'OAUTH2') {
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
				setInfo((prev) => ({
					...prev,
					showApiKeyModal: true,
					selectedActionForApiKey: action,
					addLoading: { ...prev.addLoading, [action.slug]: false },
					isConnecting: false,
				}));
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
				isAuthenticated: accountId !== null,
				agent: 'knowledgeAgent',
				app: action.toolkit.slug,
				key: action.slug,
				platform: 'composio',
				logoUrl: action.toolkit.logo || '',
				userId,
			};

			// Only include accountId if it's not null
			if (accountId !== null) {
				payload.accountId = accountId;
			}

			const response = await addActionToKnowledgeAgent(agentId, payload);

			if (response?.[0] === true) {
				message?.success('Tool added successfully');
				if (onToolAdded) onToolAdded();
				onClose();
			} else {
				throw new Error(response?.[1]?.message || 'Failed to add tool');
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
	const handleApiKeySubmit = async (apiKeyData, action) => {
		setInfo((prev) => ({
			...prev,
			apiKeyModalLoading: true,
		}));

		try {
			// Prepare payload based on whether it's WhatsApp or other tools
			let payload = { slug: action.toolkit.slug };

			if (action?.toolkit?.slug === 'whatsapp' && typeof apiKeyData === 'object') {
				// For WhatsApp, apiKeyData is an object with multiple fields
				payload = {
					...payload,
					...apiKeyData,
				};
			} else {
				// For other tools, apiKeyData is just the API key string
				payload.apiKey = apiKeyData;
			}

			// First, connect the tool with API key
			const [connectSuccess, connectResponse] = await connectTool(payload);

			if (connectSuccess) {
				// Get the account ID from the response
				const accountId =
					connectResponse?.data?.account_id ||
					connectResponse?.data?.connected_account_id ||
					connectResponse?.data?.auth_config_id;

				if (accountId) {
					// Tool connected successfully, now add it to the knowledge agent
					await handleCreateAction(action, accountId, true);

					// Close the API key modal and clear inputs
					setInfo((prev) => ({
						...prev,
						showApiKeyModal: false,
						selectedActionForApiKey: null,
						apiKeyModalLoading: false,
					}));
				} else {
					throw new Error('No account ID found in response');
				}
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
					<div className="modal-content">
						{/* Left Panel - Navigation and Filters */}
						<div className="left-panel">
							{/* Search Bar - Only in left panel */}
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
							<div className="divider"></div>

							{/* Tools Categories */}
							<div className="filter-section">
								<h3 className="filter-title">Tools</h3>
								<div className="filter-options">
									{categories.map((category) => (
										<button
											key={category.id}
											className={`filter-option ${
												info.selectedCategory === category.id
													? 'active'
													: ''
											}`}
											onClick={() => handleCategorySelect(category.id)}
										>
											{category.name}
										</button>
									))}
								</div>
							</div>

							{/* Use Cases */}
							{/* <div className="filter-section">
								<h3 className="filter-title">By use case</h3>
								<div className="filter-options">
									{useCases.map((useCase) => (
										<button
											key={useCase}
											className={`filter-option ${
												info.selectedUseCase === useCase ? 'active' : ''
											}`}
											onClick={() => handleUseCaseSelect(useCase)}
										>
											{useCase}
										</button>
									))}
								</div>
							</div> */}

							{/* Apps */}
							<div className="filter-section">
								<h3 className="filter-title">By apps</h3>
								<div className="filter-options apps-filter-options">
									{availableApps.length > 0 ? (
										availableApps.map((app) => (
											<button
												key={app.slug}
												className={`filter-option app-option ${
													info.selectedApp?.slug === app.slug
														? 'active'
														: ''
												}`}
												onClick={() => handleAppSelect(app)}
											>
												{app.logo ? (
													<img
														src={app.logo}
														alt={app.name}
														className="app-icon-small"
													/>
												) : (
													<span className="app-icon-text">
														{app.icon}
													</span>
												)}
												{app.name}
											</button>
										))
									) : (
										<div className="no-apps-message">No apps available</div>
									)}
								</div>
							</div>
						</div>

						{/* Right Panel - Tools Grid */}
						<div className="right-panel">
							{/* <div className="right-panel-header">
								<CrossIcon onClick={onClose} className="cross-icon" />
							</div> */}

							<div className="tools-header">
								<h2 className="tools-title">All Tools</h2>
								<p className="tools-subtitle">
									Your Personal Tools & Community Picks
								</p>
							</div>

							{info.checkingAccounts ? (
								<div className="centered-loading">
									<Spinner
										width="20px"
										height="20px"
										color="var(--primary-font)"
									/>
									<span className="centered-loading-text">
										Checking existing accounts...
									</span>
								</div>
							) : info.isLoading && filteredActions.length === 0 ? (
								<div className="centered-loading">
									<Spinner
										width="20px"
										height="20px"
										color="var(--primary-font)"
									/>
									<span className="centered-loading-text">Loading tools...</span>
								</div>
							) : info.error ? (
								<div className="error-message">{info.error}</div>
							) : (
								<>
									<InfiniteScroll
										dataLength={filteredActions.length || 0}
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
										<div className="tools-grid">
											{filteredActions.length === 0 ? (
												<div className="error-message centered">
													No tools found.
												</div>
											) : (
												filteredActions.map((action) => {
													const isAdded = addedActionKeys.includes(
														action.toolkit.slug,
													);
													return (
														<div
															key={action.slug}
															className="tool-item"
															onClick={() => handleAddTool(action)}
														>
															<div className="tool-icon-container">
																<img
																	src={action.toolkit.logo || ''}
																	alt={action.name || 'Tool'}
																	className="tool-icon"
																/>
															</div>
															<div className="tool-info">
																<span className="tool-name">
																	{action.name || 'Unnamed'}
																</span>
															</div>
															{isAdded ? (
																<span className="added-badge">
																	✓ Added
																</span>
															) : (
																<button
																	className="add-button"
																	disabled={
																		!!info.addLoading[
																			action.slug
																		] || info.isConnecting
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
																<div className="field-error">
																	{info.addError[action.slug]}
																</div>
															)}
														</div>
													);
												})
											)}
										</div>
									</InfiniteScroll>
								</>
							)}
						</div>
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
