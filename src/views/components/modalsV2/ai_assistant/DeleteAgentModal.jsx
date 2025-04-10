import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/scss/ai_assistant/modal/deleteAgentModal.scss';
import { ReactComponent as Warning } from '../../../../assets/svg/worflow_builder/warning.svg';
import ReactModal from '../../modalsV2/index';
import Spinner from '../../loaders/Spinner';

const DeleteAgentModal = ({ open, closeModal, deleteChatBot, deleteConversations }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		loader: false,
	});

	const handleDeleteChatBot = useCallback(async () => {
		try {
			setInfo((prev) => ({ ...prev, loader: true }));
			await deleteChatBot();
		} finally {
			modyfyClose();
		}
	}, []);
	const handleDeleteConversations = useCallback(async () => {
		try {
			setInfo((prev) => ({ ...prev, loader: true }));
			await deleteConversations();
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
			<div className="deleteAgentModalContainer">
				<div className="header">
					<span>Delete</span>
					<button className="closeButton" onClick={modyfyClose}>
						×
					</button>
				</div>

				<div className="contentSection">
					<div className="deleteAllConversations">
						<h3>Delete All Conversations</h3>
						<p>
							Once you delete all your conversations, there is no going back. Please
							be certain. All the conversations on this chatbot will be deleted.
						</p>
						<div className="deleteButtonContainer">
							<div className="warningText">
								<Warning />
								<span>This action is not reversible</span>
							</div>
							<button
								className="deleteButton"
								onClick={handleDeleteConversations}
								disabled={info?.loader}
							>
								{info?.loader ? <Spinner size={20} /> : 'Delete'}
							</button>
						</div>
					</div>

					<div className="deleteChatbot">
						<h3>Delete Chatbot</h3>
						<p>
							Once you delete your chatbot, there is no going back. Please be certain.
							All your uploaded data will be deleted.
						</p>
						<div className="deleteButtonContainer">
							<div className="warningText">
								<Warning />
								<span>This action is not reversible</span>
							</div>
							<button
								className="deleteButton"
								onClick={handleDeleteChatBot}
								disabled={info?.loader}
							>
								{info?.loader ? <Spinner size={20} /> : 'Delete'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default DeleteAgentModal;
