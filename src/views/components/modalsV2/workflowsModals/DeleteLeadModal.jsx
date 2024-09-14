import React, { memo, useState, useCallback } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warning.svg';
import '../../../../assets/scss/workflowBuilder/deleteLeadModal.scss';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../loaders/Spinner';
const DeleteLeadModal = ({ open, closeModal, deleteLeadFunc }) => {
	const [info, setInfo] = useState({
		loader: false,
	});

	const deleteOnClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, loader: true }));
		deleteLeadFunc();
	}, []);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="deleteLeadModalParentContainer">
				<Warning />
				<div className="deleteLeadTextContainer">
					<span className="deleteLeadHeaderText">Delete Lead</span>
					<span className="deleteLeadSubtext">
						Are you sure you want to delete this Lead?<br></br> All data will be lost,
						you cannot undo this operation.
					</span>
				</div>

				<div className="deleteLeadFooterContainer">
					<div className="cancelBtn" onClick={closeModal}>
						Cancel
					</div>
					<div className="deleteBtn" onClick={deleteOnClick}>
						{info?.loader ? 'Deleting... ' : 'Delete'}
						{info?.loader ? <Spinner width={'16px'} height={'16px'} /> : ''}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DeleteLeadModal);
