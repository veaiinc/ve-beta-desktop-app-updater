/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import { ReactComponent as Pen } from '../../../../assets/svg/worflow_builder/editPen.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/doubleArrow.svg';
import Context from '../../../../context/context';
import ToggleSlider from '../../input/slider';
import Spinner from '../../loaders/Spinner';

import {
	calculateTimeDifference,
	smartFileActions,
	options,
	returnDurationOption,
	calculateTimeStamp,
	actionOptions,
	channelOptions,
	movePipeLineOptions,
	conditionOptions,
	takeActionsOptions,
	dropDownTextStyling,
	dropDownStyle,
	containerStyle,
	selectedValueStyling,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import { Drawer } from 'antd';
import EditAndViewEmailTemplateModal from './EditAndViewEmailTemplateModal';

const initialState = {
	editState: false,
	pageLoader: true,
	localOptionType: null,
};

const WorkflowCardEditModal = ({
	modalIsOpen,
	closeModalFunc,
	previousStepId,
	mode,
	currentStepInfo,
	templateId,
	previousStepPath,
	optionType,
	newNodeType,
	moveToPath,
}) => {
	const {
		templates: {
			getAllEmailTemplates,
			getSpecificWorkflowTemplateDetails,
			getSpecificTemplatesInfo,
			// updateWorkflowSteps,
		},
	} = useContext(Context);

	//states
	const [info, setInfo] = useState({
		...initialState,
	});

	//useEFfects

	useEffect(() => {
		getEmailTemplates();
	}, []);

	useEffect(() => {
		getSpecifiTemplateDetails();
	}, [modalIsOpen, mode, currentStepInfo]);

	useEffect(() => {
		if (optionType) {
			setInfo((prev) => ({ localOptionType: optionType }));
		}
	}, [optionType]);

	//function definations

	const getEmailTemplates = useCallback(() => {
		const payload = {
			filters: {
				limit: 1000,
				page: 1,
				modules: ['forms', 'proposals', 'contracts', 'invoices'],
			},
		};
		getAllEmailTemplates(payload);
	}, [getAllEmailTemplates]);

	const getSpecifiTemplateDetails = useCallback(async () => {
		if (modalIsOpen && mode === 'edit') {
			const { type, actionType } = currentStepInfo || {};
			let finalisedOption = type === 'condition' ? type : actionType;
			setInfo((prev) => ({ ...prev, localOptionType: finalisedOption, pageLoader: false }));
			// const payload = {
			// 	getEmailTemplateId: currentStepInfo?.emailTemplateId,
			// };
			// const response = await getSpecificWorkflowTemplateDetails(payload);
			// const { approvalRequired, htmlBody, sendAt, subject, title } = response?.[1] || {};
			// let timeStampData,
			// 	noOfDays = 1,
			// 	selectedDuration = {
			// 		label: 'Days',
			// 		value: 'days',
			// 	};
			// if (sendAt) {
			// 	timeStampData = calculateTimeDifference(sendAt);
			// 	noOfDays = +timeStampData?.[0];
			// 	selectedDuration = returnDurationOption(timeStampData?.[1]);
			// }
			// setInfo((prev) => ({
			// 	...prev,
			// 	subject,
			// 	emailBody: htmlBody,
			// 	requiredApproval: approvalRequired,
			// 	title,
			// 	pageLoader: false,
			// 	noOfDays,
			// 	selectedDuration,
			// }));
		}
		if (modalIsOpen && mode === 'create') {
			setInfo((prev) => ({ ...prev, pageLoader: false }));
		}
	}, [modalIsOpen, mode, currentStepInfo]);

	const closeModal = useCallback(() => {
		closeModalFunc();
		let updatedData = { ...initialState };
		setInfo(updatedData);
	}, [closeModalFunc]);

	const changeLocalOptionType = useCallback(
		(data) => {
			if (data === info?.localOptionType) {
				return;
			}
			setInfo((prev) => ({ ...prev, localOptionType: data }));
		},
		[info?.localOptionType],
	);

	const refetchWorkflowBuilderData = useCallback(async () => {
		const response = await getSpecificTemplatesInfo({
			templateInfoId: templateId,
		});
		return response;
	}, [templateId]);

	///updated functions
	const compMapper = useMemo(() => {
		if (info?.localOptionType) {
			return {
				action: (
					<RenderActionUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
					/>
				),
				condition: (
					<RenderConditionUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
						previousStepId={previousStepId}
						templateId={templateId}
						previousStepPath={previousStepPath}
						moveToPath={moveToPath}
						refetchWorkflowBuilderData={refetchWorkflowBuilderData}
						mode={mode}
						currentStepInfo={currentStepInfo}
					/>
				),
				notification: (
					<RenderNotificationUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
						previousStepId={previousStepId}
						templateId={templateId}
						previousStepPath={previousStepPath}
						refetchWorkflowBuilderData={refetchWorkflowBuilderData}
						mode={mode}
						currentStepInfo={currentStepInfo}
					/>
				),
				pipeline: (
					<RenderPipelineUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
					/>
				),
			};
		}
	}, [info?.localOptionType]);

	return (
		<Drawer
			onClose={closeModal}
			width={360}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			zIndex={1500}
		>
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{info?.pageLoader ? (
						<div
							className="loadingScreen"
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								flex: 1,
								gap: '24px',
								color: '#fff',
							}}
						>
							<Spinner />
							<span>Fetching details ....</span>
						</div>
					) : (
						compMapper?.[info?.localOptionType]
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(WorkflowCardEditModal);

const RenderActionUi = ({ closeModal, changeLocalOptionType, localOptionType }) => {
	const [info, setInfo] = useState({
		labelMapper: {
			notification: 'Send Notification',
			condition: 'Add Condition',
			pipeline: 'Move pipeline stage ',
			action: 'Actions',
		},
		valueObjectMapper: {
			notification: {
				label: 'Send notification',
				value: 'notification',
			},
			condition: {
				label: 'Condition',
				value: 'condition',
			},
			pipeline: {
				label: 'Move pipeline stage',
				value: 'pipeline',
			},
			action: {
				label: 'Actions',
				value: 'action',
			},
		},
	});

	const onOptionChangeFunc = useCallback(
		(data) => {
			if (data === localOptionType) {
				return;
			}
			changeLocalOptionType(data?.value);
		},
		[localOptionType],
	);

	return (
		<div className="actionContainer">
			{/* header */}
			<div className="workflowUpdatedHeader">
				<span onClick={closeModal}>
					<DoubleArrow />
				</span>

				<span className="headerTitle">Edit</span>
			</div>
			<div className="workflowOptionContainer">
				{/* //action */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action</span>
					<HeadersDropDownComp
						options={actionOptions}
						selectedValue={info?.labelMapper?.[localOptionType]}
						onChangeFunc={(e) => onOptionChangeFunc(e)}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.valueObjectMapper?.[localOptionType]}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //action type */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action Type</span>
					<HeadersDropDownComp
						options={takeActionsOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //notification type */}
				<div className="notification_schedulingContainer">
					<span className="actionTitle">When ?</span>
					<div className="notificationDaysContainer">
						{/* //incrementor */}
						<div className="incrementorDecrementorContainer">
							<div className="manualIncrementorButtons">-</div>
							<input className="manualIncrementorInput" />
							<div className="manualIncrementorButtons">+</div>
						</div>
						{/* //days */}
						<HeadersDropDownComp
							options={channelOptions}
							showIcon={false}
							containerStyle={{
								...containerStyle,
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{ ...dropDownStyle }}
							dropDownTextStyling={{ ...dropDownTextStyling }}
							selectedValueStyle={{
								...selectedValueStyling,
							}}
						/>
					</div>
					<HeadersDropDownComp
						options={channelOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				{/* //required approval */}
				<div className="requiredApprovalContainer">
					<span className="requiredApprovalText">Require Approval before sending</span>
					<ToggleSlider />
				</div>
			</div>
			<div className="workflowFooterContainer">
				<div className="saveChangesButton">Save Changes</div>
			</div>
		</div>
	);
};

const RenderConditionUi = ({
	closeModal,
	previousStepPath,
	templateId,
	previousStepId,
	moveToPath,
	refetchWorkflowBuilderData,
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
		selectedCondition: null,
	});

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
				criteria: info?.selectedCondition?.value,
			},
			templateId: templateId,
		};
		if (previousType === 'condition') {
			const path = previousStepPath?.split('-')?.[1];
			payload.stepInput.previousStepPath = path;
		}
		const response = await addNewSteps(payload);
		if (response?.[0]) {
			const refetchResponse = await refetchWorkflowBuilderData();
			if (refetchResponse?.[0]) {
				setInfo((prev) => ({ ...prev, saveLoader: false }));
				closeModal();
			}
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
			<div className="workflowFooterContainer">
				<div className="saveChangesButton" onClick={addConditionalNodes}>
					{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
					{info?.saveLoader ? 'Saving...' : 'Save Changes'}
				</div>
			</div>
		</div>
	);
};

const RenderNotificationUi = ({
	closeModal,
	changeLocalOptionType,
	localOptionType,
	newNodeType,
	previousStepPath,
	templateId,
	previousStepId,
	refetchWorkflowBuilderData,
	mode,
	currentStepInfo,
}) => {
	const {
		templates: { allEmailTemplates, addNewSteps, getSpecificWorkflowTemplateDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		labelMapper: {
			notification: 'Send Notification',
			condition: 'Add Condition',
			pipeline: 'Move pipeline stage ',
			actions: 'Actions',
		},
		valueObjectMapper: {
			notification: {
				label: 'Send notification',
				value: 'notification',
			},
			condition: {
				label: 'Condition',
				value: 'condition',
			},
			pipeline: {
				label: 'Move pipeline stage',
				value: 'pipeline',
			},
			actions: {
				label: 'Actions',
				value: 'action',
			},
		},
		selectedChannel: channelOptions?.[0] || {},
		emailTemplates: null,
		selectedEmailTemplate: null,
		subject: '',
		emailBody: '',
		noOfDays: 1,
		selectedDuration: {
			label: 'Days',
			value: 'days',
		},
		requiredApproval: false,
		editEmailModal: false,
		saveLoader: false,
		selectedCriteria: smartFileActions?.[0],
	});

	//useEffects
	useEffect(() => {
		if (allEmailTemplates) {
			const { data } = allEmailTemplates;

			const options = [];

			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.title,
					ele: data?.[i],
					_id: data?.[i]?._id,
				};
				options?.push(obj);
			}
			let obj =
				mode === 'edit'
					? {}
					: {
							selectedEmailTemplate: data?.[0],
							subject: data?.[0]?.subject,
							emailBody: data?.[0]?.htmlBody,
					  };
			setInfo((prev) => ({
				...prev,
				emailTemplates: options,
				...obj,
			}));
		}
	}, [allEmailTemplates, mode]);

	useEffect(() => {
		if (mode === 'edit' && info?.emailTemplates) {
			fetchSpecificTemplateData();
		}
	}, [mode, currentStepInfo, info?.emailTemplates]);

	//function defination
	const fetchSpecificTemplateData = useCallback(async () => {
		const payload = {
			getEmailTemplateId: currentStepInfo?.emailTemplateId,
		};
		const response = await getSpecificWorkflowTemplateDetails(payload);
		const { approvalRequired, htmlBody, sendAt, subject, title } = response?.[1] || {};
		let timeStampData,
			noOfDays = 1,
			selectedDuration = {
				label: 'Days',
				value: 'days',
			};
		if (sendAt) {
			timeStampData = calculateTimeDifference(sendAt);
			noOfDays = +timeStampData?.[0];
			selectedDuration = returnDurationOption(timeStampData?.[1]);
		}
		let selectedEmailTemplate = null,
			selectedCriteria = null,
			selectedChannel = null;
		const { channels, criteria } = currentStepInfo || {};

		//fetching selected email template
		for (let i = 0; i < info?.emailTemplates?.length; i++) {
			if (info?.emailTemplates?.[i]?.label === title) {
				selectedEmailTemplate = info?.emailTemplates?.[i]?.ele;
			}
		}

		// fetching selected criteria
		for (let i = 0; i < smartFileActions?.length; i++) {
			if (smartFileActions?.[i]?.value === criteria) {
				selectedCriteria = smartFileActions?.[i];
			}
		}

		//fetching selected channel
		for (let i = 0; i < channelOptions?.length; i++) {
			if (channelOptions?.[i]?.value === channels?.[0]) {
				selectedChannel = channelOptions?.[i];
			}
		}

		setInfo((prev) => ({
			...prev,
			subject,
			emailBody: htmlBody,
			requiredApproval: approvalRequired,
			title,
			noOfDays,
			selectedDuration,
			selectedEmailTemplate,
			selectedCriteria,
			selectedChannel,
		}));
	}, [mode, currentStepInfo, info?.emailTemplates]);

	const onOptionChangeFunc = useCallback(
		(data) => {
			if (data === localOptionType) {
				return;
			}
			changeLocalOptionType(data?.value);
		},
		[localOptionType],
	);

	const onChannelSelectionChanges = useCallback(
		(data) => {
			if (data?.value === info?.selectedChannel?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedChannel: data }));
		},
		[info?.selectedChannel],
	);

	const onChangeEmailTemplates = useCallback(
		async (data) => {
			const { ele } = data;

			if (ele?._id === info?.selectedEmailTemplate?._id) {
				return;
			}

			setInfo((prev) => ({
				...prev,
				selectedEmailTemplate: ele,
				subject: ele?.subject,
				emailBody: ele?.htmlBody,
			}));
		},
		[info?.emailTemplates, info?.selectedEmailTemplate],
	);

	const changeSubjectOrEmailBody = useCallback(
		(updatedData) => {
			setInfo((prev) => ({ ...prev, ...updatedData }));
		},
		[info],
	);

	const onChangeDuration = useCallback(
		(data) => {
			if (info?.selectedDuration?.value === data?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedDuration: data }));
		},
		[info?.selectedDuration],
	);
	const onChangeCriteria = useCallback(
		(data) => {
			if (info?.selectedCriteria?.value === data?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedCriteria: data }));
		},
		[info?.selectedDuration],
	);
	const incrementorDecrementorFunc = useCallback(
		async (type) => {
			if (type === 'increment') {
				setInfo((prev) => ({ ...prev, noOfDays: prev?.noOfDays + 1 }));
			} else {
				setInfo((prev) => ({
					...prev,
					noOfDays: prev?.noOfDays - 1 >= 0 ? prev?.noOfDays - 1 : 1,
				}));
			}
		},
		[info?.noOfDays],
	);

	const approvalOnChange = useCallback(async (data) => {
		setInfo((prev) => ({ ...prev, requiredApproval: data }));
	}, []);

	const addNotificationNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const type = 'action';
		const previousType = previousStepPath?.includes('condition') ? 'condition' : 'action';
		const timeStamp = await calculateTimeStamp(info?.selectedDuration?.value, info?.noOfDays);
		const payload = {
			templateId: templateId,
			stepInput: {
				type,
				previousStepId: previousStepId,
				approvalRequired: info?.requiredApproval,
				emailTemplateId: info?.selectedEmailTemplate?._id,
				htmlBody: info?.emailBody,
				subject: info?.subject,
				sendAt: timeStamp,
				channels: info?.selectedChannel?.value,
				actionType: 'notification',
				criteria: info?.selectedCriteria?.value,
			},
		};
		if (previousType === 'condition') {
			const path = previousStepPath?.split('-')?.[1];
			payload.stepInput.previousStepPath = path;
		}

		const response = await addNewSteps(payload);
		if (response?.[0]) {
			const refetchResponse = await refetchWorkflowBuilderData();
			if (refetchResponse?.[0]) {
				setInfo((prev) => ({ ...prev, saveLoader: false }));
				closeModal();
			}
		}
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, [
		info?.requiredApproval,
		info?.saveLoader,
		templateId,
		previousStepPath,
		previousStepId,
		info?.requiredApproval,
		info?.subject,
		info?.emailBody,
		info?.selectedDuration,
		info?.noOfDays,
		info?.selectedEmailTemplate,
		info?.selectedChannel,
		info?.selectedCriteria,
	]);

	return (
		<div className="notificationContainer">
			{/* header */}
			<div className="workflowUpdatedHeader">
				<span onClick={closeModal}>
					<DoubleArrow />
				</span>

				<span className="headerTitle">Edit</span>
			</div>
			<div className="workflowOptionContainer">
				{/* //action */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action</span>
					<HeadersDropDownComp
						options={actionOptions}
						selectedValue={info?.labelMapper?.[localOptionType]}
						onChangeFunc={onOptionChangeFunc}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.valueObjectMapper?.[localOptionType]}
						selectedValueStyle={{
							color: 'var(--ve-ai-dark-theme-secondary-color, #939393)',
							fontFamily: 'Inter',
							fontSize: '12px',
							fontStyle: 'normal',
							fontWeight: '500',
							lineHeight: 'normal',
						}}
					/>
				</div>
				{/* //channel */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Channel</span>
					<HeadersDropDownComp
						options={channelOptions}
						selectedValue={info?.selectedChannel?.label}
						onChangeFunc={onChannelSelectionChanges}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.selectedChannel}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //email template */}
				<div className="emailTemplateContainer">
					<HeadersDropDownComp
						options={info?.emailTemplates}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValue={info?.selectedEmailTemplate?.title}
						onChangeFunc={onChangeEmailTemplates}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'_id'}
						selectedValueObj={info?.selectedEmailTemplate}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
					<div
						className="editContainer"
						onClick={() => setInfo((prev) => ({ ...prev, editEmailModal: true }))}
					>
						Edit <Pen />
					</div>
				</div>
				<div className="workflow_builder_action_seperator"></div>

				<div className="notification_schedulingContainer">
					<span className="actionTitle">When ?</span>
					<div className="notificationDaysContainer">
						{/* //incrementor */}
						<div className="incrementorDecrementorContainer">
							<div
								className="manualIncrementorButtons"
								onClick={() => incrementorDecrementorFunc('decrement')}
							>
								-
							</div>
							<input className="manualIncrementorInput" value={info?.noOfDays} />
							<div
								className="manualIncrementorButtons"
								onClick={() => incrementorDecrementorFunc('increment')}
							>
								+
							</div>
						</div>
						{/* //days */}
						<HeadersDropDownComp
							options={options}
							showIcon={false}
							containerStyle={{
								...containerStyle,
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{ ...dropDownStyle }}
							dropDownTextStyling={{ ...dropDownTextStyling }}
							selectedValue={info?.selectedDuration?.label}
							onChangeFunc={onChangeDuration}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={info?.selectedDuration}
							selectedValueStyle={{
								...selectedValueStyling,
							}}
						/>
					</div>
					<HeadersDropDownComp
						options={smartFileActions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
						selectedValue={info?.selectedCriteria?.label}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.selectedCriteria}
						onChangeFunc={onChangeCriteria}
						showSelectedValueTick={true}
					/>
				</div>

				<div className="workflow_builder_action_seperator"></div>

				{/* //required approval */}
				<div className="requiredApprovalContainer">
					<span className="requiredApprovalText">Require Approval before sending</span>
					<ToggleSlider value={info?.requiredApproval} onChange={approvalOnChange} />
				</div>
			</div>
			<div className="workflowFooterContainer">
				<div className="saveChangesButton" onClick={addNotificationNode}>
					{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
					{info?.saveLoader ? 'Saving...' : 'Save Changes'}
				</div>
			</div>
			<EditAndViewEmailTemplateModal
				open={info?.editEmailModal}
				closeModal={() => setInfo((prev) => ({ ...prev, editEmailModal: false }))}
				subject={info?.subject}
				emailBody={info?.emailBody}
				changeSubjectOrEmailBody={changeSubjectOrEmailBody}
			/>
		</div>
	);
};

