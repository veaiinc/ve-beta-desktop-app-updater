import React, { memo, useCallback } from 'react';

import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warning.svg';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/sales/smartFile/acceptAiGeneratedValues.scss';

const AcceptAiGeneratedValues = ({ open, closeModal, acceptAiChanges }) => {
	const modifiedAccpetChanges = useCallback(() => {
		closeModal();
		acceptAiChanges();
	}, [closeModal, acceptAiChanges]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="AcceptAiGeneratedValues">
				<Warning />
				<div className="modalSubTextContaiener">
					<span className="modalSubText">
						On Editing , AI Generated values will get automatically accepted.
					</span>
				</div>
				<div className="actionBtnContainer">
					<span className="backtoEdit" onClick={closeModal}>
						cancel
					</span>
					<span
						className="exitWithoutUpdate"
						onClick={modifiedAccpetChanges}
						style={{ backgroundColor: '#6055ec', color: '#e4e5e6' }}
					>
						Yes,Accept
					</span>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AcceptAiGeneratedValues);
