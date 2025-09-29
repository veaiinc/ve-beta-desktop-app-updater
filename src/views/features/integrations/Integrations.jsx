import { useState, useContext, useEffect, memo, useCallback, useRef, useMemo } from 'react';
import '../../../assets/scss/integrations/integrations.scss';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../context/context';
import ConnectedIntegrationModel from '../../components/modalsV2/integrations/ConnectedIntegrationModel';
import { message } from '../../components/globalComponents/CustomToast';
import FilterDropdown from '../../components/dropDown/file/FilterDropdown';
import { ReactComponent as SearchIcon } from '../../../assets/svg/search.svg';
import { useLocation } from 'react-router-dom';
import {
	availableIntegrations,
	requestIntegrations,
	getIntegrationInfo,
	formatTimestamp,
	getIntegrationStatus,
} from './integrationsData';
import google from '../../../assets/svg/Settings/google.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import googleCalendar from '../../../assets/svg/Settings/google-calendar-logo.png';
import outlookCalendar from '../../../assets/svg/Settings/outlook-calendar.svg';
import outlookMail from '../../../assets/svg/Settings/outlook-mail.svg';
import {
	ConnectedIntegrationTable,
	AvailableIntegrationCard,
	IntegrationRequestCard,
} from './integrationsComponents';

// Constants and utility functions moved to separate files

// Component definitions moved to separate files

// Custom hook for managing integration state
const useIntegrationState = () => {
	const location = useLocation();

	// Determine default tab based on URL parameters
	const getDefaultTab = () => {
		const searchParams = new URLSearchParams(location.search);
		const access = searchParams.get('access');

		// If access=shared, default to shared tab
		if (access === 'shared') {
			return 'shared';
		}

		// If access=private or no access parameter, default to private
		// This covers both account connectors and default behavior
		return 'private';
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIntegration, setSelectedIntegration] = useState(null);
	const [connectedPlatforms, setConnectedPlatforms] = useState([]);
	const [connectedAccountsModel, setConnectedAccountsModel] = useState(false);
	const [activeTab, setActiveTab] = useState(getDefaultTab());
	const [connectLoader, setConnectLoader] = useState({ loader: false, title: '' });
	const [searchQuery, setSearchQuery] = useState('');
	const [loadingConnectedIntegrations, setLoadingConnectedIntegrations] = useState(false);
	const [error, setError] = useState(null);
	const isMountedRef = useRef(true);

	return {
		isModalOpen,
		setIsModalOpen,
		selectedIntegration,
		setSelectedIntegration,
		connectedPlatforms,
		setConnectedPlatforms,
		connectedAccountsModel,
		setConnectedAccountsModel,
		activeTab,
		setActiveTab,
		connectLoader,
		setConnectLoader,
		searchQuery,
		setSearchQuery,
		loadingConnectedIntegrations,
		setLoadingConnectedIntegrations,
		error,
		setError,
		isMountedRef,
	};
};

// Custom hook for integration data fetching
const useIntegrationData = (
	isMountedRef,
	setConnectedPlatforms,
	setLoadingConnectedIntegrations,
	setError,
) => {
	const {
		templates: { getConnectedThirdParties },
	} = useContext(Context);

	const fetchConnectedPlatforms = useCallback(async () => {
		if (!isMountedRef.current) return;

		setLoadingConnectedIntegrations(true);
		setError(null);

		const timeout = setTimeout(() => {
			if (isMountedRef.current) {
				setLoadingConnectedIntegrations(false);
				setError('Request timed out. Please try again.');
				message.error('Request timed out. Please try again.');
			}
		}, 10000);

		try {
			const response = await getConnectedThirdParties();
			if (!isMountedRef.current) return;

			if (!response || !Array.isArray(response) || response.length < 2) {
				throw new Error('Invalid response structure');
			}

			const [success, data] = response;

			if (!success) {
				throw new Error(data?.message || 'Failed to fetch connected platforms');
			}

			let platforms = [];

			// Handle new API response structure
			if (data && Array.isArray(data.data)) {
				platforms = data.data.map((item) => {
					const integrationInfo = getIntegrationInfo(item.app);

					return {
						_id: item._id || `temp-${Math.random()}`,
						id: item._id,
						icon: integrationInfo.icon,
						title: integrationInfo.title,
						description: `Connected ${integrationInfo.title} account`,
						isActive: getIntegrationStatus(item),
						syncedCount: item.syncedCount || item.syncCount || 0,
						access: item.access || 'private',
						addedBy: item.tenantUser?.name || item.addedBy || item.email || '-',
						email: item.email || '-',
						lastSync: formatTimestamp(item.lastSyncTimestamp),
						accounts: [item],
						connectType: item.app,
					};
				});
			}
			// Handle legacy API response structure
			else if (data && typeof data === 'object') {
				platforms = processLegacyData(data);
			}

			if (isMountedRef.current) {
				setConnectedPlatforms(platforms);
				setLoadingConnectedIntegrations(false);
			}
		} catch (error) {
			console.error('Error fetching connected platforms:', error);
			if (isMountedRef.current) {
				setConnectedPlatforms([]);
				setError(error.message || 'Failed to load connected integrations.');
				message.error(error.message || 'Failed to load connected integrations.');
				setLoadingConnectedIntegrations(false);
			}
		} finally {
			clearTimeout(timeout);
		}
	}, [getConnectedThirdParties]);

	return { fetchConnectedPlatforms };
};

