import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/conditions.scss';
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
} from '../../../features/workflow_builder/workflowContantsHelpers';
import { message, Spin } from 'antd';
import Context from '../../../../context/context';
import HeaderComponent from './HeaderComponent';
import IfElse from './IfElse';

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
	automationId,
	// variables,
}) => {
	const {
		templates: { addNewSteps, updateStateValues, specificTemplatesInfo, updateSteps },
		automationBuilder: { variables, addStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(conditionsList),
		searchChanged: false,
		activeScreen: null,
		activeStage: null,
		isLoading: false,
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

	const addConditionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			const previousStepId = activeEdge?.split('-')?.[0];
			const payload = {
				isEnabled: true,
				previousStepId,
				...data,
			};
			setInfo((prev) => ({ ...prev, isLoading: true }));
			const response = await addStep(automationId, payload);
			if (response?.[0]) {
				setInfo((prev) => ({ ...prev, isLoading: false }));
				onCLose();
			} else {
				setInfo((prev) => ({ ...prev, isLoading: false }));
				message.error('Failed to add node');
			}
		},
		[info?.saveLoader, activeEdge, addStep, automationId, onCLose],
	);

	const screenMapper = useMemo(() => {
		return {
			ifElse: (
				<IfElse
					variables={variables}
					addConditionNode={addConditionNode}
					isLoading={info?.isLoading}
				/>
			),
		};
	}, [variables, addConditionNode, info?.isLoading]);

	// useEffect(() => {
	// 	if (info?.activeStage) {
	// 		changeStage({ activeStage: info?.activeStage });
	// 	}
	// }, [info?.activeStage]);

	return (
		<div className="actionSidebarComponents">
			<HeaderComponent onBack={onCLose} heading="Conditions" />
			{info?.activeScreen ? (
				screenMapper?.[info?.activeScreen]
			) : (
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
								onClick={() => changeStage({ activeScreen: ele?.id })}
							>
								{ele?.title}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Conditions);

// const Stage1 = ({ info, handleSearch, changeStage }) => {
// 	const conditionListOnClick = useCallback((data) => {
// 		if (data?.id === 'ifElse') changeStage({ activeStage: 'stage2' });
// 	}, []);

// 	return (
// 		<>
// 			<div className="actionSideBarSearchbarContainer">
// 				<div className="actionSidebarSearch">
// 					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
// 						<Search />
// 					</span>
// 					<input
// 						className="actionSideBarSearchInput"
// 						placeholder="Search Conditions"
// 						value={info?.search}
// 						onChange={handleSearch}
// 					/>
// 				</div>
// 			</div>

// 			<div className="actionsListContainer">
// 				{info?.list?.map((ele, index) => (
// 					<div
// 						className="actionListItem"
// 						key={index}
// 						onClick={() => conditionListOnClick(ele?.id)}
// 					>
// 						{ele?.title}
// 					</div>
// 				))}
// 			</div>
// 		</>
// 	);
// };

// const Stage2 = ({
// 	info,
// 	changeStage,
// 	createNewConditionNode,
// 	editMode,
// 	activeStepsData,
// 	editConditionNode,
// }) => {
// 	const [stageInfo, setStageInfo] = useState({
// 		criteria: conditionOptions?.[0],
// 		title: '',
// 		moveSteps: MoveStepsOptions?.[0],
// 	});

// 	useEffect(() => {
// 		if (editMode && activeStepsData) {
// 			const { title, criteria } = activeStepsData;
// 			let selectedCriteria = null;

// 			for (let i = 0; i < conditionOptions?.length; i++) {
// 				if (conditionOptions[i]?.value === criteria?.status) {
// 					selectedCriteria = conditionOptions[i];
// 					break;
// 				}
// 			}

// 			setStageInfo((prev) => ({ ...prev, title, criteria: selectedCriteria }));
// 		}
// 	}, [editMode, activeStepsData]);

// 	const onConditionSelection = useCallback(
// 		(data) => {
// 			if (data?.value === stageInfo?.priority?.value) {
// 				return;
// 			}
// 			setStageInfo((prev) => ({ ...prev, criteria: data }));
// 		},
// 		[stageInfo],
// 	);

// 	const onMoveStepsSelection = useCallback(
// 		(data) => {
// 			if (data?.value === stageInfo?.moveSteps?.value) {
// 				return;
// 			}
// 			setStageInfo((prev) => ({ ...prev, moveSteps: data }));
// 		},
// 		[stageInfo],
// 	);

// 	const handleChange = useCallback((e) => {
// 		setStageInfo((prev) => ({ ...prev, title: e.target.value }));
// 	}, []);

// 	const modifiedHandleClick = useCallback(() => {
// 		if (!stageInfo?.title?.length) {
// 			return message.error('title is mandatory');
// 		}
// 		if (editMode) {
// 			return editConditionNode({
// 				title: stageInfo?.title,
// 				status: stageInfo?.criteria?.value,
// 			});
// 		}
// 		createNewConditionNode({
// 			title: stageInfo?.title,
// 			status: stageInfo?.criteria?.value,
// 			moveTo: stageInfo?.moveSteps?.value,
// 		});
// 	}, [stageInfo, editMode]);
// 	return (
// 		<div className="createTaskUiContainer">
// 			<div className="createTasksUi">
// 				<div className="createTasksHeadingContainer">
// 					<div className="createHeadingLabelContainer">
// 						<div className="createTaskHeadingLabel">
// 							<span className="actionsCreateHeader">Condition</span>
// 							<span className="createTaskHeading">If / Else</span>
// 						</div>
// 						<div
// 							className="changeActionStageButton"
// 							onClick={() => changeStage({ activeStage: 'stage1' })}
// 						>
// 							Change
// 						</div>
// 					</div>
// 				</div>

// 				{/* condition title */}
// 				<div className="addTaskTitleContainer">
// 					<span className="addTaskTitleTextStyle">Add Title</span>
// 					<textarea
// 						className="addTaskTitleTextArea"
// 						placeholder="Add  Title ...."
// 						value={stageInfo?.title}
// 						onChange={handleChange}
// 					/>
// 				</div>

// 				{!editMode ? (
// 					<div className="addTaskTitleContainer">
// 						<span className="addTaskTitleTextStyle">Move Steps</span>
// 						<HeadersDropDownComp
// 							options={MoveStepsOptions}
// 							showIcon={false}
// 							containerStyle={{
// 								...containerStyle,
// 							}}
// 							outerContainerStyle={{ width: '100%' }}
// 							dropDownStyle={{ ...dropDownStyle }}
// 							dropDownTextStyling={{ ...dropDownTextStyling }}
// 							showSelectedValueTick={true}
// 							uniqueIdentifierForTickIcon={'value'}
// 							selectedValueObj={stageInfo?.moveSteps}
// 							selectedValueStyle={{
// 								...selectedValueStyling,
// 							}}
// 							selectedValue={stageInfo?.moveSteps?.label || ''}
// 							onChangeFunc={onMoveStepsSelection}
// 						/>
// 					</div>
// 				) : (
// 					''
// 				)}

// 				<div className="addTaskTitleContainer">
// 					<span className="addTaskTitleTextStyle">Criteria</span>
// 					<HeadersDropDownComp
// 						options={conditionOptions}
// 						showIcon={false}
// 						containerStyle={{
// 							...containerStyle,
// 						}}
// 						outerContainerStyle={{ width: '100%' }}
// 						dropDownStyle={{ ...dropDownStyle }}
// 						dropDownTextStyling={{ ...dropDownTextStyling }}
// 						showSelectedValueTick={true}
// 						uniqueIdentifierForTickIcon={'value'}
// 						selectedValueObj={stageInfo?.criteria}
// 						selectedValueStyle={{
// 							...selectedValueStyling,
// 						}}
// 						selectedValue={stageInfo?.criteria?.label || ''}
// 						onChangeFunc={onConditionSelection}
// 					/>
// 				</div>
// 			</div>
// 			{editMode ? (
// 				<div className="actionsSaveButton" onClick={modifiedHandleClick}>
// 					{info?.saveLoader ? <Spin /> : 'Update'}
// 				</div>
// 			) : (
// 				<div className="actionsSaveButton" onClick={modifiedHandleClick}>
// 					{info?.saveLoader ? <Spin /> : 'Save'}
// 				</div>
// 			)}
// 		</div>
// 	);
// };
