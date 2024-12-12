/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/doubleArrow.svg';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import Spinner from '../../loaders/Spinner';
import {
	conditionOptions,
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
const RenderConditionUi = ({
	closeModal,
	previousStepPath,
	templateId,
	previousStepId,
	moveToPath,
	refetchWorkflowBuilderData,
	mode,
	currentStepInfo,
	scrollToNewOrUpdatedNodes,
}) => {
	const {
		templates: { addNewSteps },
	} = useContext(Context);

	const [info, setInfo] = useState({
		labelMapper: {
			notification: 'Send Notification',
			condition: 'Add Condition',
			pipeline: 'Move pipeline stage ',
			actions: 'Actions',
			saveLoader: false,
		},
		selectedCondition: conditionOptions?.[0],
		contentLoader: true,
	});

	useEffect(() => {
		if (mode === 'edit') {
			const { criteria } = currentStepInfo || {};
			let selectedCondition = null;
			for (let i = 0; i < conditionOptions?.length; i++) {
				if (conditionOptions?.[i]?.value === criteria?.status || criteria) {
					selectedCondition = conditionOptions?.[i];
					setInfo((prev) => ({ ...prev, contentLoader: false, selectedCondition }));
					break;
				}
			}
		} else {
			setInfo((prev) => ({ ...prev, contentLoader: false }));
		}
	}, [mode, currentStepInfo]);

	const addConditionalNodes = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const type = 'condition';
		const previousType = previousStepPath?.includes('condition') ? 'condition' : 'action';
		const payload = {
			stepInput: {
				type,
				moveTo: moveToPath,
				previousStepId: previousStepId,
				criteria: { status: info?.selectedCondition?.value },
			},
			templateId: templateId,
		};
		if (previousType === 'condition') {
			const path = previousStepPath?.split('-')?.[1];
			payload.stepInput.previousStepPath = path;
		}
		const response = await addNewSteps(payload);
		if (response?.[0]) {
			scrollToNewOrUpdatedNodes(response?.[1]?.newStep, response?.[1]?.steps);
			closeModal();
		}
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, [
		info?.saveLoader,
		moveToPath,
		templateId,
		previousStepPath,
		previousStepId,
		info?.selectedCondition,
	]);

	const onConditionSelection = useCallback(
		(data) => {
			if (info?.selectedCondition?.value === data?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedCondition: data }));
		},
		[info?.selectedCondition],
	);

	return (
		<div className="conditionContainer">
			{/* header */}
			<div className="workflowUpdatedHeader">
				<span onClick={closeModal}>
					<DoubleArrow />
				</span>

				<span className="headerTitle">Edit</span>
			</div>
			<div className="workflowOptionContainer">
				<div className="actionDropDownContainer">
					<span className="actionTitle">Take Action if</span>
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
						selectedValueObj={info?.selectedCondition}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
						selectedValue={info?.selectedCondition?.label || ''}
						onChangeFunc={onConditionSelection}
					/>
				</div>
			</div>
			{mode !== 'edit' ? (
				<div className="workflowFooterContainer">
					<div className="saveChangesButton" onClick={addConditionalNodes}>
						{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
						{info?.saveLoader ? 'Saving...' : 'Save Changes'}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default memo(RenderConditionUi);
