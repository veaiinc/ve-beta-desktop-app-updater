//old code 
import { useState, useContext, useEffect, memo } from 'react';
import '../../../assets/scss/integrations/integrations.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../../../assets/svg/Settings/google-calendar-logo.png';
import dropbox from '../../../assets/svg/Settings/drop-box-logo.png';
// import meta from '../../../assets/svg/Settings/meta.svg';
import notion from '../../../assets/svg/Settings/notion.svg';
import PayPal from '../../../assets/svg/Settings/paypal.svg';
// import Square from '../../../assets/svg/Settings/square.svg';
// import Stripe from '../../../assets/svg/Settings/stripe.svg';
import Zoho from '../../../assets/svg/Settings/zoho-logo.svg';
// import microsoft365 from '../../../assets/svg/Settings/microsoft-365.svg';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../context/context';
// import { Modal } from 'antd';
import ConnectedIntegrationModel from '../../components/modalsV2/integrations/ConnectedIntegrationModel';
import Spinner from '../../components/loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';
import Service from '../../../services/index';
import jwtDecode from 'jwt-decode';

const requestIntegrations = [
	{ id: 1, iconSlug: 'paypal', title: 'PayPal' },
	{
		id: 2,
		title: 'Microsoft 365',
	},
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
	{ id: 102, title: 'Outlook Mail' },
	{ id: 103, iconSlug: 'googleCalendar', title: 'Google Calendar' },
];

const ConnectedIntegrationCard = ({ icon, title, description, accounts, onViewAccounts }) => {
	return (
		<>
			{accounts?.some((account) => account?.isActive) && (
				<div
					className="connected-integration-card"
					onClick={() => onViewAccounts(accounts, { icon, title, description })}
				>
					<div className="card-left">
						<div className="integration-icon">
							<img src={icon} alt={title} className="integraton-image" />
						</div>
						<div className="integration-content">
							<h3 className="integration-content-title">{title}</h3>
							<p className="integration-content-description">{description}</p>
							<p className="connected-accounts">
								{accounts.length} account(s) connected
							</p>
						</div>
					</div>
					<div className="card-right">
						<span className="connected-dot"></span>
						<span className="connected-badge">Connected</span>
					</div>
				</div>
			)}
		</>
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
}) => {
	return (
		<div className="available-integration-card">
			<div className="card-top-row">
				<div className="integration-icon">
					<img src={icon} alt={title} className="integraton-image" />
				</div>
				<div className="integration-content">
					<h3 className="integration-content-title">{title}</h3>
				</div>
			</div>
			<div className="integration-content">
				<p className="integration-content-description">{description}</p>
			</div>
			<button
				className="integration-button connect"
				onClick={() =>
					connectedApps?.includes(connectType)
						? () => {
								message.info('Already connected');
						  }
						: onConnect({ icon, title, description, connectType })
				}
			>
				{connectedApps?.includes(connectType) ? 'Connected' : 'Connect'}
				{connectLoader?.loader && connectLoader?.title === title && <Spinner />}
			</button>
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
						required: false,
						order: 4,
						isEditing: false,
						placeholder: 'Enter your tenant user id',
						answer: userId,
						validation: {
							pattern: {},
							operators: [],
						},
						conditions: [],
						actions: [],
					},
					{
						_id: '67fe412cef81b3629e2f70c7',
						type: 'shortanswer',
						question: 'Tenant _id',
						required: false,
						order: 5,
						isEditing: false,
						placeholder: 'Enter your tenant _id',
						answer: tenantId,
						validation: {
							pattern: {},
							operators: [],
						},
						conditions: [],
						actions: [],
					},
					{
						_id: '67fe4119f1d11a35f34ba3a1',
						type: 'shortanswer',
						question: 'Tenant Name',
						required: false,
						order: 4,
						isEditing: false,
						placeholder: 'Enter your tenant name',
						answer: workspaceId,
						validation: {
							pattern: {},
							operators: [],
						},
						conditions: [],
						actions: [],
					},
					{
						_id: '67fe40305843ba03df9eff98',
						type: 'shortanswer',
						question: 'Tenant User Name',
						required: false,
						order: 5,
						isEditing: false,
						placeholder: 'Enter your tenant user name',
						answer: username,
						validation: {
							pattern: {},
							operators: [],
						},
						conditions: [],
						actions: [],
					},
					{
						_id: '67fe40bd48dba03b45963bcf',
						type: 'shortanswer',
						question: 'Application',
						required: false,
						order: 5,
						isEditing: false,
						placeholder: 'Enter your application',
						answer: appName,
						validation: {
							pattern: {},
							operators: [],
						},
						conditions: [],
						actions: [],
					},
				],
			},
		};
		const type = 'workflow';
		const response = await Service?.fetchPost(path, body, token, type);
		if (response?.[0] === true) {
			message.success(`Request sent successfully to integrate ${appName}`);
		} else {
			message.error('Request failed');
		}
	};

	return (
		<div className="integration-request-card">
			<div className="card-content">
				{iconSlug ? (
					<div className="integration-icon">
						<img src={`https://cdn.simpleicons.org/${iconSlug}`} alt={title} />
					</div>
				) : (
					''
				)}
				<h3>{title}</h3>
			</div>
			<span
				onClick={(e) => {
					e.preventDefault();
					handleRequestThisIntegration(title);
				}}
				className="request-button"
			>
				Request
			</span>
		</div>
	);
};

