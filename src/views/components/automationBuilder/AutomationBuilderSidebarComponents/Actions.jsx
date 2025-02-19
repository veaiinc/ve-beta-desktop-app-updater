/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/actions.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { useCallback } from 'react';
import Context from '../../../../context/context';
import { message, Spin } from 'antd';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import Person from '../../tasks/listView/Person';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	PriorityOptions,
	selectedValueStyling,
	statusOptions,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import GetDraft from './GetDraft';
import VariableComponent from './VariableComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import moment from 'moment';

const actionsList = {
	tasks: { title: 'Create Tasks' },
	meeting: { title: 'Create Meeting' },
};

const actionGroups = [
	{
		_id: 'google',
		groupName: 'Google',
		icon: <Google />,
		actions: [
			{
				actionLabel: 'Get label info',
				actionType: 'getLabelInfo',
			},
			{
				actionLabel: 'Delete draft',
				actionType: 'deleteDraft',
			},
			{
				actionLabel: 'Get draft',
				actionType: 'getDraft',
			},
			{
				actionLabel: 'Create draft',
				actionType: 'createDraft',
			},
		],
	},
];

const Actions = ({
	onCLose,
	templateId,
	activeEdge,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	automationId,
}) => {
	const {
		templates: { addNewSteps, updateStateValues, specificTemplatesInfo, updateSteps },
		automationBuilder: { variables, getAutomation, addStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(actionsList),
		searchChanged: false,
		activeStage: 'stage1', //stage1, stage2, stage3
		saveLoader: false,
		actionType: '',
		previousStepId: '',
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	useEffect(() => {
		if (activeEdge) {
			setInfo((prev) => ({ ...prev, previousStepId: activeEdge?.split('-')?.[0] }));
		}
	}, [activeEdge]);

	useEffect(() => {
		if (editMode && activeStepsData) {
			if (activeStepsData?.actionType === 'createTask') {
				setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
			}
			if (activeStepsData?.actionType === 'createMeeting') {
				setInfo((prev) => ({ ...prev, activeStage: 'stage3' }));
			}
		}
	}, [editMode, activeStepsData]);

	// useEffect(() => {
	// 	if (previousStepResponse && previousStepResponse?.stepId === activeEdge?.split('-')?.[0]) {
	// 		setInfo((prev) => ({ ...prev, actionType: previousStepResponse?.actionType }));
	// 	} else {
	// 		getPreviousStepResponse(activeEdge?.split('-')?.[0], activeEdge?.split('-')?.[0]);
	// 	}
	// }, [previousStepResponse]);

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

	const createNewActionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));
			const previousStepId = activeEdge?.split('-')?.[0];

			const payload = {
				stepInput: {
					actionType: 'createTask',
					previousStepId: previousStepId,
					type: 'action',
					title: data?.title,
					taskInput: {
						...data,
					},
				},
				templateId: templateId,
			};

			const response = await addNewSteps(payload);
			if (response?.[0]) {
				const updatedSmartFileInfo = { ...(specificTemplatesInfo || {}) };
				updatedSmartFileInfo.steps = [...(response?.[1]?.steps || [])];
				updateStateValues({ specificTemplatesInfo: updatedSmartFileInfo });
				onCLose();
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[info?.saveLoader, templateId, activeEdge, specificTemplatesInfo],
	);

	const editActionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));
			const payload = {
				updateStepInput: {
					actionType: 'createTask',
					type: 'action',
					title: data?.title,
					stepId: activeStepsData?._id,
					taskInput: {
						...data,
					},
				},
				templateId: templateId,
			};
			const response = await updateSteps(payload);
			if (response?.[0]) {
				await refetchWorkflowBuilderData();
				onCLose();
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[editMode, activeStepsData],
	);

	const stageMapper = useMemo(() => {
		return {
			stage1: <Stage1 info={info} handleSearch={handleSearch} changeStage={changeStage} />,
			stage2: (
				<Stage2
					changeStage={changeStage}
					info={info}
					createNewActionNode={createNewActionNode}
					editMode={editMode}
					activeStepsData={activeStepsData}
					editActionNode={editActionNode}
					variables={variables}
					automationId={automationId}
					previousStepId={info?.previousStepId}
					onCLose={onCLose}
					getAutomation={getAutomation}
					addStep={addStep}
				/>
			),
			stage3: (
				<Stage3
					changeStage={changeStage}
					info={info}
					createNewActionNode={createNewActionNode}
					variables={variables}
				/>
			),
		};
	}, [info, handleSearch, createNewActionNode, variables, automationId, info?.previousStepId]);

	return (
		<div className="actionSidebarComponents">
			{info?.actionType ? (
				<GetDraft />
			) : (
				<>
					<div className="actionSidebarComponentsHeader">
						<span onClick={onCLose} style={{ cursor: 'pointer' }}>
							<DoubleArrow />
						</span>
					</div>
					{stageMapper?.[info?.activeStage]}
				</>
			)}
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
			<div className="actionGroupsContainer">
				{actionGroups?.map((ele, index) => (
					<div className="actionGroupItem" key={index}>
						<h3>{ele?.groupName}</h3>
						{ele?.actions?.map((action, index) => (
							<div className="actionItem" key={index}>
								<div className="actionItemIcon">{ele?.icon}</div>
								<div className="actionItemLabel">{action?.actionLabel}</div>
							</div>
						))}
					</div>
				))}
			</div>
		</>
	);
};

