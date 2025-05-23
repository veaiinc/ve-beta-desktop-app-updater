import { memo, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import '../../../../../assets/scss/settings/aiSetup.scss';
import Modal from '../../';
import Context from '../../../../../context/context';
import { message } from '../../../globalComponents/CustomToast';

const CreateNewAiModal = ({ isOpen, toggleModal }) => {
	const {
		aiSetup: { createNewAiAssistant },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		name: '',
		isLoading: false,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			name: '',
			isLoading: false,
		}));
	}, [isOpen]);

	const handleCreateNewAiAssistant = async () => {
		if (info?.name === '') {
			message?.error('Please enter a name for your AI Assistant');
			return;
		}
		if (info?.isLoading) return;
		setInfo((prev) => ({ ...prev, isLoading: true }));
		const aiAssistantId = await createNewAiAssistant({
			name: info?.name,
		});
		setInfo((prev) => ({ ...prev, isLoading: false }));
		if (aiAssistantId) {
			navigate(`/settings/ai-setup-page/${aiAssistantId}`);
		} else {
			message?.error('Failed to create AI Assistant! Please try again.');
		}
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
						value={info?.name}
						onChange={(e) => setInfo((prev) => ({ ...prev, name: e?.target?.value }))}
						placeholder="Type here..."
						autoFocus
					/>
				</div>
				<button
					disabled={info?.isLoading}
					style={{
						cursor: info?.isLoading ? 'not-allowed' : 'pointer',
					}}
					className="createBtn"
					onClick={handleCreateNewAiAssistant}
				>
					{info?.isLoading ? 'Creating...' : 'Create'}
				</button>
			</div>
		</Modal>
	);
};

export default memo(CreateNewAiModal);
