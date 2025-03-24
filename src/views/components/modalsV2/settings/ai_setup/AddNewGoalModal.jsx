import { memo, useState } from 'react';
import ReactModal from '../..';
import '../../../../../assets/scss/settings/aiSetup/addNewGoalModal.scss';
import { ReactComponent as CrossMark } from '../../../../../assets/svg/Settings/CrossMark.svg';
import { message } from 'antd';
import Spinner from '../../../loaders/Spinner';

const types = {
	goal: {
		title: 'Goal',
	},
	focus: {
		title: 'Things I need to know',
	},
	memory: {
		title: 'Memory',
	},
};

const AddNewGoalModal = ({
	openAddNewGoalModal,
	closeAddNewGoalModal,
	type,
	onSubmit,
	submitLoading,
}) => {
	const [info, setInfo] = useState({
		goalTitle: '',
		goalDescription: '',
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

	const handleAddGoal = () => {
		const { goalTitle, goalDescription } = info;
		if (type === 'memory') {
			if (!goalDescription) {
				message?.error('Description is required!');
				return;
			}
		} else {
			if (!goalTitle || !goalDescription) {
				message?.error('Title and description are required fields!');
				return;
			}
		}

		onSubmit({
			type,
			...(type !== 'memory' && { heading: goalTitle }),
			description: goalDescription,
		});
	};

	return (
		<ReactModal
			isOpen={openAddNewGoalModal}
			closeModal={closeAddNewGoalModal}
			customStyles={{ overlay: { zIndex: 1003 } }} // to override sidebar z-index
		>
			<div className="addNewGoalModalContainer">
				<header className="header">
					<div className="titleAndSubtitleContainer">
						<h1 className="title">{types[type]?.title}</h1>
						{/* <div className="subTitleContainer">
							<h2 className="subTitle">Things I needs to know</h2>
						</div> */}
					</div>
					<button className="closeButton" onClick={closeAddNewGoalModal}>
						<CrossMark />
					</button>
				</header>
				<main className="main">
					{type !== 'memory' && (
						<input
							onChange={handleSetGoalTitle}
							className="titleInput"
							type="text"
							placeholder="Title"
						/>
					)}
					<textarea
						onChange={handleSetGoalDescription}
						className="descriptionInput"
						placeholder="Description ( e.g. 'Analyze order status for orderId #014872.' )"
					/>
				</main>
				<footer className="footer">
					<button
						className="addGoalButton"
						disabled={submitLoading}
						style={{
							cursor: submitLoading ? 'not-allowed' : 'pointer',
						}}
						onClick={handleAddGoal}
					>
						{submitLoading ? <Spinner width={'16px'} height={'16px'} /> : 'Update'}
					</button>
				</footer>
			</div>
		</ReactModal>
	);
};

export default memo(AddNewGoalModal);
