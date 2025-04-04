import { memo, useState, useEffect } from 'react';
import ReactModal from '../..';
import '../../../../../assets/scss/settings/aiSetup/addNewGoalModal.scss';
import { ReactComponent as CrossMark } from '../../../../../assets/svg/Settings/CrossMark.svg';
import { message } from 'antd';
import Spinner from '../../../loaders/Spinner';
import InputComponent from '../../../ai_assistant/InputComponent';
import TextareaComponent from '../../../ai_assistant/TextareaComponent';
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
	editSelectedData,
}) => {
	const [info, setInfo] = useState({
		goalTitle: '',
		goalDescription: '',
	});

	useEffect(() => {
		setInfo({
			goalTitle: editSelectedData?.heading || '',
			goalDescription: editSelectedData?.description || '',
		});
	}, [editSelectedData]);

	useEffect(() => {
		return () => {
			setInfo({
				goalTitle: '',
				goalDescription: '',
			});
		};
	}, []);

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

		const response = await onSubmit({
			type,
			...(type !== 'memory' && { heading: goalTitle }),
			description: goalDescription,
		});
		if (response) {
			setInfo((prev) => ({
				...prev,
				goalTitle: '',
				goalDescription: '',
			}));
		}
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
					</div>
					<button className="closeButton" onClick={closeAddNewGoalModal}>
						<CrossMark />
					</button>
				</header>
				<main className="main">
					{type !== 'memory' && (
						<InputComponent
							placeholder="Title"
							value={info?.goalTitle}
							onChange={handleSetGoalTitle}
							className="titleInput"
							placeholderStyles={{
								backgroundColor: 'var(--card)',
							}}
						/>
					)}
					<TextareaComponent
						placeholder="Description"
						value={info?.goalDescription}
						onChange={handleSetGoalDescription}
						className="descriptionInput"
						placeholderStyles={{
							backgroundColor: 'var(--card)',
						}}
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
