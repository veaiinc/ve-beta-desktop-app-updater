import { memo } from 'react';
import Spinner from '../../components/loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';
import Service from '../../../services/index';
import jwtDecode from 'jwt-decode';
import google from '../../../assets/svg/Settings/google.svg';
import { availableIntegrations } from './integrationsData';

const TABLE_COLUMNS = [
	{ key: 'name', label: 'Name', width: 200 },
	{ key: 'status', label: 'Connection status', width: 200 },
	{ key: 'assets', label: 'Assets', width: 166 },
	{ key: 'access', label: 'Access', width: 165 },
	{ key: 'addedBy', label: 'Added by', width: 166 },
];

export const ConnectedIntegrationTable = memo(({ connectedPlatforms, onViewAccounts, loading }) => {
	const handleRowClick = (platform) => {
		onViewAccounts(platform.accounts, platform);
	};

	const handleKeyDown = (event, platform) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleRowClick(platform);
		}
	};

	return (
		<div className="connected-integrations-table">
			<div className="table-header">
				<div className="header-row">
					{TABLE_COLUMNS.map((column) => (
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
							onClick={() => handleRowClick(platform)}
							onKeyDown={(e) => handleKeyDown(e, platform)}
							tabIndex={0}
							role="button"
							aria-label={`View details for ${platform.title} integration`}
						>
							<div className="table-cell name-cell">
								<div className="integration-info">
									<img
										src={platform.icon}
										alt={`${platform.title} icon`}
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
									aria-label={`Status: ${
										platform.isActive ? 'Active' : 'Inactive'
									}`}
								>
									{platform.isActive ? 'Active' : 'Disconnected'}
								</span>
							</div>
							<div className="table-cell assets-cell">
								<span aria-label={`${platform.syncedCount || 0} assets synced`}>
									{platform.syncedCount || 0}
								</span>
							</div>
							<div className="table-cell access-cell">
								<span aria-label={`Access level: ${platform.access || 'Private'}`}>
									{platform.access
										? platform.access.charAt(0).toUpperCase() +
										  platform.access.slice(1)
										: 'Private'}
								</span>
							</div>
							<div className="table-cell added-by-cell">
								<span
									aria-label={`Added by: ${
										platform.addedBy || platform.email || 'Unknown'
									}`}
								>
									{platform.addedBy || platform.email || '-'}
								</span>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
});

ConnectedIntegrationTable.displayName = 'ConnectedIntegrationTable';

export const AvailableIntegrationCard = memo(
	({
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

		// For private filter: disable if connected, for shared filter: always allow
		const shouldDisable = activeTab === 'private' ? isConnected : false;
		const isLoading = connectLoader?.loader && connectLoader?.title === title;

		const handleConnectClick = () => {
			if (shouldDisable) {
				message.info('Already connected');
			} else {
				onConnect({ icon, title, description, connectType });
			}
		};

		const handleKeyDown = (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				handleConnectClick();
			}
		};

		return (
			<div className="available-integration-card">
				<div className="card-content">
					<div className="integration-header">
						<div className="integration-icon-wrapper">
							<img src={icon} alt={`${title} icon`} className="integration-icon" />
						</div>
						<div className="integration-details">
							<h3 className="integration-title">{title}</h3>
							<p className="integration-description">{description}</p>
						</div>
					</div>
					<button
						className={`connect-button ${shouldDisable ? 'connected' : ''}`}
						onClick={handleConnectClick}
						onKeyDown={handleKeyDown}
						disabled={shouldDisable || isLoading}
						aria-label={`${
							shouldDisable ? 'Already connected to' : 'Connect to'
						} ${title}`}
					>
						{isLoading ? (
							<>
								<Spinner />
								<span>Connecting...</span>
							</>
						) : shouldDisable ? (
							'Connected'
						) : (
							'Connect'
						)}
					</button>
				</div>
			</div>
		);
	},
);

AvailableIntegrationCard.displayName = 'AvailableIntegrationCard';

export const IntegrationRequestCard = memo(({ iconSlug, title, tenantId }) => {
	const handleRequestThisIntegration = async (appName) => {
		const path =
			'/veai/67fe3e600c94e176a4caa277/67fe3e600c94e176a4caa278/67fe3e6bfb3b5c663744bc78';
		const token = localStorage.getItem('usertoken');
		const workspaceId = localStorage.getItem('workspaceId');
		const userId = jwtDecode(token)?.user_id;
		const username = jwtDecode(token)?.userName;

		if (!token || !workspaceId || !userId || !username) {
			message.error('Missing required user information');
			return;
		}

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

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleRequestThisIntegration(title);
		}
	};

	return (
		<div className="integration-request-card">
			<div className="card-content">
				<div className="integration-info">
					{iconSlug ? (
						<div className="integration-icon">
							<img
								src={`https://cdn.simpleicons.org/${iconSlug}`}
								alt={`${title} icon`}
							/>
						</div>
					) : (
						<div
							className="integration-icon-placeholder"
							aria-label={`No icon available for ${title}`}
						></div>
					)}
					<h3 className="integration-title">{title}</h3>
				</div>
				<button
					className="request-button"
					onClick={() => handleRequestThisIntegration(title)}
					onKeyDown={handleKeyDown}
					aria-label={`Request integration for ${title}`}
				>
					Request
				</button>
			</div>
		</div>
	);
});

IntegrationRequestCard.displayName = 'IntegrationRequestCard';
