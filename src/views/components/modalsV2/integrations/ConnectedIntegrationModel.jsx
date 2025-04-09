import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as BackIcon } from '../../../../assets/svg/left-arrow.svg';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/scss/integrations/ConnectedCardIntegrationModel.scss';

const customStyles = {
	content: {
		width: '100%',
		height: '80vh',
		maxWidth: '1440px',
		background: 'var(--background-color, #0C0C0D)',
		borderRadius: '12px',
		padding: '0',
		margin: '0',
		border: 'none',
	},
	overlay: {
		backgroundColor: 'var(--card)',
		backdropFilter: 'blur(5px)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
};

const ConnectedIntegrationModel = ({ isOpen, closeModal, connectedIntegration }) => {
	const navigate = useNavigate();

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType="center"
			customStyles={customStyles}
		>
			<div className="connected-integration-modal">
				<div className="modal-content-wrapper">
					<div className="modal-header">
						<div className="integration-info">
							<BackIcon onClick={closeModal} />
							<img
								src={connectedIntegration?.icon}
								alt={connectedIntegration?.title}
								className="integration-icon"
							/>
							<div className="integration-text">
								<h2>{connectedIntegration?.title}</h2>
								<p>
									Enhance Team Collaboration with {connectedIntegration?.title}{' '}
									Integration
								</p>
							</div>
						</div>
					</div>

					<div className="modal-content">
						{/* <div className="section-header">
							<h3>Connect {connectedIntegration?.title} Workspaces</h3>
							<div className="add-workspace-btn">
								<span>+</span> Connect Account
							</div>
						</div> */}

						<div className="accounts-list">
							{connectedIntegration?.accounts?.map((account, index) => (
								<div key={index} className="account-item">
									<div className="account-info">
										<span className="account-name">
											{account?.email || account?.workspace_name}
										</span>
										<span className={`status ${account?.isActive}`}>
											{account?.isActive === true || account.workspace_id
												? 'connected'
												: 'Authentication error'}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ConnectedIntegrationModel);