const Integrations = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIntegration, setSelectedIntegration] = useState(null);
	const [connectedPlatforms, setConnectedPlatforms] = useState([]);
	const [selectedAccounts, setSelectedAccounts] = useState();
	const [connectedAccountsModel, setConnectedAccountsModel] = useState(false);
	const [activeTab, setActiveTab] = useState('private');
	const [connectLoader, setConnectLoader] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const {
		profileInfo: { tenantUserAccessControls, tennantSettingsData },
	} = useContext(Context);
	let isAdmin = false;

	const tenantId = tennantSettingsData?._id;

	if (tenantUserAccessControls?.role === 'admin') {
		isAdmin = true;
	}
	const handleConnect = async (integration) => {
		setSelectedIntegration(integration);
		setConnectLoader({
			title: integration?.title,
			loader: true,
		});
		await handleConnectThirdParty(integration?.connectType, activeTab);
		setConnectLoader({
			title: integration?.title,
			loader: false,
		});
		// setIsModalOpen(true);
	};

	const availableIntegrations = [
		{
			id: 1,
			icon: google,
			title: 'Gmail',
			connectType: 'gmail',
			description:
				'Easily connect with Gmail to sync your emails and streamline communication.',
			isConnected: false,
		},
		// {
		// 	id: 2,
		// 	icon: notion,
		// 	title: 'Notion',
		// 	connectType: 'notion',
		// 	description:
		// 		'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
		// 	isConnected: false,
		// },
		{
			id: 3,
			icon: slack,
			title: 'Slack',
			connectType: 'slack',
			description:
				'Stay connected and streamline communication by integrating with Slack. Receive updates, share insights, and collaborate seamlessly.',
			isConnected: false,
			onlyShowIn: 'shared',
		},
		// {
		// 	id: 4,
		// 	icon: googleDrive,
		// 	title: 'Google Drive',
		// 	connectType: 'google-drive',
		// 	description:
		// 		'Easily connect with Google Drive to sync your files and streamline communication.',
		// 	isConnected: false,
		// },
		{
			id: 5,
			icon: googleCalendar,
			title: 'Google Calendar',
			connectType: 'google-calendar',
			description: 'Easily connect with Google Calendar to sync your calendar.',
			isConnected: false,
		},
		// {
		// 	id: 6,
		// 	icon: zoho,
		// 	title: 'Zoho',
		// 	connectType: 'zoho',
		// 	description: 'Easily connect to Zoho to access your CRM and sales data.',
		// 	isConnected: false,
		// },
		// {
		// 	id: 7,
		// 	icon: dropbox,
		// 	title: 'Salesforce	',
		// 	connectType: 'salesforce',
		// 	description: 'Easily connect with Salesforce to sync your CRM and sales data.',
		// 	isConnected: false,
		// },
		// {
		// 	id: 8,
		// 	icon: dropbox,
		// 	title: 'Hubspot',
		// 	connectType: 'hubspot',
		// 	description: 'Easily connect with Hubspot to sync your CRM and sales data.',
		// 	isConnected: false,
		// },
		// {
		// 	id: 9,
		// 	icon: dropbox,
		// 	title: 'Dropbox',
		// 	connectType: 'dropbox',
		// 	description: 'Easily connect with Dropbox to sync your files.',
		// 	isConnected: false,
		// },
	];

	const [info, setInfo] = useState({
		connectedThirdParties: {
			google: false,
			zoho: false,
			notion: false,
			slack: false,
			googleDrive: false,
			dropbox: false,
			googleCalendar: false,
			hubspot: false,
			salesforce: false,
		},
		loader: false,
	});
	const {
		templates: {
			connectUrl,
			connectedThirdParties,
			getConnectedThirdParties,
			connectThirdParty,
		},
	} = useContext(Context);

	const connectedApps = connectedThirdParties?.data?.map((appInfo) => appInfo.app);

	useEffect(() => {
		if (connectUrl?.[0] === true) {
			window.location.href = connectUrl?.[1];
		} else {
			if (connectUrl !== null) {
				message?.error(
					connectUrl?.[1]?.message || `error connecting with ${info?.clickLoader}`,
				);
				setInfo((prev) => ({ ...prev, clickLoader: false }));
			}
		}
	}, [connectUrl]);

	const handleConnectThirdParty = async (connectType, integrationType) => {
		setInfo((prev) => ({
			...prev,
			loader: true,
		}));
		await connectThirdParty(connectType, integrationType);
	};
	useEffect(() => {
		const fetchConnectedPlatforms = async () => {
			const response = await getConnectedThirdParties(activeTab);
			if (response?.[0] === true && response?.[1]) {
				const data = response[1];
				setInfo((prev) => ({
					...prev,
					connectedThirdParties: {
						google: data.google || [],
						notion: data.notion || [],
						slack: data.slack || [],
						zoho: data.zoho || [],
						googleDrive: data.googleDrive || [],
						dropbox: data.dropbox || [],
						googleCalendar: data.googleCalendar || [],
						hubspot: data.hubspot || [],
						salesforce: data.salesforce || [],
					},
				}));
			}
		};
		fetchConnectedPlatforms();
	}, [activeTab]);

	useEffect(() => {
		if (info?.connectedThirdParties) {
			const platforms = [];

			if (info.connectedThirdParties.google?.length > 0) {
				platforms.push({
					icon: google,
					title: 'Gmail',
					description: 'Connected Gmail accounts for emails and communication.',
					accounts: info.connectedThirdParties.google,
				});
			}
			if (info.connectedThirdParties.notion?.length > 0) {
				platforms.push({
					icon: notion,
					title: 'Notion',
					description: 'Connected Notion workspaces for task and project management.',
					accounts: info.connectedThirdParties.notion,
				});
			}
			if (info.connectedThirdParties.slack?.length > 0) {
				platforms.push({
					icon: slack,
					title: 'Slack',
					description: 'Connected Slack workspaces for communication.',
					accounts: info.connectedThirdParties.slack,
				});
			}
			if (info.connectedThirdParties.googleDrive?.length > 0) {
				platforms.push({
					icon: googleDrive,
					title: 'Google Drive',
					description: 'Connected Google Drive accounts for files and storage.',
					accounts: info.connectedThirdParties.googleDrive,
				});
			}
			if (info.connectedThirdParties.googleCalendar?.length > 0) {
				platforms.push({
					icon: googleCalendar,
					title: 'Google Calendar',
					description: 'Connected Google Calendar accounts for scheduling and reminders.',
					accounts: info.connectedThirdParties.googleCalendar,
				});
			}
			// if (info.connectedThirdParties.zoho?.length > 0) {
			// 	platforms.push({
			// 		icon: zoho,
			// 		title: 'Zoho',
			// 		description: 'Connected Zoho workspaces for task and project management.',
			// 		accounts: info.connectedThirdParties.zoho,
			// 	});
			// }
			// if (info.connectedThirdParties.hubspot?.length > 0) {
			// 	platforms.push({
			// 		icon: hubspot,
			// 		title: 'Hubspot',
			// 		description: 'Connected Hubspot workspaces for task and project management.',
			// 		accounts: info.connectedThirdParties.hubspot,
			// 	});
			// }
			// if (info.connectedThirdParties.salesforce?.length > 0) {
			// 	platforms.push({
			// 		icon: salesforce,
			// 		title: 'Salesforce',
			// 		description: 'Connected Salesforce workspaces for task and project management.',
			// 		accounts: info.connectedThirdParties.salesforce,
			// 	});
			// }
			// if (info.connectedThirdParties.dropbox?.length > 0) {
			// 	platforms.push({
			// 		icon: dropbox,
			// 		title: 'Dropbox',
			// 		description: 'Connected Dropbox workspaces for files and storage.',
			// 		accounts: info.connectedThirdParties.dropbox,
			// 	});
			// }

			setConnectedPlatforms(platforms);
		}
	}, [info.connectedThirdParties]);

	const handleSelectedCardModel = (accounts, integration) => {
		setConnectedAccountsModel(true);
		setSelectedIntegration({
			...integration,
			accounts: accounts,
		});
	};
	const filteredIntegrations = availableIntegrations.filter((integration) => {
		// If `onlyShowIn` is defined, only show when it matches activeTab
		if (integration.onlyShowIn) {
			return integration.onlyShowIn === activeTab;
		}
		// Otherwise, show it in all tabs
		return true;
	});

	const filteredConnectedPlatforms = connectedPlatforms.filter((platform) =>
		platform.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredAvailableIntegrations = filteredIntegrations.filter((integration) =>
		integration.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredRequestIntegrations = requestIntegrations.filter((integration) =>
		integration.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<>
			<div className="integrations-container">
				<div className="title-container">
					<h1 className="integrations-title">Integrations</h1>
					<div className="search-container">
						<img src={Search} alt="search" className="search-image" />
						<input
							type="text"
							placeholder="Search"
							className="search-input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<div className="tabs-wrapper">
					<button
						className={`tab-button ${activeTab === 'private' ? 'active' : ''}`}
						onClick={() => setActiveTab('private')}
					>
						Private
					</button>
					{isAdmin && (
						<button
							className={`tab-button ${activeTab === 'shared' ? 'active' : ''}`}
							onClick={() => setActiveTab('shared')}
						>
							Shared
						</button>
					)}
				</div>
				{filteredConnectedPlatforms.length !== 0 && (
					<section className="connected-integrations">
						<h2>Connected Integrations</h2>

						<div className="connected-integrations-list">
							{filteredConnectedPlatforms.map((integration) => (
								<ConnectedIntegrationCard
									key={integration?.id}
									{...integration}
									onViewAccounts={handleSelectedCardModel}
								/>
							))}
						</div>
					</section>
				)}
				<section className="available-integrations">
					<h2>
						{connectedApps?.includes('gmail')
							? 'Connected Integrations'
							: 'Available Integrations'}
					</h2>
					<div className="integrations-grid">
						{filteredAvailableIntegrations?.map((integration) => (
							<AvailableIntegrationCard
								connectedApps={connectedApps}
								key={integration?.id}
								{...integration}
								onConnect={handleConnect}
								connectLoader={connectLoader}
							/>
						))}
					</div>
				</section>
				<section className="request-integrations">
					<h2>Which integrations you would like to connect?</h2>
					<div className="request-integrations-grid">
						{filteredRequestIntegrations?.map((integration, index) => (
							<IntegrationRequestCard
								key={index}
								{...integration}
								tenantId={tenantId}
							/>
						))}
					</div>
				</section>
				{/* </>
				) : (
					<div className="shared-integrations">
						<h2>Shared Integrations</h2>
						<p>No shared integrations available</p>
					</div>
				)} */}
			</div>

			<ConnectedIntegrationModel
				isOpen={connectedAccountsModel}
				closeModal={() => setConnectedAccountsModel(false)}
				connectedIntegration={selectedIntegration}
			/>

			<IntegrationConnectModel
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				integration={selectedIntegration}
			/>
		</>
	);
};

export default memo(Integrations);
