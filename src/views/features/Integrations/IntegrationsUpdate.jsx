import React, { useState } from 'react';
import { memo } from 'react';
import '../../../assets/scss/integrations/integrationsUpdate.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import meta from '../../../assets/svg/Settings/meta.svg';
import notion from '../../../assets/svg/Settings/notion.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import paypal from '../../../assets/svg/Settings/paypal.svg';
import square from '../../../assets/svg/Settings/square.svg';
import stripe from '../../../assets/svg/Settings/stripe.svg';
import IntegrationConnectModel from '../../components/modalsV2/integrations/IntegrationConnectModel';
const ConnectedIntegrationCard = ({ icon, title, description }) => {
	return (
		<div className="connected-integration-card">
			<div className="card-left">
				<div className="integration-icon">
					<img src={icon} alt={title} />
				</div>
				<div className="integration-content">
					<h3>{title}</h3>
					<p>{description}</p>
				</div>
			</div>
			<div className="card-right">
				<span className="connected-badge">Connected</span>
			</div>
		</div>
	);
};

const AvailableIntegrationCard = ({ icon, title, description, onConnect }) => {
	return (
		<div className="available-integration-card">
			<div className="integration-icon">
				<img src={icon} alt={title} />
			</div>
			<div className="integration-content">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
			<button
				className="integration-button connect"
				onClick={() => onConnect({ icon, title, description })}
			>
				Connect
			</button>
		</div>
	);
};

const IntegrationRequestCard = ({ icon, title }) => {
	return (
		<div className="integration-request-card">
			<div className="integration-icon">
				<img src={icon} alt={title} />
			</div>
			<h3>{title}</h3>
			<button className="request-button">Request</button>
		</div>
	);
};

const IntegrationsUpdate = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIntegration, setSelectedIntegration] = useState(null);

	const handleConnect = (integration) => {
		setSelectedIntegration(integration);
		setIsModalOpen(true);
	};

	const connectedIntegrations = [
		{
			icon: meta,
			title: 'Meta Leads',
			description: 'Integrate Facebook/Instagram Lead Ads with Ve.',
			isConnected: true,
		},
		{
			icon: notion,
			title: 'Notion',
			description:
				'Connect to Notion to manage tasks, organize projects, and centralize your work.',
			isConnected: true,
		},
	];

	const availableIntegrations = [
		{
			icon: google,
			title: 'Google Actions',
			description:
				'Easily connect with Google to sync your calendar, manage files, and streamline communication.',
			isConnected: false,
		},
		{
			icon: notion,
			title: 'Notion',
			description:
				'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
			isConnected: false,
		},
		{
			icon: googleDrive,
			title: 'Google Actions',
			description:
				'Easily connect to Google Drive to store, share, and access your files directly.',
			isConnected: false,
		},
		{
			icon: slack,
			title: 'Slack',
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

	return (
		<>
			<div className="integrations-update-container">
				<div className="title-container">
					<h1>Integrations</h1>
					<div className="search-container">
						<img src={Search} alt="search" />
						<input type="text" placeholder="Search" />
					</div>
				</div>

				<section className="connected-integrations">
					<h2>Connected Integrations</h2>
					<div className="connected-integrations-list">
						{connectedIntegrations.map((integration, index) => (
							<ConnectedIntegrationCard key={index} {...integration} />
						))}
					</div>
				</section>

				<section className="available-integrations">
					<h2>Available Integrations</h2>
					<div className="integrations-grid">
						{availableIntegrations.map((integration, index) => (
							<AvailableIntegrationCard
								key={index}
								{...integration}
								onConnect={handleConnect}
							/>
						))}
					</div>
				</section>

				<section className="request-integrations">
					<h2>Which integrations you would like to connect?</h2>
					<div className="request-integrations-grid">
						{requestIntegrations.map((integration, index) => (
							<IntegrationRequestCard key={index} {...integration} />
						))}
					</div>
				</section>
			</div>

			<IntegrationConnectModel
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				integration={selectedIntegration}
			/>
		</>
	);
};

export default memo(IntegrationsUpdate);
