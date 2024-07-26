import React from 'react';
import ReactModal from '../index';
import '../../../../assets/chat/unsendMessageModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/workspaceSettings/modalclose.svg';

const UnsendMessageModal = ({ modalIsOpen, closeModalFunc, handleUnsendMessage }) => {
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModalFunc}>
			<div className="unsendModalParentContainer">
				<div className="headerWrapper">
					<span className="headerQuestion">Do You Want Unsend this Message ?</span>
					<span onClick={closeModalFunc}>
						<Close />
					</span>
				</div>
				<div className="buttonWrapper">
					<div className="cancelBtn" onClick={closeModalFunc}>
						Cancel
					</div>
					<div className="deleteBtn" onClick={handleUnsendMessage}>
						Yes,Unsend
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default UnsendMessageModal;
