/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/actions.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { useCallback } from 'react';
import Context from '../../../../context/context';
import { message, Spin } from 'antd';
import Person from '../../tasks/listView/Person';
import GetDraft from './GetDraft';
import VariableComponent from './VariableComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import moment from 'moment';
import CreateFile from './CreateFile';
import CreateTask from './CreateTask';
import HeaderComponent from './HeaderComponent';

const actionsList = {
	tasks: { title: 'Create Tasks' },
	// meeting: { title: 'Create Meeting' },
};

const actionGroups = [
	{
		_id: 'inApp',
		groupName: 'In App',
		icon: null,
		actions: [
			{
				actionLabel: 'Create Document',
				actionType: 'createForm',
			},
			{
				actionLabel: 'Create Task',
				actionType: 'createTask',
			},
		],
	},
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

	const addNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			const previousStepId = activeEdge?.split('-')?.[0];
			const previousStepPath = activeEdge?.split('-')?.[2] || null;

			const payload = {
				type: 'action',
				app: 'inApp',
				isEnabled: true,
				previousStepId,
				...(previousStepPath && { previousStepPath }),
				...data,
			};
			const response = await addStep(automationId, payload);
			if (response?.[0]) {
				onCLose();
			} else {
				message.error('Failed to add step');
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[info?.saveLoader, activeEdge, automationId, onCLose, addStep],
	);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const actionMapper = useMemo(() => {
		return {
			createForm: (
				<CreateFile
					onBack={() => updateInfo({ actionType: '' })}
					onSave={addNode}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
				/>
			),
			createTask: (
				<CreateTask
					onBack={() => updateInfo({ actionType: '' })}
					onSave={addNode}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
				/>
			),
		};
	}, [updateInfo, addNode, info?.saveLoader, variables]);

	return (
		<div className="actionSidebarComponents">
			{info?.actionType ? (
				actionMapper?.[info?.actionType]
			) : (
				<>
					<HeaderComponent
						onBack={() => {
							if (info?.actionType) {
								updateInfo({ actionType: '' });
							} else {
								onCLose();
							}
						}}
						heading="Actions"
					/>
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
					<div className="actionGroupsContainer">
						{actionGroups?.map((ele, index) => (
							<div className="actionGroupItem" key={index}>
								<h3>{ele?.groupName}</h3>
								{ele?.actions?.map((action, index) => (
									<div
										className="actionItem"
										key={index}
										onClick={() =>
											updateInfo({ actionType: action?.actionType })
										}
									>
										<div className="actionItemIcon">{ele?.icon}</div>
										<div className="actionItemLabel">{action?.actionLabel}</div>
									</div>
								))}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Actions);

// const Stage1 = ({ info, handleSearch, changeStage, updateInfo }) => {
// 	return (

// 	);
// };

const Stage3 = ({ changeStage, createNewActionNode }) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		loading: false,
	});
	const updateInfoState = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	return (
		<div className="createMeetingContainer">
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Create Meeting"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfoState}
			/>
			<div className="createMeetingUiContainer">
				<h1 className="createMeetingInputHeading">Inputs</h1>
				<div className="createMeetingInputItem">
					<span className="addTaskTitleTextStyle">Title</span>
					<VariableComponent onChange={(value) => updateInfoState({ title: value })} />
				</div>
				<div className="createMeetingInputItem">
					<span className="addTaskTitleTextStyle">Title</span>
					<VariableComponent onChange={(value) => updateInfoState({ title: value })} />
				</div>
				<div className="createMeetingInputItem">
					<span className="addTaskTitleTextStyle">Title</span>
					<VariableComponent
						onChange={(value) => updateInfoState({ title: value })}
						type="datetime-local"
					/>
				</div>
				<div className="createMeetingInputItem">
					<span className="addTaskTitleTextStyle">Title</span>
					<VariableComponent
						onChange={(value) => updateInfoState({ title: value })}
						type="datetime-local"
					/>
				</div>
			</div>
			<button className="actionsSaveButton" onClick={() => {}}>
				{info?.loading ? <Spin /> : 'Save'}
			</button>
		</div>
	);
};
