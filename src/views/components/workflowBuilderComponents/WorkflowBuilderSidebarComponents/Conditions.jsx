import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowBuilderSidebarComponents/conditions.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	conditionOptions,
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	MoveStepsOptions,
	selectedValueStyling,
} from '../../../features/workflowBuilder/workflowContantsHelpers';
import { message, Spin } from 'antd';
import Context from '../../../../context/context';

const conditionsList = {
	ifElse: { title: 'If / Else', id: 'ifElse' },
};
const Conditions = ({
	onCLose,
	activeEdge,
	templateId,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
}) => {
	const {
		templates: { addNewSteps, updateStateValues, specificTemplatesInfo, updateSteps },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(conditionsList),
		searchChanged: false,
		activeStage: 'stage1', //stage1, stage2, stage3
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	useEffect(() => {
		if (editMode) {
			setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
		}
	}, [editMode]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};

	const handleDebouce = useCallback(() => {
		clearTimeout(info?.timeout);
		let timeout = setTimeout(() => {
			const filtered = Object.values(conditionsList)?.filter((action) =>
				action.title.toLowerCase().includes(info?.search?.toLowerCase()),
			);
			setInfo((prev) => ({ ...prev, list: filtered }));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.search]);

	const changeStage = useCallback((data = {}) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const createNewConditionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));
			const previousStepId = activeEdge?.split('-')?.[0];

			const payload = {
				stepInput: {
					previousStepId: previousStepId,
					type: 'condition',
					title: data?.title,
					criteria: { status: data?.status },
					moveTo: data?.moveTo,
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
		[info],
	);

	const editConditionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			const payload = {
				updateStepInput: {
					type: 'condition',
					title: data?.title,
					criteria: { status: data?.status },
					stepId: activeStepsData?._id,
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
		[info, activeStepsData],
	);

	const stageMapper = useMemo(() => {
		return {
			stage1: (
				<Stage1
					info={info}
					handleSearch={handleSearch}
					changeStage={changeStage}
					createNewConditionNode={createNewConditionNode}
				/>
			),
			stage2: (
				<Stage2
					changeStage={changeStage}
					info={info}
					createNewConditionNode={createNewConditionNode}
					editMode={editMode}
					activeStepsData={activeStepsData}
					editConditionNode={editConditionNode}
				/>
			),
			// stage3: <Stage3 changeStage={changeStage} info={info} />,
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

export default memo(Conditions);

const Stage1 = ({ info, handleSearch, changeStage }) => {
	const conditionListOnClick = useCallback((data) => {
		if (data?.id === 'ifElse') changeStage({ activeStage: 'stage2' });
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
						placeholder="Search Conditions"
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
						onClick={() => conditionListOnClick(ele)}
					>
						{ele?.title}
					</div>
				))}
			</div>
		</>
	);
};

const Stage2 = ({
	info,
	changeStage,
	createNewConditionNode,
	editMode,
	activeStepsData,
	editConditionNode,
}) => {
	const [stageInfo, setStageInfo] = useState({
		criteria: conditionOptions?.[0],
		title: '',
		moveSteps: MoveStepsOptions?.[0],
	});

	useEffect(() => {
		if (editMode && activeStepsData) {
			const { title, criteria } = activeStepsData;
			let selectedCriteria = null;

			for (let i = 0; i < conditionOptions?.length; i++) {
				if (conditionOptions[i]?.value === criteria?.status) {
					selectedCriteria = conditionOptions[i];
					break;
				}
			}

			setStageInfo((prev) => ({ ...prev, title, criteria: selectedCriteria }));
		}
	}, [editMode, activeStepsData]);

	const onConditionSelection = useCallback(
		(data) => {
			if (data?.value === stageInfo?.priority?.value) {
				return;
			}
			setStageInfo((prev) => ({ ...prev, criteria: data }));
		},
		[stageInfo],
	);

	const onMoveStepsSelection = useCallback(
		(data) => {
			if (data?.value === stageInfo?.moveSteps?.value) {
				return;
			}
			setStageInfo((prev) => ({ ...prev, moveSteps: data }));
		},
		[stageInfo],
	);

	const handleChange = useCallback((e) => {
		setStageInfo((prev) => ({ ...prev, title: e.target.value }));
	}, []);

	const modifiedHandleClick = useCallback(() => {
		if (!stageInfo?.title?.length) {
			return message.error('title is mandatory');
		}
		if (editMode) {
			return editConditionNode({
				title: stageInfo?.title,
				status: stageInfo?.criteria?.value,
			});
		}
		createNewConditionNode({
			title: stageInfo?.title,
			status: stageInfo?.criteria?.value,
			moveTo: stageInfo?.moveSteps?.value,
		});
	}, [stageInfo, editMode]);
	return (
		<div className="createTaskUiContainer">
			<div className="createTasksUi">
				<div className="createTasksHeadingContainer">
					<div className="createHeadingLabelContainer">
						<div className="createTaskHeadingLabel">
							<span className="actionsCreateHeader">Condition</span>
							<span className="createTaskHeading">If / Else</span>
						</div>
						<div
							className="changeActionStageButton"
							onClick={() => changeStage({ activeStage: 'stage1' })}
						>
							Change
						</div>
					</div>
				</div>

				{/* condition title */}
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Add Title</span>
					<textarea
						className="addTaskTitleTextArea"
						placeholder="Add  Title ...."
						value={stageInfo?.title}
						onChange={handleChange}
					/>
				</div>

				{!editMode ? (
					<div className="addTaskTitleContainer">
						<span className="addTaskTitleTextStyle">Move Steps</span>
						<HeadersDropDownComp
							options={MoveStepsOptions}
							showIcon={false}
							containerStyle={{
								...containerStyle,
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{ ...dropDownStyle }}
							dropDownTextStyling={{ ...dropDownTextStyling }}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={stageInfo?.moveSteps}
							selectedValueStyle={{
								...selectedValueStyling,
							}}
							selectedValue={stageInfo?.moveSteps?.label || ''}
							onChangeFunc={onMoveStepsSelection}
						/>
					</div>
				) : (
					''
				)}

				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Criteria</span>
					<HeadersDropDownComp
						options={conditionOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={stageInfo?.criteria}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
						selectedValue={stageInfo?.criteria?.label || ''}
						onChangeFunc={onConditionSelection}
					/>
				</div>
			</div>
			{editMode ? (
				<div className="actionsSaveButton" onClick={modifiedHandleClick}>
					{info?.saveLoader ? <Spin /> : 'Update'}
				</div>
			) : (
				<div className="actionsSaveButton" onClick={modifiedHandleClick}>
					{info?.saveLoader ? <Spin /> : 'Save'}
				</div>
			)}
		</div>
	);
};