// Helper function to process legacy API data
const processLegacyData = (data) => {
	const legacyPlatforms = [];
	const legacyMappings = [
		{ key: 'google', icon: google, title: 'Gmail', connectType: 'gmail', access: 'private' },
		{ key: 'slack', icon: slack, title: 'Slack', connectType: 'slack', access: 'shared' },
		{
			key: 'google-calendar',
			icon: googleCalendar,
			title: 'Google Calendar',
			connectType: 'google-calendar',
			access: 'private',
		},
		{
			key: 'outlook-calendar',
			icon: outlookCalendar,
			title: 'Outlook Calendar',
			connectType: 'outlook-calendar',
			access: 'private',
		},
		{
			key: 'outlook-mail',
			icon: outlookMail,
			title: 'Outlook Mail',
			connectType: 'outlook-mail',
			access: 'private',
		},
	];

	legacyMappings.forEach(({ key, icon, title, connectType, access }) => {
		if (data[key]?.length > 0) {
			legacyPlatforms.push({
				_id: `legacy-${connectType}`,
				icon,
				title,
				description: `Connected ${title} accounts`,
				isActive: getIntegrationStatus(data[key][0] || {}),
				syncedCount: data[key].length,
				access,
				addedBy: 'User',
				email: data[key][0]?.email || '-',
				lastSync: 'Recently',
				accounts: data[key],
				connectType,
			});
		}
	});

	return legacyPlatforms;
};

