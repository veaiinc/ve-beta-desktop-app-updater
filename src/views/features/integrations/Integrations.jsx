import { useState, useContext, useEffect, memo, useCallback, useRef } from 'react';
import '../../../assets/scss/integrations/integrations.scss';
import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../../../assets/svg/Settings/google-calendar-logo.png';
import dropbox from '../../../assets/svg/Settings/drop-box-logo.png';
import notion from '../../../assets/svg/Settings/notion.svg';
import PayPal from '../../../assets/svg/Settings/paypal.svg';
import Zoho from '../../../assets/svg/Settings/zoho-logo.svg';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../context/context';
import ConnectedIntegrationModel from '../../components/modalsV2/integrations/ConnectedIntegrationModel';
import Spinner from '../../components/loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';
import Service from '../../../services/index';
import jwtDecode from 'jwt-decode';
import FilterDropdown from '../../components/dropDown/file/FilterDropdown';
import { ReactComponent as SearchIcon } from '../../../assets/svg/search.svg';
import outlookCalendar from '../../../assets/svg/Settings/outlook-calendar.svg';
import outlookMail from '../../../assets/svg/Settings/outlook-mail.svg';

const availableIntegrations = [
	{
		id: 1,
		icon: google,
		title: 'Gmail',
		connectType: 'gmail',
		description: 'Easily connect with Gmail to sync your emails and streamline communication.',
		showIn: ['private', 'shared'],
	},
	// {
	// 	id: 2,
	// 	icon: slack,
	// 	title: 'Slack',
	// 	connectType: 'slack',
	// 	description: 'Connect with Slack to streamline team communication and collaboration.',
	// 	showIn: ['shared'],
	// },
	{
		id: 2,
		icon: outlookCalendar,
		title: 'Outlook Calendar',
		connectType: 'outlook-calendar',
		description:
			'Easily connect with Outlook Calendar to sync your schedule and manage appointments.',
		showIn: ['private', 'shared'],
	},
	{
		id: 3,
		icon: outlookMail,
		title: 'Outlook Mail',
		connectType: 'outlook-mail',
		description:
			'Easily connect with Outlook Mail to sync your emails and streamline communication.',
		showIn: ['private', 'shared'],
	},
	{
		id: 4,
		icon: googleCalendar,
		title: 'Google Calendar',
		connectType: 'google-calendar',
		description:
			'Easily connect with Google Calendar to sync your schedule and manage appointments.',
		showIn: ['private', 'shared'],
	},
];

