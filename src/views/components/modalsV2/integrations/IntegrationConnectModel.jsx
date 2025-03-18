import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as BackIcon } from '../../../../assets/svg/landingScreen/right-arrow-white.svg';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/scss/integrations/integrationModel.scss';

const IntegrationConnectModel = ({ isOpen, closeModal, integration }) => {
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
			<div className="integration-modal">
				<div className="modal-header">
					<div className="back-button" onClick={closeModal}>
						<BackIcon />
					</div>
					<div className="integration-logo">
						<img
							className="integration-image"
							src={integration?.icon}
							alt={integration?.title}
						/>
					</div>
					<h2 className="integration-title">{integration?.title}</h2>
				</div>

				<div className="connection-flow">
					<div className="flow-step active">
						<span>Connect</span>
					</div>
					<div className="flow-arrow">→</div>
					<div className="flow-step">
						<span>Ready</span>
					</div>
					<div className="flow-arrow">→</div>
					<div className="flow-step">
						<span>Ready</span>
					</div>
				</div>

				<div className="modal-content">
					<p className="description">
						Experience superior search and use your {integration?.title} databases and
						docs as context in your chats.
					</p>
					<button className="connect-button">
						<span className="icon">⚡</span>
						Connect just for me
					</button>
				</div>

				<div className="privacy-notice">
					<h3 className="privacy-notice-title">Permission and Privacy</h3>
					<p className="privacy-notice-description">
						Only you will be able to see content from this integration when connected.
						Sana AI will never use your data for training.
						<a className="privacy-notice-link" href="#">
							Read more
						</a>
					</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(IntegrationConnectModel);