const Integrations = () => {
	const location = useLocation();
	const integrationState = useIntegrationState();
	const {
		isModalOpen,
		setIsModalOpen,
		selectedIntegration,
		setSelectedIntegration,
		connectedPlatforms,
		setConnectedPlatforms,
		connectedAccountsModel,
		setConnectedAccountsModel,
		activeTab,
		setActiveTab,
		connectLoader,
		setConnectLoader,
		searchQuery,
		setSearchQuery,
		loadingConnectedIntegrations,
		setLoadingConnectedIntegrations,
		error,
		setError,
		isMountedRef,
	} = integrationState;

	const {
		profileInfo: { tenantUserAccessControls, tennantSettingsData },
		templates: { connectUrl, connectThirdParty },
	} = useContext(Context);

	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const tenantId = tennantSettingsData?._id;

	const { fetchConnectedPlatforms } = useIntegrationData(
		isMountedRef,
		setConnectedPlatforms,
		setLoadingConnectedIntegrations,
		setError,
	);

	// Data fetching logic moved to custom hook

	// Event handlers with improved error handling
	const handleDirectConnect = useCallback(
		async (connectType) => {
			try {
				setConnectLoader({ loader: true, title: connectType });
				await connectThirdParty(connectType);
			} catch (error) {
				console.error('Direct connection failed:', error);
				message.error('Connection failed. Please try again.');
			} finally {
				setConnectLoader({ loader: false, title: '' });
			}
		},
		[connectThirdParty],
	);

	const handleConnectionSuccess = useCallback(() => {
		setConnectLoader({ loader: false, title: '' });
		fetchConnectedPlatforms();
		setTimeout(() => {
			setIsModalOpen(false);
		}, 1000);
	}, [fetchConnectedPlatforms]);

	const handleConnect = useCallback((integration) => {
		setSelectedIntegration(integration);
		setConnectLoader({ loader: true, title: integration.title });
		setIsModalOpen(true);
	}, []);

	const handleSelectedCardModel = useCallback((accounts, integration) => {
		setConnectedAccountsModel(true);
		setSelectedIntegration({ ...integration, accounts });
	}, []);

	// Effects with improved dependency management
	useEffect(() => {
		if (!isModalOpen && connectUrl) {
			if (connectUrl[0] === true) {
				window.location.href = connectUrl[1];
			} else {
				message.error(connectUrl[1]?.message || 'Error connecting integration');
				setConnectLoader({ loader: false, title: '' });
			}
		}
	}, [connectUrl, isModalOpen]);

	useEffect(() => {
		isMountedRef.current = true;
		fetchConnectedPlatforms();
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	// Update active tab when URL changes
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const access = searchParams.get('access');

		if (access === 'shared' && isAdmin) {
			setActiveTab('shared');
		} else if (access === 'private') {
			setActiveTab('private');
		} else if (!access) {
			// Default to private if no access parameter
			setActiveTab('private');
		}
	}, [location.search, isAdmin]);

	// Memoized filter options and data processing
	const filterOptions = useMemo(
		() => [
			{ value: 'all', label: 'All' },
			{ value: 'private', label: 'Private' },
			...(isAdmin ? [{ value: 'shared', label: 'Shared' }] : []),
		],
		[isAdmin],
	);

	const connectedApps = useMemo(
		() => connectedPlatforms.map((platform) => platform.connectType),
		[connectedPlatforms],
	);

	const filteredConnectedPlatforms = useMemo(
		() =>
			connectedPlatforms.filter((platform) => {
				const matchesSearch = platform.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const matchesAccess =
					activeTab === 'all' ? true : platform.access.toLowerCase() === activeTab;
				return matchesSearch && matchesAccess;
			}),
		[connectedPlatforms, searchQuery, activeTab],
	);

	const filteredAvailableIntegrations = useMemo(
		() =>
			availableIntegrations.filter((integration) => {
				const matchesSearch = integration.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const matchesTab =
					activeTab === 'all'
						? isAdmin || integration.showIn.includes('private')
						: integration.showIn.includes(activeTab);
				return matchesSearch && matchesTab;
			}),
		[searchQuery, activeTab, isAdmin],
	);

	const filteredRequestIntegrations = useMemo(
		() =>
			requestIntegrations.filter((integration) =>
				integration.title.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		[searchQuery],
	);

	return (
		<div className="integrations-container">
			<section className="connected-integrations-section">
				<div className="section-header">
					<h2 className="section-title">
						{activeTab === 'all'
							? 'Connected'
							: activeTab === 'private'
							? 'Private'
							: 'Shared'}{' '}
						Integrations
					</h2>
					<FilterDropdown
						selected={filterOptions.find((option) => option.value === activeTab)}
						options={filterOptions}
						onOptionClick={(option) => setActiveTab(option.value)}
						width="120px"
					/>
				</div>
				{error && (
					<div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
						{error}
					</div>
				)}
				<ConnectedIntegrationTable
					connectedPlatforms={filteredConnectedPlatforms}
					onViewAccounts={handleSelectedCardModel}
					loading={loadingConnectedIntegrations}
				/>
			</section>

			<section className="available-integrations-section">
				<h2 className="section-title">Available Integrations</h2>
				<div className="integrations-grid">
					{filteredAvailableIntegrations?.map((integration) => (
						<AvailableIntegrationCard
							key={integration?.id}
							{...integration}
							onConnect={handleConnect}
							connectLoader={connectLoader}
							connectedApps={connectedApps}
							activeTab={activeTab}
						/>
					))}
				</div>
			</section>

			<section className="request-integrations-section">
				<h2 className="section-title">Which integrations would you like to connect?</h2>
				<div className="search-container">
					<div className="search-field">
						<SearchIcon />
						<input
							type="text"
							placeholder="Search integrations"
							className="search-input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							aria-label="Search for integrations"
						/>
					</div>
				</div>
				<div className="request-integrations-grid">
					{filteredRequestIntegrations.map((integration) => (
						<IntegrationRequestCard
							key={integration.id}
							{...integration}
							tenantId={tenantId}
						/>
					))}
				</div>
			</section>

			<ConnectedIntegrationModel
				isOpen={connectedAccountsModel}
				closeModal={() => setConnectedAccountsModel(false)}
				connectedIntegration={selectedIntegration}
				onRefresh={fetchConnectedPlatforms}
			/>

			<IntegrationConnectModel
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				integration={selectedIntegration}
				onConnectionSuccess={handleConnectionSuccess}
				activeTab={activeTab}
			/>
		</div>
	);
};

export default memo(Integrations);
