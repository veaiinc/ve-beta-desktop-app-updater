import React, { useState, useContext, useEffect } from 'react';
import { memo } from 'react';
import '../../../assets/scss/integrations/integrations.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../../../assets/svg/Settings/google-calendar-logo.png';
import dropbox from '../../../assets/svg/Settings/drop-box-logo.png';
import meta from '../../../assets/svg/Settings/meta.svg';
import notion from '../../../assets/svg/Settings/notion.svg';
import paypal from '../../../assets/svg/Settings/paypal.svg';
import square from '../../../assets/svg/Settings/square.svg';
import stripe from '../../../assets/svg/Settings/stripe.svg';
import zoho from '../../../assets/svg/Settings/zoho-logo.svg';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../context/context';
import { Modal } from 'antd';
import ConnectedIntegrationModel from '../../components/modalsV2/integrations/ConnectedIntegrationModel';
import Spinner from '../../components/loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';

const ConnectedIntegrationCard = ({ icon, title, description, accounts, onViewAccounts }) => {
	return (
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
					<p className="connected-accounts">{accounts.length} account(s) connected</p>
				</div>
			</div>
			<div className="card-right">
				<span className="connected-dot"></span>
				<span className="connected-badge">Connected</span>
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
				onClick={() => onConnect({ icon, title, description, connectType })}
			>
				Connect
				{connectLoader?.loader && connectLoader?.title === title && <Spinner />}
			</button>
		</div>
	);
};

const IntegrationRequestCard = ({ icon, title }) => {
	return (
		<div className="integration-request-card">
			<div className="card-content">
				<div className="integration-icon">
					<img src={icon} alt={title} className="integraton-image" />
				</div>
				<h3>{title}</h3>
			</div>
			<span className="request-button">Request</span>
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
	const {
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);
	let isAdmin = false;

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
		{
			id: 2,
			icon: notion,
			title: 'Notion',
			connectType: 'notion',
			description:
				'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
			isConnected: false,
		},
		{
			id: 3,
			icon: slack,
			title: 'Slack',
			connectType: 'slack',
			description:
				'Stay connected and streamline communication by integrating with Slack. Receive updates, share insights, and collaborate seamlessly.',
			isConnected: false,
		},
		{
			id: 4,
			icon: googleDrive,
			title: 'Google Drive',
			connectType: 'google-drive',
			description:
				'Easily connect with Google Drive to sync your files and streamline communication.',
			isConnected: false,
		},
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

	const requestIntegrations = [
		{
			id: 1,
			icon: paypal,
			title: 'PayPal',
		},
		{
			id: 2,
			icon: square,
			title: 'Square',
		},
		{
			id: 3,
			icon: stripe,
			title: 'Stripe',
		},
		{
			id: 4,
			icon: stripe,
			title: 'Stripe',
		},
		{
			id: 5,
			icon: stripe,
			title: 'Stripe',
		},
		{
			id: 6,
			icon: stripe,
			title: 'Stripe',
		},
		{
			id: 7,
			icon: stripe,
			title: 'Stripe',
		},
		{
			id: 8,
			icon: stripe,
			title: 'Stripe',
		},
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
		templates: { connectUrl, connectThirdParty, getConnectedThirdParties },
	} = useContext(Context);
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

	return (
		<>
			<div className="integrations-container">
				<div className="title-container">
					<h1 className="integrations-title">Integrations</h1>
					<div className="search-container">
						<img src={Search} alt="search" className="search-image" />
						<input type="text" placeholder="Search" className="search-input" />
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

				{/* {activeTab === 'private' ? (
					<> */}
				{connectedPlatforms.length !== 0 ? (
					<section className="connected-integrations">
						<h2>Connected Integrations</h2>

						<div className="connected-integrations-list">
							{connectedPlatforms.map((integration) => (
								<ConnectedIntegrationCard
									key={integration?.id}
									{...integration}
									onViewAccounts={handleSelectedCardModel}
								/>
							))}
						</div>
					</section>
				) : (
					''
				)}

				<section className="available-integrations">
					<h2>Available Integrations</h2>
					<div className="integrations-grid">
						{availableIntegrations?.map((integration) => (
							<AvailableIntegrationCard
								key={integration?.id}
								{...integration}
								onConnect={handleConnect}
								connectLoader={connectLoader}
							/>
						))}
					</div>
				</section>
				{/* 
						<section className="request-integrations">
							<h2>Which integrations you would like to connect?</h2>
							<div className="request-integrations-grid">
								{requestIntegrations?.map((integration, index) => (
									<IntegrationRequestCard key={index} {...integration} />
								))}
							</div>
						</section> */}
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