const requestIntegrations = [
	{ id: 1, iconSlug: 'paypal', title: 'PayPal' },
	{ id: 2, title: 'Microsoft 365' },
	{ id: 5, iconSlug: 'zoom', title: 'Zoom' },
	{ id: 6, iconSlug: 'confluence', title: 'Confluence (Atlassian)' },
	{ id: 8, iconSlug: 'salesforce', title: 'Salesforce' },
	{ id: 9, iconSlug: 'github', title: 'GitHub' },
	{ id: 10, iconSlug: 'jira', title: 'Jira (Atlassian)' },
	{ id: 11, iconSlug: 'workday', title: 'Workday' },
	{ id: 12, iconSlug: 'box', title: 'Box' },
	{ id: 13, iconSlug: 'dropbox', title: 'Dropbox' },
	{ id: 14, iconSlug: 'okta', title: 'Okta (SSO/user directory)' },
	{ id: 15, title: 'ServiceNow' },
	{ id: 16, iconSlug: 'zendesk', title: 'Zendesk' },
	{ id: 17, iconSlug: 'asana', title: 'Asana' },
	{ id: 18, iconSlug: 'trello', title: 'Trello' },
	{ id: 19, iconSlug: 'figma', title: 'Figma' },
	{ id: 20, title: 'Tableau' },
	{ id: 21, title: 'Power BI' },
	{ id: 22, iconSlug: 'gitlab', title: 'GitLab' },
	{ id: 23, iconSlug: 'hubspot', title: 'HubSpot' },
	{ id: 24, iconSlug: 'intercom', title: 'Intercom' },
	{ id: 25, title: 'BambooHR' },
	{ id: 26, iconSlug: 'greenhouse', title: 'Greenhouse' },
	{ id: 27, title: 'Lattice' },
	{ id: 28, iconSlug: 'airtable', title: 'Airtable' },
	{ id: 29, title: 'Monday.com' },
	{ id: 30, title: 'Smartsheet' },
	{ id: 31, title: 'Azure DevOps' },
	{ id: 32, title: 'Freshdesk' },
	{ id: 33, iconSlug: 'egnyte', title: 'Egnyte' },
	{ id: 34, iconSlug: 'miro', title: 'Miro' },
	{ id: 35, title: 'DocuSign' },
	{ id: 36, iconSlug: 'adp', title: 'ADP' },
	{ id: 37, title: 'ZoomInfo' },
	{ id: 38, title: 'Gong' },
	{ id: 39, title: 'Domo' },
	{ id: 40, iconSlug: 'looker', title: 'Looker' },
	{ id: 41, title: 'Splunk' },
	{ id: 42, iconSlug: 'pagerduty', title: 'PagerDuty' },
	{ id: 43, title: 'Outreach.io' },
	{ id: 44, title: 'Salesloft' },
	{ id: 45, iconSlug: 'loom', title: 'Loom' },
	{ id: 46, iconSlug: 'calendly', title: 'Calendly' },
	{ id: 47, iconSlug: 'linear', title: 'Linear' },
	{ id: 48, iconSlug: 'bitbucket', title: 'Bitbucket' },
	{ id: 49, iconSlug: 'clickup', title: 'ClickUp' },
	{ id: 50, title: 'Wrike' },
	{ id: 51, iconSlug: 'basecamp', title: 'Basecamp' },
	{ id: 52, title: 'Zoho CRM' },
	{ id: 53, title: 'Pipedrive' },
	{ id: 54, title: 'Freshsales' },
	{ id: 55, title: 'Help Scout' },
	{ id: 56, title: 'Kayako' },
	{ id: 57, title: 'Front App' },
	{ id: 58, title: 'Kustomer' },
	{ id: 59, title: 'Guru' },
	{ id: 60, title: 'Slite' },
	{ id: 61, title: 'Nuclino' },
	{ id: 62, title: 'Marketo' },
	{ id: 63, iconSlug: 'mailchimp', title: 'Mailchimp' },
	{ id: 64, title: 'Braze' },
	{ id: 65, title: 'Iterable' },
	{ id: 66, title: 'Adobe Creative Cloud' },
	{ id: 67, iconSlug: 'canva', title: 'Canva' },
	{ id: 68, iconSlug: 'sketch', title: 'Sketch' },
	{ id: 69, iconSlug: 'invision', title: 'InVision' },
	{ id: 70, title: 'Mode Analytics' },
	{ id: 71, title: 'Sisense' },
	{ id: 72, title: 'OneLogin' },
	{ id: 73, title: 'Duo Security' },
	{ id: 74, title: 'Jamf' },
	{ id: 75, title: 'QuickBooks Online' },
	{ id: 76, iconSlug: 'xero', title: 'Xero' },
	{ id: 77, title: 'Bill.com' },
	{ id: 78, iconSlug: 'expensify', title: 'Expensify' },
	{ id: 79, title: 'Ironclad' },
	{ id: 80, title: 'Lucidchart' },
	{ id: 81, title: 'Chili Piper' },
	{ id: 82, title: 'Chorus.ai' },
	{ id: 83, title: 'Clearbit' },
	{ id: 84, title: 'Twist' },
	{ id: 85, iconSlug: 'mattermost', title: 'Mattermost' },
	{ id: 86, title: 'Flock' },
	{ id: 87, title: 'Redbooth' },
	{ id: 88, title: 'ProofHub' },
	{ id: 89, title: 'Citrix ShareFile' },
	{ id: 90, title: 'Docker Hub' },
	{ id: 91, iconSlug: 'jenkins', title: 'Jenkins' },
	{ id: 92, iconSlug: 'circleci', title: 'CircleCI' },
	{ id: 93, iconSlug: 'terraform', title: 'Terraform' },
	{ id: 94, title: 'Lever' },
	{ id: 95, title: 'Paylocity' },
	{ id: 96, iconSlug: 'gusto', title: 'Gusto' },
	{ id: 97, title: 'Rippling' },
	{ id: 98, title: 'Namely' },
	{ id: 99, title: 'Document360' },
	{ id: 100, title: 'Helpjuice' },
	{ id: 101, title: 'ActiveCampaign' },
	{ id: 103, iconSlug: 'googleCalendar', title: 'Google Calendar' },
];

