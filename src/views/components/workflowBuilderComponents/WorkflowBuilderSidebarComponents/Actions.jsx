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
		activeStage: 'stage2', //stage1, stage2, stage3
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

	const stageMapper = useMemo(() => {
		return {
			stage1: <Stage1 info={info} handleSearch={handleSearch} />,
			stage2: <Stage2 />,
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

const Stage1 = ({ info, handleSearch }) => {
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
					<div className="actionListItem" key={index}>
						{ele?.title}
					</div>
				))}
			</div>
		</>
	);
};

const Stage2 = () => {
	return (
		<div className="createTasksUi">
			<div className="createTasksHeadingContainer">
				<div className="createHeadingLabelContainer">
					<div className="createTaskHeadingLabel">
						<span className="actionsCreateHeader">Actions</span>
						<span className="createTaskHeading">Create Tasks</span>
					</div>
					<div className="changeActionStageButton">Change</div>
				</div>
			</div>

			{/* //task title */}
			<div className="addTaskTitleContainer">
				<span className="addTaskTitleTextStyle">Add Task Title</span>
				<textarea className="addTaskTitleTextArea" placeholder="Add Task Title ...." />
			</div>
		</div>
	);
};
