import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/conditions.scss';
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
import { message } from '../../globalComponents/CustomToast';
import Context from '../../../../context/context';
import HeaderComponent from './HeaderComponent';
import IfElse from './IfElse';
import SwitchStep from './SwitchStep';
const conditionsList = {
	condition: { label: 'If / Else', value: 'condition' },
	switch: { label: 'Switch', value: 'switch' },
};
const Conditions = ({
	onClose,
	activeEdge,
	templateId,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	automationId,
}) => {
	const {
		automationBuilder: { variables, addStep, updateStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(conditionsList),
		searchChanged: false,
		activeScreen: null,
		activeStage: null,
		isLoading: false,
		hasNextNode: false,
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};
	useEffect(() => {
		if (activeEdge) {
			const [previousStepId, nextStepId] = activeEdge?.split('-');
			setInfo((prev) => ({ ...prev, hasNextNode: previousStepId !== nextStepId }));
		}
	}, [activeEdge]);

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({ ...prev, activeScreen: activeStepsData?.type }));
		}
	}, [activeStepsData]);

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
			const previousStepPath = activeEdge?.split('-')?.[2] || null;
			const payload = {
				isEnabled: true,
				previousStepId,
				isHidden: false,
				...(previousStepPath && { previousStepPath }),
				...data,
			};
			setInfo((prev) => ({ ...prev, isLoading: true }));
			const response = await addStep(automationId, payload);
			if (response?.[0]) {
				setInfo((prev) => ({ ...prev, isLoading: false }));
				onClose();
			} else {
				setInfo((prev) => ({ ...prev, isLoading: false }));
				message.error('Failed to add node');
			}
		},
		[info?.saveLoader, activeEdge, addStep, automationId, onClose],
	);

	const updateConditionNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			const payload = {
				stepId: activeStepsData?._id,
				...data,
			};
			setInfo((prev) => ({ ...prev, isLoading: true }));
			const response = await updateStep(automationId, payload);
			if (response?.[0]) {
				message.success('Condition updated successfully');
			} else {
				message.error('Failed to update condition');
			}
			setInfo((prev) => ({ ...prev, isLoading: false }));
		},
		[activeStepsData?.id, addStep, automationId, info?.saveLoader],
	);

	const onSave = useCallback(
		(data) => {
			if (activeStepsData) {
				updateConditionNode(data);
			} else {
				addConditionNode(data);
			}
		},
		[activeStepsData, addConditionNode, updateConditionNode],
	);

	const onBack = useCallback(() => {
		if (activeStepsData) {
			onClose();
		} else {
			changeStage({ activeScreen: null });
		}
	}, [changeStage, activeStepsData]);

	const screenMapper = useMemo(() => {
		return {
			condition: (
				<IfElse
					variables={variables}
					onSave={onSave}
					isLoading={info?.isLoading}
					hasNextNode={info?.hasNextNode}
					onBack={onBack}
					activeStepsData={activeStepsData}
				/>
			),
			switch: (
				<SwitchStep
					variables={variables}
					onSave={onSave}
					isLoading={info?.isLoading}
					hasNextNode={info?.hasNextNode}
					onBack={onBack}
					activeStepsData={activeStepsData}
				/>
			),
		};
	}, [variables, info?.isLoading, info?.hasNextNode, activeStepsData, onBack, onSave]);

	const handleBack = useCallback(() => {
		if (activeStepsData || !info?.activeScreen) {
			onClose();
		} else {
			changeStage({ activeScreen: null });
		}
	}, [changeStage, info?.activeScreen, onClose, activeStepsData]);

	return (
		<div className="actionSidebarComponents">
			<HeaderComponent onBack={handleBack} heading="Conditions" />
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
								onClick={() => changeStage({ activeScreen: ele?.value })}
							>
								{ele?.label}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Conditions);