const getIntegrationInfo = (appType) => {
	const integrationMap = {
		'google-calendar': { icon: googleCalendar, title: 'Google Calendar' },
		'google-drive': { icon: googleDrive, title: 'Google Drive' },
		gmail: { icon: google, title: 'Gmail' },
		notion: { icon: notion, title: 'Notion' },
		slack: { icon: slack, title: 'Slack' },
		zoho: { icon: Zoho, title: 'Zoho' },
		dropbox: { icon: dropbox, title: 'Dropbox' },
		paypal: { icon: PayPal, title: 'PayPal' },
		'outlook-calendar': { icon: outlookCalendar, title: 'Outlook Calendar' },
		'outlook-mail': { icon: outlookMail, title: 'Outlook Mail' },
	};

	const info = integrationMap[appType];
	if (!info) {
		console.warn(`No integration info found for app type: ${appType}`);
		return { icon: google, title: appType };
	}
	return info;
};

const formatTimestamp = (timestamp) => {
	if (!timestamp) return '-';
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

	if (diffInHours < 1) return 'Just now';
	if (diffInHours < 24) return `${diffInHours} hours ago`;
	if (diffInHours < 48) return '1 day ago';
	return `${Math.floor(diffInHours / 24)} days ago`;
};

const getIntegrationStatus = (item) => {
	if (item.isActive !== undefined) return item.isActive;
	if (item.status === 'active') return true;
	if (item.status === 'inactive') return false;
	if (item.connected !== undefined) return item.connected;
	if (item.isConnected !== undefined) return item.isConnected;
	return true;
};

