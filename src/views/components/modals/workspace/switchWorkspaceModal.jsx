import React, { useState, useEffect, memo } from 'react';
import Modal from 'react-modal';
import '../../../../assets/scss/workspaceSettings/switchWorkspaceModal.scss';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		background: 'rgba(0, 0, 0, 0.4)',
	},
	overlay: {
		background: 'rgba(0, 0, 0, 0.40)',
		backdropFilter: 'blur(4px)',
	},
};

const SwitchWorkspaceModal = ({ open, closeModal }) => {
	return (
		<div>
			<Modal isOpen={open} onRequestClose={closeModal} style={customStyles}>
				<div className="switchWorkspacModalContainer">hello</div>
			</Modal>
		</div>
	);
};

export default memo(SwitchWorkspaceModal);
