/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Context from '../../../../context/context';
import {
	actionOptions,
	calculateTimeDifference,
	calculateTimeStamp,
	channelOptions,
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	options,
	returnDurationOption,
	selectedValueStyling,
	smartFileActions,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import Spinner from '../../loaders/Spinner';
import EditAndViewEmailTemplateModal from './EditAndViewEmailTemplateModal';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/doubleArrow.svg';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import WorkflowBuilderLoader from '../../workflowBuilderComponents/WorkflowBuilderLoader';
import ToggleSlider from '../../input/slider';
import { ReactComponent as Pen } from '../../../../assets/svg/worflow_builder/editPen.svg';
import { Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

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
	scrollToNewOrUpdatedNodes,
}) => {
	const {
		templates: {
			allEmailTemplates,
			addNewSteps,
			getSpecificWorkflowTemplateDetails,
			updateSteps,
		},
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
		contentLoader: true,
		madeEditChanges: false,
		selectedSlackWorkspace: '',
		selectedSlackChannel: '',
		slackMessage: '',
		slackChannelId: null, //only used as flag for edit mode,do not use this as a paylaod
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
							contentLoader: false,
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
		const { channels, criteria, emailTemplateId } = currentStepInfo || {};
		//use it for udating state
		let obj = {};

		//slackChannel
		if (channels?.[0] === 'slack') {
			const { slackChannelId, slackMessage } = currentStepInfo || {};

			obj = { ...obj, slackMessage, slackChannelId };
		}

		//for email channel
		if (channels?.[0] === 'email') {
			const payload = {
				getEmailTemplateId: emailTemplateId,
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
			let selectedEmailTemplate = null;

			//fetching selected email template
			for (let i = 0; i < info?.emailTemplates?.length; i++) {
				if (info?.emailTemplates?.[i]?.label === title) {
					selectedEmailTemplate = info?.emailTemplates?.[i]?.ele;
					break;
				}
			}

			obj = {
				...obj,
				noOfDays,
				title,
				selectedDuration,
				selectedEmailTemplate,
				emailBody: htmlBody,
				subject,
				requiredApproval: approvalRequired,
			};
		}

		let selectedCriteria = null,
			selectedChannel = null;
		// fetching selected criteria
		for (let i = 0; i < smartFileActions?.length; i++) {
			if (smartFileActions?.[i]?.value === (criteria?.status || criteria)) {
				selectedCriteria = smartFileActions?.[i];
				break;
			}
		}

		//fetching selected channel
		for (let i = 0; i < channelOptions?.length; i++) {
			if (channelOptions?.[i]?.value === channels?.[0]) {
				selectedChannel = channelOptions?.[i];
				break;
			}
		}

		setInfo((prev) => ({
			...prev,
			...obj,
			selectedCriteria,
			selectedChannel,
			contentLoader: false,
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
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({ ...prev, selectedChannel: data, ...obj }));
		},
		[info?.selectedChannel, mode],
	);

	const onChangeEmailTemplates = useCallback(
		async (data) => {
			const { ele } = data;

			if (ele?._id === info?.selectedEmailTemplate?._id) {
				return;
			}

			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}

			setInfo((prev) => ({
				...prev,
				selectedEmailTemplate: ele,
				subject: ele?.subject,
				emailBody: ele?.htmlBody,
				...obj,
			}));
		},
		[info?.emailTemplates, info?.selectedEmailTemplate, mode],
	);

	const changeSubjectOrEmailBody = useCallback(
		(updatedData) => {
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({ ...prev, ...updatedData, ...obj }));
		},
		[info, mode],
	);

	const onChangeDuration = useCallback(
		(data) => {
			if (info?.selectedDuration?.value === data?.value) {
				return;
			}
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({ ...prev, selectedDuration: data, ...obj }));
		},
		[info?.selectedDuration, mode],
	);
	const onChangeCriteria = useCallback(
		(data) => {
			if (info?.selectedCriteria?.value === data?.value) {
				return;
			}
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({ ...prev, selectedCriteria: data, ...obj }));
		},
		[info?.selectedDuration, mode],
	);
	const incrementorDecrementorFunc = useCallback(
		async (type) => {
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			if (type === 'increment') {
				setInfo((prev) => ({ ...prev, noOfDays: prev?.noOfDays + 1, ...obj }));
			} else {
				setInfo((prev) => ({
					...prev,
					noOfDays: prev?.noOfDays - 1 >= 0 ? prev?.noOfDays - 1 : 1,
					...obj,
				}));
			}
		},
		[info?.noOfDays, mode],
	);

	const approvalOnChange = useCallback(
		async (data) => {
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({ ...prev, requiredApproval: data, ...obj }));
		},
		[mode],
	);

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
				channels: info?.selectedChannel?.value,
				actionType: 'notification',
			},
		};
		if (previousType === 'condition') {
			const path = previousStepPath?.split('-')?.[1];
			payload.stepInput.previousStepPath = path;
		}
		if (info?.selectedChannel?.value === 'email') {
			payload.stepInput = {
				...payload?.stepInput,
				approvalRequired: info?.requiredApproval,
				emailTemplateId: info?.selectedEmailTemplate?._id,
				htmlBody: info?.emailBody,
				subject: info?.subject,
				criteria: { status: info?.selectedCriteria?.value },
				sendAt: timeStamp,
			};
		}

		if (info?.selectedChannel?.value === 'slack') {
			if (!info?.selectedSlackChannel?.value || !info?.slackMessage?.length) {
				return message.error('SlackChannel and messgae both are mandatory fields');
			}
			payload.stepInput = {
				...payload?.stepInput,
				slackChannelId: info?.selectedSlackChannel?.value,
				slackMessage: info?.slackMessage,
				criteria: { status: info?.selectedCriteria?.value },
			};
		}
		const response = await addNewSteps(payload);
		if (response?.[0]) {
			scrollToNewOrUpdatedNodes(response?.[1]?.newStep, response?.[1]?.steps);
			closeModal();
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
		info?.selectedSlackChannel,
		info?.slackMessage,
	]);

	const editNotificationNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const type = 'action';
		const timeStamp = await calculateTimeStamp(info?.selectedDuration?.value, info?.noOfDays);
		const payload = {
			templateId: templateId,
			updateStepInput: {
				type,
				channels: info?.selectedChannel?.value,
				actionType: 'notification',
				stepId: currentStepInfo?._id,
			},
		};

		if (info?.selectedChannel?.value === 'email') {
			payload.updateStepInput = {
				...payload?.updateStepInput,
				approvalRequired: info?.requiredApproval,
				htmlBody: info?.emailBody,
				subject: info?.subject,
				sendAt: timeStamp,
				criteria: { status: info?.selectedCriteria?.value },
			};
		}
		if (info?.selectedChannel?.value === 'slack') {
			if (!info?.selectedSlackChannel?.value || !info?.slackMessage?.length) {
				return message.error('SlackChannel and messgae both are mandatory fields');
			}
			payload.updateStepInput = {
				...payload?.updateStepInput,
				slackChannelId: info?.selectedSlackChannel?.value,
				slackMessage: info?.slackMessage,
				criteria: { status: info?.selectedCriteria?.value },
			};
		}

		const response = await updateSteps(payload);
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
		currentStepInfo,
		info?.selectedSlackChannel,
		info?.slackMessage,
	]);

	//slack functions
	const onSlackMessageChanges = useCallback(
		(e) => {
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			setInfo((prev) => ({
				...prev,
				slackMessage: e?.target?.value,
				...obj,
			}));
		},
		[info?.slackMessage, mode],
	);
	const onChangeSlackChannels = useCallback(
		(data) => {
			let obj = {};
			if (mode === 'edit') {
				obj = { madeEditChanges: true };
			}
			if (data?.value === info?.selectedSlackChannel?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedSlackChannel: data, ...obj }));
		},
		[info?.selectedChannel],
	);

	const channelMapper = useMemo(() => {
		return {
			email: (
				<SendEmailTypeComponent
					info={info}
					setInfo={setInfo}
					onChangeEmailTemplates={onChangeEmailTemplates}
					incrementorDecrementorFunc={incrementorDecrementorFunc}
					onChangeDuration={onChangeDuration}
					onChangeCriteria={onChangeCriteria}
					approvalOnChange={approvalOnChange}
				/>
			),
			slack: (
				<SendSlackTypeComponent
					info={info}
					setInfo={setInfo}
					incrementorDecrementorFunc={incrementorDecrementorFunc}
					onChangeDuration={onChangeDuration}
					onSlackMessageChanges={onSlackMessageChanges}
					onChangeSlackChannels={onChangeSlackChannels}
					onChangeCriteria={onChangeCriteria}
				/>
			),
		};
	}, [
		info,
		onChangeEmailTemplates,
		incrementorDecrementorFunc,
		onChangeDuration,
		onChangeCriteria,
		approvalOnChange,
	]);

	return info?.contentLoader ? (
		<WorkflowBuilderLoader />
	) : (
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
							fontFamily: 'var(--primary-font-family)',
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
				{channelMapper?.[info?.selectedChannel?.value]}
			</div>

			{mode === 'edit' && !info?.madeEditChanges ? (
				''
			) : (
				<div className="workflowFooterContainer">
					<div
						className="saveChangesButton"
						onClick={mode !== 'edit' ? addNotificationNode : editNotificationNode}
					>
						{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
						{info?.saveLoader ? 'Saving...' : 'Save Changes'}
					</div>
				</div>
			)}

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

export default memo(RenderNotificationUi);
const SendEmailTypeComponent = ({
	info,
	setInfo,
	onChangeEmailTemplates,
	incrementorDecrementorFunc,
	onChangeDuration,
	onChangeCriteria,
	approvalOnChange,
}) => {
	return (
		<>
			{/* {for email templates} */}
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
		</>
	);
};
const SendSlackTypeComponent = ({
	info,
	setInfo,
	incrementorDecrementorFunc,
	onChangeDuration,
	onSlackMessageChanges,
	onChangeSlackChannels,
	onChangeCriteria,
}) => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
		templates: { getAllSlackChannels, slackChannels },
	} = useContext(Context);
	const navigate = useNavigate();

	const [localInfo, setLocalInfo] = useState({
		slackConnectionCheckLoading: true,
		slackConnected: false,
		slackToken: null,
		slackChannelsOptions: [],
	});

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		} else {
			const { slack } = tennantSettingsData || {};
			if (slack?.accessToken) {
				return setLocalInfo((prev) => ({
					...prev,
					slackConnected: true,
					slackConnectionCheckLoading: false,
					slackToken: slack?.accessToken,
				}));
			}
			setLocalInfo((prev) => ({
				...prev,
				slackConnectionCheckLoading: false,
			}));
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (localInfo?.slackConnected && localInfo?.slackToken && !slackChannels) {
			getAllSlackChannels(localInfo?.slackToken);
		}
	}, [localInfo?.slackConnected, localInfo?.slackToken, slackChannels]);

	useEffect(() => {
		if (slackChannels) {
			let options = [];

			for (let i = 0; i < slackChannels?.length; i++) {
				options?.push({
					label: slackChannels?.[i]?.name,
					value: slackChannels?.[i].id,
				});
			}

			setLocalInfo((prev) => ({ ...prev, slackChannelsOptions: options }));
			setInfo((prev) => ({
				...prev,
				selectedSlackChannel: options?.[0],
			}));
		}
	}, [slackChannels]);

	useEffect(() => {
		if (info?.slackChannelId && localInfo?.slackChannelsOptions) {
			const slackChannelsOptions = [...localInfo?.slackChannelsOptions];
			for (let i = 0; i < slackChannelsOptions?.length; i++) {
				if (slackChannelsOptions?.[i]?.value === info?.slackChannelId) {
					setInfo((prev) => ({
						...prev,
						selectedSlackChannel: slackChannelsOptions?.[i],
						slackChannelId: null,
					}));
				}
			}
		}
	}, [info?.slackChannelId, localInfo?.slackChannelsOptions]);

	return localInfo?.slackConnectionCheckLoading ? (
		<div style={{ display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
			<Spin />
		</div>
	) : localInfo?.slackConnected ? (
		<>
			{/* slack worksapce */}
			{/* <div className="actionDropDownContainer">
				<span className="actionTitle">Slack Workspace</span>
				<HeadersDropDownComp
					options={channelOptions}
					// selectedValue={info?.selectedChannel?.label}
					// onChangeFunc={onChannelSelectionChanges}
					showIcon={false}
					containerStyle={{
						...containerStyle,
					}}
					outerContainerStyle={{ width: '100%' }}
					dropDownStyle={{ ...dropDownStyle }}
					dropDownTextStyling={{ ...dropDownTextStyling }}
					showSelectedValueTick={true}
					uniqueIdentifierForTickIcon={'value'}
					// selectedValueObj={info?.selectedChannel}
					selectedValueStyle={{
						...selectedValueStyling,
					}}
				/>
			</div> */}
			{/* <div className="workflow_builder_action_seperator"></div> */}
			{/* slack channel */}
			<div className="actionDropDownContainer">
				<span className="actionTitle">Slack Channel</span>
				<HeadersDropDownComp
					options={localInfo?.slackChannelsOptions}
					selectedValue={info?.selectedSlackChannel?.label}
					onChangeFunc={onChangeSlackChannels}
					showIcon={false}
					containerStyle={{
						...containerStyle,
					}}
					outerContainerStyle={{ width: '100%' }}
					dropDownStyle={{ ...dropDownStyle }}
					dropDownTextStyling={{ ...dropDownTextStyling }}
					showSelectedValueTick={true}
					uniqueIdentifierForTickIcon={'value'}
					selectedValueObj={info?.selectedSlackChannel}
					selectedValueStyle={{
						...selectedValueStyling,
					}}
				/>
			</div>

			{/* message */}
			<div className="workflow_builder_action_seperator"></div>
			<div className="actionDropDownContainer">
				<span className="actionTitle">Message</span>
				<textarea
					className="slackMessageInputBox"
					value={info?.slackMessage}
					onChange={onSlackMessageChanges}
				/>
			</div>
			{/* <div className="workflow_builder_action_seperator"></div>
			<div className="notification_schedulingContainer">
				<span className="actionTitle">When ?</span>
				<div className="notificationDaysContainer">
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
			</div> */}
			<div className="workflow_builder_action_seperator"></div>
			<div className="notification_schedulingContainer">
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
		</>
	) : (
		<div className="slackIntegrateContainer">
			<span className="slackSubtitle">You have not authorised your slack account</span>
			<span className="slackSubtitle">
				Click this button to navigate to Integration Settings
			</span>
			<Button onClick={() => navigate('/settings/integrations')}>Go To Settings</Button>
		</div>
	);
};
