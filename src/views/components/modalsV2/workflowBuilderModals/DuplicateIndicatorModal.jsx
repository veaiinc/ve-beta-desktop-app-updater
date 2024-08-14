import React, { memo } from 'react';
import '../../../../assets/scss/workflowBuilder/duplicateIndicator.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import ReactModal from '../../modalsV2/index';
import Spinner from '../../loaders/Spinner';
const DuplicateIndicatorModal = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="duplicateWorkflowContainer">
				<Spinner />
				<span className="duplicateWorkflowContainerHeader">Duplicating Your Template</span>
				<span className="duplicateContainerSubtitle">Just hold on a second ...</span>
			</div>
		</ReactModal>
	);
};

export default memo(DuplicateIndicatorModal);