const RenderPipelineUi = ({ closeModal, changeLocalOptionType, localOptionType }) => {
	const [info, setInfo] = useState({
		labelMapper: {
			notification: 'Send Notification',
			condition: 'Add Condition',
			pipeline: 'Move pipeline stage ',
			action: 'Actions',
		},
		valueObjectMapper: {
			notification: {
				label: 'Send notification',
				value: 'notification',
			},
			condition: {
				label: 'Condition',
				value: 'condition',
			},
			pipeline: {
				label: 'Move pipeline stage',
				value: 'pipeline',
			},
			action: {
				label: 'Actions',
				value: 'action',
			},
		},
	});

	const onOptionChangeFunc = useCallback(
		(data) => {
			if (data === localOptionType) {
				return;
			}
			changeLocalOptionType(data?.value);
		},
		[localOptionType],
	);
	return (
		<div className="pipelineContainer">
			{/* header */}
			<div className="workflowUpdatedHeader">
				<span onClick={closeModal}>
					<DoubleArrow />
				</span>

				<span className="headerTitle">Edit</span>
			</div>
			<div className="workflowOptionContainer">
				{/* //action */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action</span>
					<HeadersDropDownComp
						options={actionOptions}
						selectedValue={info?.labelMapper?.[localOptionType]}
						onChangeFunc={(e) => onOptionChangeFunc(e)}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.valueObjectMapper?.[localOptionType]}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //action type */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Move Stages to</span>
					<HeadersDropDownComp
						options={movePipeLineOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //notification type */}
				<div className="notification_schedulingContainer">
					<span className="actionTitle">When ?</span>
					<div className="notificationDaysContainer">
						{/* //incrementor */}
						<div className="incrementorDecrementorContainer">
							<div className="manualIncrementorButtons">-</div>
							<input className="manualIncrementorInput" />
							<div className="manualIncrementorButtons">+</div>
						</div>
						{/* //days */}
						<HeadersDropDownComp
							options={channelOptions}
							showIcon={false}
							containerStyle={{
								...containerStyle,
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{ ...dropDownStyle }}
							dropDownTextStyling={{ ...dropDownTextStyling }}
							selectedValueStyle={{
								...selectedValueStyling,
							}}
						/>
					</div>
					<HeadersDropDownComp
						options={channelOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				{/* //required approval */}
				<div className="requiredApprovalContainer">
					<span className="requiredApprovalText">Require Approval before sending</span>
					<ToggleSlider />
				</div>
			</div>
			<div className="workflowFooterContainer">
				<div className="saveChangesButton">Save Changes</div>
			</div>
		</div>
	);
};
