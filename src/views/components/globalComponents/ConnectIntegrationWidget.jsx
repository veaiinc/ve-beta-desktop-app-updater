// import React from 'react';
import '../../../assets/scss/globalComponents/ConnectIntegrationWidget.scss';
import availableIntegrationslist from '../../../helpers/availableIntegrationslist.js';
import { useNavigate } from 'react-router-dom';

const ConnectIntegrationWidget = ({ integrationType, buttonText }) => {
	const navigate = useNavigate();

	const integration = availableIntegrationslist.find(
		(integration) => integration.connectType === integrationType,
	);

	if (!integration) {
		return null;
	}

	const handleConnect = () => {
		console.log('Connecting to:', integration.title);
		integration.isConnected = true;
	};

	return (
		<div className="connectIntegration">
			<div className="connectIntegrationContainer">
				<div className="connectIntegrationHeader">
					<img
						src={integration.icon}
						alt={integration.title}
						className="connectIntegrationIcon"
					/>
					<div className="connectIntegrationTitle">{integration.title}</div>
				</div>
				<div className="connectIntegrationDescription">{integration.description}</div>
				<div
					className={`connectIntegrationButton ${
						integration.isConnected ? 'connected' : ''
					}`}
					onClick={() => navigate(`/settings/integrations`)}
				>
					{buttonText}
				</div>
			</div>
		</div>
	);
};

export default ConnectIntegrationWidget;
