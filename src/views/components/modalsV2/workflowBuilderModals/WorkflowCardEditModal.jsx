import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';

const WorkflowCardEditModal = ({ modalIsOpen, closeModalFunc }) => {
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModalFunc} modalType="right">
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{/* header */}
					<div className="workflowHeader">
						<span className="headerTitle">Edit Action</span>
						<div className="closeBtn" onClick={closeModalFunc}>
							<Close />
						</div>
					</div>
					<div className="WorkFlowEditorBody">
						{/* action typ */}
						<div className="actionType">
							<span className="actionTypeTitle">Action Type</span>
							<div className="actiondropDown"> Send Email</div>
						</div>
						{/* email template */}
						<div className="emailTemplate">
							<div className="emailTemplateHeader">
								<span className="emailTemplateNameStyling">Template name</span>
								<div className="editDesignBtn">Edit Design</div>
							</div>
							<div className="emailBodyWrapper">Hello There</div>
						</div>
					</div>

					{/* footer */}
					<div className="workflowEditorFooter">
						<div className="footerSubtitlesContainer">
							<span className="footerSubtitlestext">
								If you need assistance, contact our support team at{' '}
								<span className="supportspecialStyling">support@ve.co</span>
								<br></br>
								Here’s to doing what you love! Let’s do this :)
							</span>
						</div>
						<div className="saveBtn">Save Changes</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(WorkflowCardEditModal);
