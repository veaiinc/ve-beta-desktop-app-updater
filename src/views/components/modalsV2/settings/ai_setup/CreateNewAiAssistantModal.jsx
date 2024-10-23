import { memo, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import '../../../../../assets/scss/settings/aiSetup.scss';
import Modal from '../../';
import Context from '../../../../../context/context';

const CreateNewAiModal = ({ isOpen, toggleModal }) => {
	const {
		aiSetup: { createNewAiAssistant },
	} = useContext(Context);
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const handleCreateNewAiAssistant = async () => {
		const path = await createNewAiAssistant({
			name,
		});
		navigate(path);
	};

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
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Type here..."
						autoFocus
					/>
				</div>
				<div className="createBtn" onClick={handleCreateNewAiAssistant}>
					Create
				</div>
			</div>
		</Modal>
	);
};

export default memo(CreateNewAiModal);
