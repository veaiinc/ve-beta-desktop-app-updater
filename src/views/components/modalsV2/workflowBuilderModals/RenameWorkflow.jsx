import React, { memo } from 'react';
import '../../../../assets/scss/workflowBuilder/renameWorkflowModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
const RenameWorkflow = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="renameWorkflowModalParentContainer">
				<div className="renameWorkflowModalHeader">
					<span className="headerTitle">Rename Workflow</span>
					<span className="closeBtnWrapper">
						<Close />
					</span>
				</div>
				<div className="inputActionContainer">
					<span className="inputActionContainerLabel">Add Name</span>
					<input
						type="text"
						placeholder="Type Here ..."
						className="inputActionContainerLabelInput"
					/>
				</div>
				<div className="actionBtnContainer">
					<div className="saveBtn">Save</div>
					<div className="cancelBtn">Cancel</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(RenameWorkflow);