const ConnectedIntegrationTable = ({ connectedPlatforms, onViewAccounts, loading }) => {
	const tableColumns = [
		{ key: 'name', label: 'Name', width: 200 },
		{ key: 'status', label: 'Connection status', width: 200 },
		{ key: 'assets', label: 'Assets', width: 166 },
		{ key: 'access', label: 'Access', width: 165 },
		{ key: 'addedBy', label: 'Added by', width: 166 },
	];

	return (
		<div className="connected-integrations-table">
			<div className="table-header">
				<div className="header-row">
					{tableColumns.map((column) => (
						<div
							key={column.key}
							className={`header-cell ${column.key}-cell`}
							style={{ width: column.width }}
						>
							{column.label}
						</div>
					))}
				</div>
			</div>
			<div className="table-body">
				{loading ? (
					<div className="loading-row">
						<div className="loading-cell">
							<Spinner />
							<span>Loading integrations...</span>
						</div>
					</div>
				) : connectedPlatforms.length === 0 ? (
					<div className="empty-row">
						<div className="empty-cell">
							<span>No connected integrations found</span>
						</div>
					</div>
				) : (
					connectedPlatforms.map((platform) => (
						<div
							key={platform._id || platform.id}
							className="table-row"
							onClick={() => onViewAccounts(platform.accounts, platform)}
						>
							<div className="table-cell name-cell">
								<div className="integration-info">
									<img
										src={platform.icon}
										alt={platform.title}
										className="integration-icon"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = google; // Fallback to default icon
										}}
									/>
									<span className="integration-name">{platform.title}</span>
								</div>
							</div>
							<div className="table-cell status-cell">
								<span
									className={`status ${platform.isActive ? 'active' : 'synced'}`}
								>
									{platform.isActive ? 'Active' : 'Connected'}
								</span>
							</div>
							<div className="table-cell assets-cell">
								{platform.syncedCount || 0}
							</div>
							<div className="table-cell access-cell">
								{platform.access
									? platform.access.charAt(0).toUpperCase() +
									  platform.access.slice(1)
									: 'Private'}
							</div>
							<div className="table-cell added-by-cell">
								{platform.addedBy || platform.email || '-'}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

const AvailableIntegrationCard = ({
	icon,
	title,
	description,
	connectType,
	onConnect,
	connectLoader,
	connectedApps,
	activeTab,
}) => {
	const isShared = availableIntegrations
		.find((i) => i.connectType === connectType)
		?.showIn.includes('shared');
	const isConnected = connectedApps?.includes(connectType);
	const allowMultiple = isShared;

	// For private filter: disable if connected, for shared filter: always allow
	const shouldDisable = activeTab === 'private' ? isConnected : false;

	const handleConnectClick = () => {
		if (shouldDisable) {
			message.info('Already connected');
		} else {
			onConnect({ icon, title, description, connectType });
		}
	};

	return (
		<div className="available-integration-card">
			<div className="card-content">
				<div className="integration-header">
					<div className="integration-icon-wrapper">
						<img src={icon} alt={title} className="integration-icon" />
					</div>
					<div className="integration-details">
						<h3 className="integration-title">{title}</h3>
						<p className="integration-description">{description}</p>
					</div>
				</div>
				<button
					className={`connect-button ${shouldDisable ? 'connected' : ''}`}
					onClick={handleConnectClick}
					disabled={shouldDisable}
				>
					{shouldDisable ? 'Connected' : 'Connect'}
					{connectLoader?.loader && connectLoader?.title === title && <Spinner />}
				</button>
			</div>
		</div>
	);
};

const IntegrationRequestCard = ({ iconSlug, title, tenantId }) => {
	const handleRequestThisIntegration = async (appName) => {
		const path =
			'/veai/67fe3e600c94e176a4caa277/67fe3e600c94e176a4caa278/67fe3e6bfb3b5c663744bc78';
		const token = localStorage.getItem('usertoken');
		const workspaceId = localStorage.getItem('workspaceId');
		const userId = jwtDecode(token)?.user_id;
		const username = jwtDecode(token)?.userName;

		const body = {
			responseInput: {
				response: [
					{
						_id: '67fe400ef1d11a35f34ba39f',
						type: 'shortanswer',
						question: 'Tenant User Id',
						placeholder: 'Enter your tenant user id',
						answer: userId,
					},
					{
						_id: '67fe412cef81b3629e2f70c7',
						type: 'shortanswer',
						question: 'Tenant _id',
						placeholder: 'Enter your tenant id',
						answer: tenantId,
					},
					{
						_id: '67fe4119f1d11a35f34ba3a1',
						type: 'shortanswer',
						question: 'Tenant Name',
						placeholder: 'Enter your tenant name',
						answer: workspaceId,
					},
					{
						_id: '67fe40305843ba03df9eff98',
						type: 'shortanswer',
						question: 'Tenant User Name',
						placeholder: 'Enter your tenant user name',
						answer: username,
					},
					{
						_id: '67fe40bd48dba03b45963bcf',
						type: 'shortanswer',
						question: 'Application',
						placeholder: 'Enter the application name',
						answer: appName,
					},
				],
			},
		};

		try {
			const response = await Service?.fetchPost(path, body, token, 'workflow');
			if (response?.[0] === true) {
				message.success(`Request sent successfully to integrate ${appName}`);
			} else {
				message.error('Request failed');
			}
		} catch (error) {
			console.error('Error requesting integration:', error);
			message.error('Request failed');
		}
	};

	return (
		<div className="integration-request-card">
			<div className="card-content">
				<div className="integration-info">
					{iconSlug ? (
						<div className="integration-icon">
							<img src={`https://cdn.simpleicons.org/${iconSlug}`} alt={title} />
						</div>
					) : (
						<div className="integration-icon-placeholder"></div>
					)}
					<h3 className="integration-title">{title}</h3>
				</div>
				<button
					className="request-button"
					onClick={() => handleRequestThisIntegration(title)}
				>
					Request
				</button>
			</div>
		</div>
	);
};

const Integrations = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIntegration, setSelectedIntegration] = useState(null);
	const [connectedPlatforms, setConnectedPlatforms] = useState([]);
	const [connectedAccountsModel, setConnectedAccountsModel] = useState(false);
	const [activeTab, setActiveTab] = useState('all');
	const [connectLoader, setConnectLoader] = useState({ loader: false, title: '' });
	const [searchQuery, setSearchQuery] = useState('');
	const [loadingConnectedIntegrations, setLoadingConnectedIntegrations] = useState(false);
	const [error, setError] = useState(null);
	const isMountedRef = useRef(true);

	const {
		profileInfo: { tenantUserAccessControls, tennantSettingsData },
		templates: { connectUrl, getConnectedThirdParties, connectThirdParty },
	} = useContext(Context);

	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const tenantId = tennantSettingsData?._id;

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

			// console.log('API response:', response);

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
						id: item._id, // Add id as well for fallback
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
				const legacyPlatforms = [];

				if (data.google?.length > 0) {
					legacyPlatforms.push({
						_id: 'legacy-gmail',
						icon: google,
						title: 'Gmail',
						description: 'Connected Gmail accounts for emails and communication.',
						isActive: getIntegrationStatus(data.google[0] || {}),
						syncedCount: data.google.length,
						access: 'private',
						addedBy: 'User',
						email: data.google[0]?.email || '-',
						lastSync: 'Recently',
						accounts: data.google,
						connectType: 'gmail',
					});
				}

				if (data.slack?.length > 0) {
					legacyPlatforms.push({
						_id: 'legacy-slack',
						icon: slack,
						title: 'Slack',
						description: 'Connected Slack workspaces for communication.',
						isActive: getIntegrationStatus(data.slack[0] || {}),
						syncedCount: data.slack.length,
						access: 'shared',
						addedBy: 'User',
						email: data.slack[0]?.email || '-',
						lastSync: 'Recently',
						accounts: data.slack,
						connectType: 'slack',
					});
				}

				if (data['google-calendar']?.length > 0) {
					legacyPlatforms.push({
						_id: 'legacy-calendar',
						icon: googleCalendar,
						title: 'Google Calendar',
						description: 'Connected Google Calendar accounts for scheduling.',
						isActive: getIntegrationStatus(data['google-calendar'][0] || {}),
						syncedCount: data['google-calendar'].length,
						access: 'private',
						addedBy: 'User',
						email: data['google-calendar'][0]?.email || '-',
						lastSync: 'Recently',
						accounts: data['google-calendar'],
						connectType: 'google-calendar',
					});
				}

				if (data['outlook-calendar']?.length > 0) {
					legacyPlatforms.push({
						_id: 'legacy-outlook-calendar',
						icon: outlookCalendar,
						title: 'Outlook Calendar',
						description: 'Connected Outlook Calendar accounts for scheduling.',
						isActive: getIntegrationStatus(data['outlook-calendar'][0] || {}),
						syncedCount: data['outlook-calendar'].length,
						access: 'private',
						addedBy: 'User',
						email: data['outlook-calendar'][0]?.email || '-',
						lastSync: 'Recently',
						accounts: data['outlook-calendar'],
						connectType: 'outlook-calendar',
					});
				}

				if (data['outlook-mail']?.length > 0) {
					legacyPlatforms.push({
						_id: 'legacy-outlook-mail',
						icon: outlookMail,
						title: 'Outlook Mail',
						description:
							'Connected Outlook Mail accounts for emails and communication.',
						isActive: getIntegrationStatus(data['outlook-mail'][0] || {}),
						syncedCount: data['outlook-mail'].length,
						access: 'private',
						addedBy: 'User',
						email: data['outlook-mail'][0]?.email || '-',
						lastSync: 'Recently',
						accounts: data['outlook-mail'],
						connectType: 'outlook-mail',
					});
				}

				platforms = legacyPlatforms;
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

	const handleDirectConnect = async (connectType) => {
		try {
			setConnectLoader({ loader: true, title: connectType });
			await connectThirdParty(connectType);
		} catch (error) {
			console.error('Direct connection failed:', error);
			message.error('Connection failed. Please try again.');
		} finally {
			setConnectLoader({ loader: false, title: '' });
		}
	};

	const handleConnectionSuccess = () => {
		setConnectLoader({ loader: false, title: '' });
		fetchConnectedPlatforms();
		setTimeout(() => {
			setIsModalOpen(false);
		}, 1000);
	};

	const handleConnect = async (integration) => {
		setSelectedIntegration(integration);
		setConnectLoader({ loader: true, title: integration.title });
		setIsModalOpen(true);
	};

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

	const filterOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'private', label: 'Private' },
		...(isAdmin ? [{ value: 'shared', label: 'Shared' }] : []),
	];

	const connectedApps = connectedPlatforms.map((platform) => platform.connectType);

	const filteredConnectedPlatforms = connectedPlatforms.filter((platform) => {
		const matchesSearch = platform.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesAccess =
			activeTab === 'all' ? true : platform.access.toLowerCase() === activeTab;

		return matchesSearch && matchesAccess;
	});

	const filteredAvailableIntegrations = availableIntegrations.filter((integration) => {
		const matchesSearch = integration.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTab =
			activeTab === 'all'
				? isAdmin || integration.showIn.includes('private')
				: integration.showIn.includes(activeTab);
		return matchesSearch && matchesTab;
	});

	const filteredRequestIntegrations = requestIntegrations.filter((integration) =>
		integration.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSelectedCardModel = (accounts, integration) => {
		setConnectedAccountsModel(true);
		setSelectedIntegration({ ...integration, accounts });
	};

	return (
		<div className="integrations-container">
			<section className="connected-integrations-section">
				<div className="section-header">
					<h2 className="section-title">Connected Integrations</h2>
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
				onRefresh={() => fetchConnectedPlatforms()}
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
