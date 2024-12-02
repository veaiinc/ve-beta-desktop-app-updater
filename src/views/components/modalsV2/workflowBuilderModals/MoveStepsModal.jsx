import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/workflowBuilder/moveSteps.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const MoveStepsModal = ({ modalIsOpen, closeModal, updateStepsPath }) => {
	const actionClickHandler = useCallback((type) => {
		updateStepsPath(type);
		closeModal();
	}, []);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className="moveStepsConditionalModalParentContainer">
				<div className="modalHeaderContainer">
					<span className="modalHeaderContainerText">Choose where to move steps</span>
					<span className="closeBtnWrapper" onClick={closeModal}>
						<Close />
					</span>
				</div>
				<span className="subTitleTextStyling">
					There are 6 steps after this condition. Where would you like to move them?
				</span>

				<div className="actionBtnContainerForMoveSteps">
					<div className="moveToYesBtn" onClick={() => actionClickHandler('yes')}>
						Move steps to YES branch
					</div>
					<div className="moveToNoBtn" onClick={() => actionClickHandler('no')}>
						Move steps to NO branch
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(MoveStepsModal);
