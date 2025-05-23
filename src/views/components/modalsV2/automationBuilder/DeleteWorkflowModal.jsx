import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/deleteWorkflow.scss';
import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warnings.svg';
import Spinner from '../../loaders/Spinner';

const DeleteWorkflowModal = ({ modalIsOpen, closeModal, deleteWorkflowFunc, deleteLoader }) => {
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className="deleteWorkflowStepContainer" style={{ color: 'red' }}>
				<Warning />

				<div className="deleteContent">
					<span className="deleteStepHeading">Delete this Workflow?</span>
					<span className="deleteStepSubText">
						Doing this cannot be undone and all the leads in this workflow would be
						lost.
					</span>
				</div>

				<div className="deleteStepBtnContainer">
					<div className="cancelBtn" onClick={closeModal}>
						Cancel
					</div>
					<div className="deleteWorkflowStepBtn" onClick={deleteWorkflowFunc}>
						{deleteLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
						{deleteLoader ? 'Deleting ..' : 'Delete Workflow'}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DeleteWorkflowModal);
