import React, { memo, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowBuilderSidebarComponents/actions.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { useCallback } from 'react';

const actionsList = {
	tasks: { title: 'Create Tasks' },
	meeting: { title: 'Create Meeting' },
};
const Actions = ({ onCLose }) => {
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(actionsList),
		searchChanged: false,
		activeStage: 'stage1', //stage1, stage2, stage3
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};

	const handleDebouce = useCallback(() => {
		clearTimeout(info?.timeout);
		let timeout = setTimeout(() => {
			const filtered = Object.values(actionsList)?.filter((action) =>
				action.title.toLowerCase().includes(info?.search?.toLowerCase()),
			);
			setInfo((prev) => ({ ...prev, list: filtered }));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.search]);

	const changeStage = useCallback((data = {}) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const stageMapper = useMemo(() => {
		return {
			stage1: <Stage1 info={info} handleSearch={handleSearch} changeStage={changeStage} />,
			stage2: <Stage2 changeStage={changeStage} info={info} />,
			stage3: <Stage3 changeStage={changeStage} info={info} />,
		};
	}, [info, handleSearch]);

	return (
		<div className="actionSidebarComponents">
			<div className="actionSidebarComponentsHeader">
				<span onClick={onCLose} style={{ cursor: 'pointer' }}>
					<DoubleArrow />
				</span>
			</div>
			{stageMapper?.[info?.activeStage]}
		</div>
	);
};

export default memo(Actions);

const Stage1 = ({ info, handleSearch, changeStage }) => {
	const actionListOnClick = useCallback((data) => {
		if (data?.title === 'Create Tasks') {
			changeStage({ activeStage: 'stage2' });
		}
		if (data?.title === 'Create Meeting') {
			changeStage({ activeStage: 'stage3' });
		}
	}, []);
	return (
		<>
			<div className="actionSideBarSearchbarContainer">
				<div className="actionSidebarSearch">
					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
						<Search />
					</span>
					<input
						className="actionSideBarSearchInput"
						placeholder="Search Actions"
						value={info?.search}
						onChange={handleSearch}
					/>
				</div>
			</div>

			<div className="actionsListContainer">
				{info?.list?.map((ele, index) => (
					<div
						className="actionListItem"
						key={index}
						onClick={() => actionListOnClick(ele)}
					>
						{ele?.title}
					</div>
				))}
			</div>
		</>
	);
};

const Stage2 = ({ info, changeStage }) => {
	return (
		<div className="createTaskUiContainer">
			<div className="createTasksUi">
				<div className="createTasksHeadingContainer">
					<div className="createHeadingLabelContainer">
						<div className="createTaskHeadingLabel">
							<span className="actionsCreateHeader">Actions</span>
							<span className="createTaskHeading">Create Tasks</span>
						</div>
						<div
							className="changeActionStageButton"
							onClick={() => changeStage({ activeStage: 'stage1' })}
						>
							Change
						</div>
					</div>
				</div>

				{/* //task title */}
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Add Task Title</span>
					<textarea className="addTaskTitleTextArea" placeholder="Add Task Title ...." />
				</div>
			</div>
			<div className="actionsSaveButton">Save</div>
		</div>
	);
};

const Stage3 = ({ info, changeStage }) => {
	return (
		<div className="createTaskUiContainer">
			<div className="createTasksUi">
				<div className="createTasksHeadingContainer">
					<div className="createHeadingLabelContainer">
						<div className="createTaskHeadingLabel">
							<span className="actionsCreateHeader">Actions</span>
							<span className="createTaskHeading">Create Meeting</span>
						</div>
						<div
							className="changeActionStageButton"
							onClick={() => changeStage({ activeStage: 'stage1' })}
						>
							Change
						</div>
					</div>
				</div>

				{/* //task title */}
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Add Meeting Title</span>
					<textarea
						className="addTaskTitleTextArea"
						placeholder="Add Meeting Title ...."
					/>
				</div>
			</div>
			<div className="actionsSaveButton">Save</div>
		</div>
	);
};
