import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as BackIcon } from '../../../../assets/svg/left-arrow.svg';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/scss/integrations/integrationModel.scss';

const ConnectedIntegrationModel = ({ isOpen, closeModal, connectedIntegration }) => {
	console.log(connectedIntegration);
	const navigate = useNavigate();

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			customStyles={{
				content: {
					width: '100%',
					maxWidth: '600px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					inset: 'auto',
					transform: 'none',
					margin: '2rem',
					backgroundColor: '#1a1a1a',
					borderRadius: '12px',
					padding: '2rem',
				},
				overlay: {
					backdropFilter: 'blur(8px)',
					zIndex: 4,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
				},
			}}
		>
			<div className="connected-integration-modal">
				<div className="modal-header">
					<div className="back-button" onClick={closeModal}>
						<BackIcon />
					</div>
					<h2>Connected Accounts</h2>
				</div>

				<div className="accounts-list">
					{connectedIntegration?.map((account, index) => (
						<div key={index} className="account-item">
							<div className="account-info">
								{account.workspace_name && (
									<h3 className="workspace-name">{account.workspace_name}</h3>
								)}
								{account.name && <h3 className="account-name">{account.name}</h3>}
								{account.email && <p className="account-email">{account.email}</p>}
								{account.owner?.user?.email && (
									<p className="owner-email">{account.owner.user.email}</p>
								)}
							</div>
							<div className="account-status">
								<span className="status-dot"></span>
								<span className="status-text">Connected</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ConnectedIntegrationModel);
