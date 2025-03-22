import { memo, useContext, useState } from 'react';
import ReactModal from '../..';
import '../../../../../assets/scss/settings/aiSetup/addNewGoalModal.scss';
import { ReactComponent as CrossMark } from '../../../../../assets/svg/Settings/CrossMark.svg';
import Context from '../../../../../context/context';
import { message } from 'antd';
import Spinner from '../../../loaders/Spinner';

const AddNewGoalModal = ({ openAddNewGoalModal, closeAddNewGoalModal }) => {
	const {
		aiSetup: { setGoalForAI },
	} = useContext(Context);

	const [info, setInfo] = useState({
		goalTitle: '',
		goalDescription: '',
		addGoalLoading: false,
	});

	const handleSetGoalTitle = (e) => {
		const goalTitle = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			goalTitle,
		}));
	};

	const handleSetGoalDescription = (e) => {
		const goalDescription = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			goalDescription,
		}));
	};

	const handleAddGoal = async () => {
		const { goalTitle, goalDescription } = info;
		if (!goalTitle || !goalDescription) {
			message?.error('Title and description are required fields!');
			return;
		}
		setInfo((prev) => ({ ...prev, addGoalLoading: true }));
		const [success] = await setGoalForAI(goalTitle, goalDescription);
		if (success) {
			closeAddNewGoalModal();
			message?.success('Goal added successfully');
		} else {
			message?.error('Failed to add goal');
		}
		setInfo((prev) => ({ ...prev, addGoalLoading: false }));
	};

	const addGoalBtnDisabled = !info?.goalTitle || !info?.goalDescription;
	const addGoalBtnLoader = info?.addGoalLoading;

	return (
		<ReactModal
			isOpen={openAddNewGoalModal}
			closeModal={closeAddNewGoalModal}
			customStyles={{ overlay: { zIndex: 1003 } }} // to override sidebar z-index
		>
			<div className="addNewGoalModalContainer">
				<header className="header">
					<div className="titleAndSubtitleContainer">
						<h1 className="title">Add New Goal</h1>
						<div className="subTitleContainer">
							<h2 className="subTitle">Things AI needs to know</h2>
						</div>
					</div>
					<button className="closeButton" onClick={closeAddNewGoalModal}>
						<CrossMark />
					</button>
				</header>
				<main className="main">
					<input
						onChange={handleSetGoalTitle}
						className="titleInput"
						type="text"
						placeholder="Title"
					/>
					<textarea
						onChange={handleSetGoalDescription}
						className="descriptionInput"
						placeholder="Description ( e.g. 'Analyze order status for orderId #014872.' )"
					/>
				</main>
				<footer className="footer">
					<button
						className="addGoalButton"
						disabled={addGoalBtnDisabled}
						style={{
							cursor: addGoalBtnDisabled ? 'not-allowed' : 'pointer',
						}}
						onClick={handleAddGoal}
					>
						Add Goal
						{addGoalBtnLoader && <Spinner width={'16px'} height={'16px'} />}
					</button>
				</footer>
			</div>
		</ReactModal>
	);
};

export default memo(AddNewGoalModal);
