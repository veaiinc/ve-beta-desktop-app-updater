import React, { useState, useContext, useEffect } from 'react';
import { memo } from 'react';
import '../../../assets/scss/integrations/integrations.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import meta from '../../../assets/svg/Settings/meta.svg';
import notion from '../../../assets/svg/Settings/notion.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import paypal from '../../../assets/svg/Settings/paypal.svg';
import square from '../../../assets/svg/Settings/square.svg';
import stripe from '../../../assets/svg/Settings/stripe.svg';
import zoho from '../../../assets/svg/Settings/zoho-logo.svg';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
import Context from '../../../context/context';
import { message, Modal } from 'antd';
import ConnectedIntegrationModel from '../../components/modalsV2/integrations/ConnectedIntegrationModel';

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

const AvailableIntegrationCard = ({ icon, title, description, connectType, onConnect }) => {
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

	const handleConnect = (integration) => {
		setSelectedIntegration(integration);
		handleConnectThirdParty(integration?.connectType);
		setIsModalOpen(true);
	};

	const availableIntegrations = [
		{
			icon: google,
			title: 'Google',
			connectType: 'google',
			description:
				'Easily connect with Google to sync your calendar, manage files, and streamline communication.',
			isConnected: false,
		},
		{
			icon: notion,
			title: 'Notion',
			connectType: 'notion',
			description:
				'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
			isConnected: false,
		},
		{
			icon: zoho,
			title: 'Zoho',
			connectType: 'zoho',
			description:
				'Easily connect to Google Drive to store, share, and access your files directly.',
			isConnected: false,
		},
		{
			icon: slack,
			title: 'Slack',
			connectType: 'slack',
			description:
				'Stay connected and streamline communication by integrating with Slack. Receive updates, share insights, and collaborate seamlessly.',
			isConnected: false,
		},
	];

	const requestIntegrations = [
		{
			icon: paypal,
			title: 'PayPal',
		},
		{
			icon: square,
			title: 'Square',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
		{
			icon: stripe,
			title: 'Stripe',
		},
	];
	const [info, setInfo] = useState({
		connectedThirdParties: { google: false, zoho: false, notion: false, slack: false },
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

	const handleConnectThirdParty = async (connectType) => {
		setInfo((prev) => ({
			...prev,
			loader: true,
		}));
		await connectThirdParty(connectType);
	};
	useEffect(() => {
		const fetchConnectedPlatforms = async () => {
			const response = await getConnectedThirdParties();
			console.log('response==>fetchConnectedPlatforms', response);
			if (response?.[0] === true && response?.[1]) {
				const data = response[1];
				console.log('data==>fetchConnectedPlatforms', data);
				setInfo((prev) => ({
					...prev,
					connectedThirdParties: {
						google: data.google || [],
						notion: data.notion || [],
						slack: data.slack || [],
						zoho: data.zoho || [],
					},
				}));
			}
		};
		fetchConnectedPlatforms();
	}, []);

	useEffect(() => {
		if (info?.connectedThirdParties) {
			const platforms = [];

			if (info.connectedThirdParties.google?.length > 0) {
				platforms.push({
					icon: google,
					title: 'Google',
					description:
						'Connected Google accounts for calendar, files, and communication.',
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
			if (info.connectedThirdParties?.length > 0) {
				platforms.push({
					icon: zoho,
					title: 'Zoho',
					description: 'Connected Zoho workspaces for task and project management.',
					accounts: info.connectedThirdParties.zoho,
				});
			}
			if (info.connectedThirdParties?.length > 0) {
				platforms.push({
					icon: slack,
					title: 'Slack',
					description: 'Connected Slack workspaces for task and project management.',
					accounts: info.connectedThirdParties.slack,
				});
			}
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

				{/* <div className="tabs-wrapper">
					<button
						className={`tab-button ${activeTab === 'private' ? 'active' : ''}`}
						onClick={() => setActiveTab('private')}
					>
						Private
					</button>
					<button
						className={`tab-button ${activeTab === 'shared' ? 'active' : ''}`}
						onClick={() => setActiveTab('shared')}
					>
						Shared
					</button>
				</div> */}

				{activeTab === 'private' ? (
					<>
						<section className="connected-integrations">
							<h2>Connected Integrations</h2>
							<div className="connected-integrations-list">
								{connectedPlatforms.map((integration, index) => (
									<ConnectedIntegrationCard
										key={index}
										{...integration}
										onViewAccounts={handleSelectedCardModel}
									/>
								))}
							</div>
						</section>

						<section className="available-integrations">
							<h2>Available Integrations</h2>
							<div className="integrations-grid">
								{availableIntegrations?.map((integration, index) => (
									<AvailableIntegrationCard
										key={index}
										{...integration}
										onConnect={handleConnect}
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
					</>
				) : (
					<div className="shared-integrations">
						<h2>Shared Integrations</h2>
						<p>No shared integrations available</p>
					</div>
				)}
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
