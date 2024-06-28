import React, { memo, useCallback } from 'react';
import Modal from 'react-modal';
import '../../../../assets/scss/workspaceSettings/switchWorkspaceModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/workspaceSettings/modalclose.svg';
import { ReactComponent as Selected } from '../../../../assets/svg/workspaceSettings/Selected.svg';
import { ReactComponent as Unselected } from '../../../../assets/svg/workspaceSettings/Unselected.svg';
import { useNavigate } from 'react-router-dom';
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		borderRadius: '40px',
		border: 'none',
		background: '#151515',
		boxShadow: '0px 53px 53px 0px rgba(0, 0, 0, 0.09), 0px 13px 29px 0px rgba(0, 0, 0, 0.10)',
		display: 'flex',
		width: '420px',
		padding: '40px',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: '20px',
	},
	overlay: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(0, 0, 0, 0.40)',
		backdropFilter: 'blur(4px)',
	},
};

const SwitchWorkspaceModal = ({
	open,
	closeModal,
	accessibleWorkspaces,
	activeWorkspaceId,
	// changeWorkspace,
}) => {
	const navigate = useNavigate();
	const handleLogout = useCallback(() => {
		localStorage.clear();
		navigate('/');
	}, []);

	return (
		<Modal isOpen={open} onRequestClose={closeModal} style={customStyles}>
			<div className="switchWorkspaceContentContainer">
				{/* header  */}
				<div className="workspaceHeader">
					<div className="textHolder">
						<span className="headerlabel">Switch Workspace</span>
						<span className="headerSubLabel">Choose or add another account</span>
					</div>
					<span onClick={closeModal}>
						<Close />
					</span>
				</div>
				{/* content */}
				<div className="contentContainer">
					{accessibleWorkspaces?.map((ele, index) => (
						<div
							className="workspaceCard"
							key={index}
							onClick={() => {
								closeModal();
								localStorage.setItem('workspaceId', ele);
								window.location.reload();
							}}
						>
							<div className="workspaceDetailsContainer">
								<span className="workspaceDetailsLabel">{ele}</span>
								<span className="workspaceDetailsSubLabel">Admin</span>
							</div>
							{ele === activeWorkspaceId ? <Selected /> : <Unselected />}
						</div>
					))}
				</div>
			</div>
			<div className="seperator"></div>
			<div
				className="switchWorkspaceModalFooter"
				onClick={() => navigate('/create-workspace')}
			>
				<span className="newWorkspace">New Workspace</span>
				<span onClick={handleLogout} className="logoutContainer">
					Logout
				</span>
			</div>
		</Modal>
	);
};

export default memo(SwitchWorkspaceModal);
