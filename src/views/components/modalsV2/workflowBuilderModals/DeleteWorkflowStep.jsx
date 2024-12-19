import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/deleteWorkflowStep.scss';
import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warnings.svg';
import Spinner from '../../loaders/Spinner';

const DeleteWorkflowStep = ({ modalIsOpen, closeModal, deleteWorkFlowStep, deleteLoader }) => {
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className="deleteWorkflowStepContainer" style={{ color: 'red' }}>
				<Warning />

				<div className="deleteContent">
					<span className="deleteStepHeading">Delete Email?</span>
					<span className="deleteStepSubText">
						Are you sure you want to delete this email?
					</span>
				</div>

				<div className="deleteStepBtnContainer">
					<div className="cancelBtn" onClick={closeModal}>
						Cancel
					</div>
					<div className="deleteWorkflowStepBtn" onClick={deleteWorkFlowStep}>
						{deleteLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
						{deleteLoader ? 'Deleting ..' : 'Delete '}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DeleteWorkflowStep);
