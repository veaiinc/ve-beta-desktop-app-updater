import { memo } from 'react';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import Modal from '../../';

const CreateNewAiModal = memo(({ isOpen, toggleModal }) => {
	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="CreateNewAiModalContainer">
				<div className="titleAndCloseBtnContainer">
					<h1 className="title">
						Create new AI Assistant
						<CrossGrey className="closeBtn" onClick={toggleModal} />
					</h1>
				</div>
				<div className="nameContainer">
					<h1>Name</h1>
					<input type="text" placeholder="Type here..." />
				</div>
				<div className="createBtn">Create</div>
			</div>
		</Modal>
	);
});

export default memo(CreateNewAiModal);
