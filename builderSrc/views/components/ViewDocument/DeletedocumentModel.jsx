import React, { memo, useState, useCallback } from 'react';
import ReactModal from '../../components/ui-components/modal';
import { ReactComponent as Warning } from '../../../assets/svg/smartFile/warning.svg';
import '../../../assets/scss/document/deleteModel.scss';
import Spinner from '../loaders/Spinner';

const DeleteLeadModal = ({ open, closeModal, deleteLeadFunc }) => {
	const [info, setInfo] = useState({
		loader: false,
	});

	const deleteOnClick = useCallback(async () => {
		try {
			setInfo((prev) => ({ ...prev, loader: true }));
			await deleteLeadFunc();
		} finally {
			modyfyClose();
		}
	}, []);

	const modyfyClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, loader: false }));
		closeModal();
	}, [closeModal]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={modyfyClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="deleteLeadModalParentContainer">
				<Warning />
				<div className="deleteLeadTextContainer">
					<span className="deleteLeadHeaderText">Delete Document</span>
					<span className="deleteLeadSubtext">
						Are you sure you want to delete this Document?<br></br> All data will be lost,
						you cannot undo this operation.
					</span>
				</div>

				<div className="deleteLeadFooterContainer">
					<div className="cancelBtn" onClick={modyfyClose}>
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
