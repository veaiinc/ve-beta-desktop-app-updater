import { memo, useContext, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as BackIcon } from '../../../../assets/svg/left-arrow.svg';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/seach-magnifier.svg';
import { ReactComponent as LockIcon } from '../../../../assets/svg/notesPage/lock-icon.svg';
import { ReactComponent as DisconnectIcon } from '../../../../assets/svg/disconnect-icon.svg';
import '../../../../assets/scss/integrations/ConnectedCardIntegrationModel.scss';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const customStyles = {
	content: {
		width: '100%',
		height: '60vh',
		maxWidth: '800px',
		background: 'var(--card)',
		borderRadius: '12px',
		padding: '0',
		margin: '0',
		border: 'none',
	},
	overlay: {
		backdropFilter: 'blur(5px)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
};

const formatTimestamp = (timestamp) => {
	if (!timestamp) return '16 Apr, 16:07';
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

	if (diffInHours < 1) return 'Just now';
	if (diffInHours < 24) return `${diffInHours} hours ago`;
	if (diffInHours < 48) return '1 day ago';
	return `${Math.floor(diffInHours / 24)} days ago`;
};

const ConnectedIntegrationModel = ({ isOpen, closeModal, connectedIntegration }) => {
	const [searchQuery, setSearchQuery] = useState('');

	// const {
	// 	profileInfo: { updatedGmailAccount, getAuthUrlForThirdParty },
	// } = useContext(Context);

	// 	try {
	// 		// Set loading state
	// 		setDisconnectingAccountId(account?.uid || account?._id);

	// 		// Determine the integration type from the connected integration data
	// 		const integrationType = connectedIntegration?.connectType || account?.app || 'gmail';

	// 		// Get the account UID for disconnection
	// 		const accountUid = account?.uid || account?._id;

	// 		if (!accountUid) {
	// 			message.error('Account ID not found');
	// 			setDisconnectingAccountId(null);
	// 			return;
	// 		}

	// 		const response = await updatedGmailAccount(integrationType, accountUid);

	// 		if (response?.[0]) {
	// 			message.success('Account disconnected successfully');

	// 			closeModal();
	// 		} else {
	// 			const errorMessage = response?.[1]?.message || 'Failed to disconnect account';
	// 			message.error(errorMessage);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error disconnecting account:', error);
	// 		message.error('Failed to disconnect account');
	// 	} finally {
	// 		setDisconnectingAccountId(null);
	// 	}
	// };

	// Filter accounts based on search query
	const filteredAccounts =
		connectedIntegration?.accounts?.filter(
			(account) =>
				account?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				account?.workspace_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				'Ve.ai Meetings'.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType="center"
			customStyles={customStyles}
		>
			<div className="connected-integration-modal">
				<div className="modal-content-wrapper">
					{/* Header Section */}
					<div className="modal-header">
						<div className="integration-info">
							<BackIcon onClick={closeModal} className="back-icon" />
							<div className="integration-icon-container">
								<img
									src={connectedIntegration?.icon}
									alt={connectedIntegration?.title}
									className="integration-icon"
								/>
							</div>
							<div className="integration-text">
								<h2 className="integration-title">{connectedIntegration?.title}</h2>
								<div className="integration-meta">
									<div className="user-info">
										<span className="user-name">
											{connectedIntegration?.addedBy ||
												connectedIntegration?.accounts?.[0]?.addedBy ||
												'User'}
										</span>
									</div>
									<div className="divider"></div>
									<div className="integration-type">
										<LockIcon className="lock-icon" />
										<span>
											{connectedIntegration?.access === 'shared'
												? 'Shared integration'
												: 'Private integration'}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="header-actions">
							<div className="status-badge connected">
								<span className="status-dot"></span>
								<span className="status-text">Connected</span>
							</div>
							{/* <button
								className="disconnect-button"
								onClick={() =>
									handleDisconnect(connectedIntegration?.accounts?.[0])
								}
								disabled={
									disconnectingAccountId ===
									(connectedIntegration?.accounts?.[0]?.uid ||
										connectedIntegration?.accounts?.[0]?._id)
								}
							>
								{disconnectingAccountId ===
								(connectedIntegration?.accounts?.[0]?.uid ||
									connectedIntegration?.accounts?.[0]?._id) ? (
									'Disconnecting...'
								) : (
									<DisconnectIcon className="disconnect-icon" />
								)}
							</button> */}
						</div>
					</div>

					{/* Search Section */}
					<div className="search-section">
						<div className="search-container">
							<SearchIcon className="search-icon" />
							<input
								type="text"
								placeholder="Search integrations"
								className="search-input"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{/* Table Section */}
					<div className="table-section">
						<div className="table-header">
							<div className="header-row">
								<div className="header-cell page-cell">
									<span>Page</span>
								</div>
								<div className="header-cell status-cell">
									<span>Status</span>
								</div>
								<div className="header-cell last-updated-cell">
									<span>Last updated</span>
								</div>
							</div>
						</div>

						<div className="table-body">
							{filteredAccounts.length === 0 ? (
								<div className="empty-state">
									<span>No accounts found</span>
								</div>
							) : (
								filteredAccounts.map((account, index) => (
									<div key={account._id || index} className="table-row">
										<div className="table-cell page-cell">
											<div className="page-info">
												<div className="page-icon">
													{connectedIntegration?.icon ? (
														<img
															src={connectedIntegration.icon}
															alt={connectedIntegration.title}
															className="integration-icon"
														/>
													) : (
														<div className="icon-placeholder"></div>
													)}
												</div>
												<span className="page-name">
													{account?.email ||
														account?.workspace_name ||
														account?.name ||
														'Unknown Account'}
												</span>
											</div>
										</div>
										<div className="table-cell status-cell">
											<span
												className={`status-text ${
													account?.isActive ? 'active' : 'inactive'
												}`}
											>
												{account?.isActive ? 'Connected' : 'Disconnected'}
												{console.log(account?.isActive)}
											</span>
										</div>
										<div className="table-cell last-updated-cell">
											<span className="last-updated">
												{formatTimestamp(account?.updatedAt)}
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ConnectedIntegrationModel);
