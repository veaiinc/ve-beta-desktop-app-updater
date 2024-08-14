import React, { memo } from 'react';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warning.svg';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/exitWithoutPublishingModal.scss';
import { useNavigate } from 'react-router-dom';
const ExitWithoutPublishingModal = ({ open, closeModal }) => {
	const navigate = useNavigate();
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="ExitWithoutPublishingModal">
				<Warning />
				<div className="modalSubTextContaiener">
					<span className="modalSubHeaderText">Exit without Update ? </span>
					<span className="modalSubText">
						Your changes were saved automatically. But, to apply the changes and use the
						latest version, you need to update the template.
					</span>
				</div>
				<div className="actionBtnContainer">
					<span className="backtoEdit" onClick={closeModal}>
						Back to Edit
					</span>
					<span
						className="exitWithoutUpdate"
						onClick={() => {
							closeModal();
							navigate(-1);
						}}
					>
						Exit without Update
					</span>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ExitWithoutPublishingModal);