const Stage2 = ({
	info,
	changeStage,
	createNewActionNode,
	editMode,
	activeStepsData,
	editActionNode,
	variables,
	automationId,
	previousStepId,
	getAutomation,
	addStep,
	onCLose,
}) => {
	const [stageInfo, setStageInfo] = useState({
		task: '',
		dueDate: '',
		assignee: '',
		title: '',
		description: '',
		loading: false,
	});

	useEffect(() => {
		if ((editMode, activeStepsData)) {
			const { title, task } = activeStepsData || {};

			let status = null,
				priority = null;
			for (let i = 0; i < statusOptions?.length; i++) {
				if (statusOptions[i]?.value === task?.status) {
					status = statusOptions[i];
				}
			}
			for (let i = 0; i < PriorityOptions?.length; i++) {
				if (PriorityOptions[i]?.value === task?.priority) {
					priority = PriorityOptions[i];
				}
			}

			setStageInfo((prev) => ({
				...prev,
				title,
				status,
				priority,
			}));
		}
	}, [editMode, activeStepsData]);

	const handleChange = useCallback((e) => {
		setStageInfo((prev) => ({ ...prev, title: e.target.value }));
	}, []);

	// const modifiedHandleClick = useCallback(() => {
	// 	if (!stageInfo?.title?.length) {
	// 		return message.error('title is mandatory');
	// 	}
	// 	if (editMode) {
	// 		return editActionNode({
	// 			title: stageInfo?.title,
	// 			status: stageInfo?.status?.value,
	// 			priority: stageInfo?.priority?.value,
	// 		});
	// 	}
	// 	createNewActionNode({
	// 		title: stageInfo?.title,
	// 		status: stageInfo?.status?.value,
	// 		priority: stageInfo?.priority?.value,
	// 	});
	// }, [stageInfo]);

	const createNewTaskNode = useCallback(async () => {
		const variableRegex = /^\{\{.*\}\}$/;
		let { task, title, description, dueDate } = stageInfo;
		const variables = {};
		if (task?.match(variableRegex)) {
			variables.task = task;
		} else if (!task?.trim().length) {
			message.error('Task name is mandatory');
			return;
		}
		if (!title?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (!description?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (dueDate?.match(variableRegex)) {
			variables.dueDate = dueDate;
		} else if (!dueDate) {
			message.error('Due date is mandatory');
			return;
		} else {
			dueDate = moment(dueDate).unix();
		}

		const payload = {
			title,
			description,
			isEnabled: true,
			previousStepId: previousStepId,
			type: 'createTask',
			createTask: {
				title: task,
				dueDate: dueDate,
			},
		};
		if (Object.keys(variables)?.length) {
			payload.variables = variables;
		}
		updateStageInfo({ loading: true });
		const response = await addStep(automationId, payload);

		if (response?.[0]) {
			onCLose();
			await getAutomation(automationId);
		} else {
			message.error(response?.[1]?.message || 'Failed to add step');
		}

		updateStageInfo({ loading: false });
	}, [stageInfo, automationId, previousStepId, onCLose, getAutomation, addStep]);

	const updateStageInfo = useCallback((data) => {
		setStageInfo((prev) => ({ ...prev, ...data }));
	}, []);
	return (
		<div className="createTaskUiContainer">
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Create Task"
				title={stageInfo?.title}
				description={stageInfo?.description}
				updaterFn={updateStageInfo}
			/>
			<div className="createTasksUi">
				<h2 className="taskInputHeading">Inputs</h2>
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Task</span>
					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateStageInfo({ task: value })}
					/>
				</div>
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Due (optional)</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateStageInfo({ dueDate: value })}
						type="date"
					/>
				</div>
				{/* <div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Assingee (optional)</span>
					<Person
						options={[{ value: 'abbd', label: 'Abbd' }]}
						multiSelect={true}
						value={[
							{ _id: 'abbd', name: 'Abbd' },
							{ _id: 'abbde', name: 'Abbd' },
						]}
						parseValue={true}
						showLabel={true}
					/>
				</div> */}
			</div>

			{/* {editMode ? (
				<div className="actionsSaveButton" onClick={modifiedHandleClick}>
					{info?.saveLoader ? <Spin /> : 'Update'}
				</div>
			) : ( */}
			<button
				className="actionsSaveButton"
				onClick={createNewTaskNode}
				disabled={info?.loading}
			>
				{info?.loading ? <Spin /> : 'Save'}
			</button>
			{/* )} */}
		</div>
	);
};

const Stage3 = ({ info, changeStage, createNewActionNode }) => {
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
