import React, { memo, useEffect, useState } from 'react';
import Modal from '../../';
import '../../../../../assets/scss/settings/aiSetup.scss';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import Workflows from '../../../settings/ai_setup/Workflows';

const AssignAiAssistantModal = ({
	isOpen,
	toggleModal,
	// getMyWorkflowTemplatesData,
	myWorkflows,
	info,
	activeAiAssistantDetails,
}) => {
	const [workflows, setWorkflows] = useState([]);

	useEffect(() => {
		if (myWorkflows) {
			setWorkflows(myWorkflows?.data);
		}
	}, [myWorkflows]);

	useEffect(() => {
		console.log('workflows', workflows);
	}, [workflows]);

	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="assign-ai-assistant-modal-container">
				<div className="titleAndCloseBtnContainer">
					<h1 className="title">
						Assign AI Assistant <CrossGrey className="closeBtn" onClick={toggleModal} />
					</h1>
				</div>
				<Workflows
					allowWorkflowsSelection={true}
					selectedWorkflows={info?.selectedWorkflows}
					info={{ workflows }}
					hideRemove={true}
				/>
				<div className="assignBtn">Assign to {activeAiAssistantDetails?.name}</div>
			</div>
		</Modal>
	);
};

export default memo(AssignAiAssistantModal);
