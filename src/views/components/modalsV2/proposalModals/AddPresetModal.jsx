import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/smartFile/addPresetModal.scss';
const AddPresetModal = ({ modalIsOpen, closeModalFunc }) => {
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModalFunc}>
			<div className="addPresetModalParentContainer"></div>
		</ReactModal>
	);
};

export default memo(AddPresetModal);
