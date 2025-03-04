/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, memo, useMemo, useContext } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/notification.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as RightArrrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/worflow_builder/buildercard/edit.svg';
import ToggleSlider from '../../input/slider';
import { ReactComponent as FilledTick } from '../../../../assets/svg/worflow_builder/buildercard/filledTick.svg';
import Context from '../../../../context/context';
import EditAndViewEmailTemplateModal from '../../modalsV2/workflowBuilderModals/EditAndViewEmailTemplateModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automation_builder/automationContentsHelper';
import validator from 'validator';
import VariableComponent from './VariableComponent';
import HeaderComponent from './HeaderComponent';

const notificationList = {
	Google: {
		title: 'Google',
		// notification: ['Send Email', 'Send Reply'],
		notification: ['Send Email', 'Send Reply'],
		icon: <Google />,
		id: 'email',
	},
	Slack: {
		title: 'Slack',
		notification: ['Send Slack Message', 'Send Slack Actions'],
		icon: <Slack />,
		id: 'slack',
	},
};

const initialState = {
	search: '',
	list: Object.values(notificationList),
	searchChanged: false,
	activeStage: 'stage1', //stage1, stage2, stage3
	emailTemplates: null,
	selectedTemplate: null,
	previewAndEdit: false,
	selectedSmartFileTemplate: null,
	workflowTemplates: [],
	currentPage: 1,
	hasNextPage: false,
	includeSmartFile: false,
	selectedChannel: null,
	emailTitle: '',
	slackMessage: '',
	title: '',
	selectedSlackChannelId: null,
	slackChannelsOptions: null,
	googleAccountOptions: [],
	selectedGoogleAccount: null,
	recipientEmail: '',
	stepTitle: '',
	stepDescription: '',
	batchId: null,
};
const Notification = ({
	onCLose,
	templateId,
	activeEdge,
	slackConnected,
	googleConnected,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	automationId,
	variables,
}) => {
	const {
		templates: {
			allEmailTemplates,
			addNewSteps,
			updateStateValues,
			specificTemplatesInfo,
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			slackChannels,
			getSpecificWorkflowTemplateDetails,
			updateSteps,
		},
		automationBuilder: { connectedIntegrations, getAutomation, addStep },
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialState });

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	useEffect(() => {
		if (connectedIntegrations?.google) {
			setInfo((prev) => ({
				...prev,
				googleAccountOptions: connectedIntegrations?.google?.map((account) => ({
					label: account?.email,
					value: account?.email,
				})),
				selectedGoogleAccount: {
					label: connectedIntegrations?.google?.[0]?.email,
					value: connectedIntegrations?.google?.[0]?.email,
				},
				googleConnected: true,
			}));
		}
		if (connectedIntegrations?.slack) {
			setInfo((prev) => ({
				...prev,
				slackConnected: true,
			}));
		}
	}, [connectedIntegrations]);

	useEffect(() => {
		if (editMode && activeStepsData) {
			const { channels, title = '', emailTemplateId } = activeStepsData || {};
			let slackMessage = '',
				slackChannelId = '';
			let stage = 'stage1';
			if (channels?.[0] === 'email') {
				stage = 'stage2';
				getSelectedEmailTemplateData(emailTemplateId);
			}
			if (channels?.[0] === 'slack') {
				stage = 'stage5';
				slackMessage = activeStepsData?.slackMessage;
				slackChannelId = activeStepsData?.slackChannelId;
			}
			setInfo((prev) => ({
				...prev,
				activeStage: stage,
				title,
				slackMessage,
				slackChannelId,
				selectedChannel: channels?.[0],
				selectedSlackChannelId: slackChannelId,
			}));
		}
	}, [editMode, activeStepsData]);

	useEffect(() => {
		if (info?.selectedSlackChannelId && editMode && info?.slackChannelsOptions) {
			getSelectedSlackChannel(info?.selectedSlackChannelId);
		}
	}, [info?.selectedSlackChannelId, editMode, info?.slackChannelsOptions]);

	useEffect(() => {
		if (allEmailTemplates) {
			setInfo((prev) => ({
				...prev,
				emailTemplates: allEmailTemplates?.data,
			}));
		}
	}, [allEmailTemplates]);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		} else {
			getMyWorkflowTemplatesData(1);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	useEffect(() => {
		if (slackChannels) {
			let options = [];

			for (let i = 0; i < slackChannels?.length; i++) {
				options?.push({
					label: slackChannels?.[i]?.name,
					value: slackChannels?.[i].id,
				});
			}

			setInfo((prev) => ({
				...prev,
				selectedSlackChannel: options?.[0],
				slackChannelsOptions: options,
			}));
		}
	}, [slackChannels]);

	const getSelectedEmailTemplateData = useCallback(
		async (emailTemplateId) => {
			const payload = {
				getEmailTemplateId: emailTemplateId,
			};
			const response = await getSpecificWorkflowTemplateDetails(payload);
			setInfo((prev) => ({ ...prev, selectedTemplate: response?.[1] }));
		},
		[info],
	);

	const getSelectedSlackChannel = useCallback(
		async (slackChannelId) => {
			const slackChannelsOptions = [...(info?.slackChannelsOptions || [])];

			let selectedSlackChannel = null;
			for (let i = 0; i < slackChannelsOptions?.length; i++) {
				if (slackChannelsOptions?.[i]?.value === slackChannelId) {
					selectedSlackChannel = slackChannelsOptions?.[i];
					break;
				}
			}
			setInfo((prev) => ({ ...prev, selectedSlackChannel }));
		},
		[info],
	);

	const handleSelectEmailTemplate = useCallback(
		(data) => {
			if (data?._id === info?.selectedTemplate?._id) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedTemplate: data, activeStage: 'stage2' }));
		},
		[info],
	);
	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};

	const handleSlackMessageChange = (e) => {
		setInfo((prev) => ({ ...prev, slackMessage: e.target.value }));
	};

	const handleDebouce = useCallback(() => {
		clearTimeout(info?.timeout);
		let timeout = setTimeout(() => {
			const filtered = Object.values(notificationList)?.filter((action) =>
				action.title.toLowerCase().includes(info?.search?.toLowerCase()),
			);
			setInfo((prev) => ({ ...prev, list: filtered }));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.search]);

	const changeStage = useCallback(
		(data = {}) => {
			setInfo((prev) => ({ ...prev, ...data }));
		},
		[info],
	);

	const togglePreviewAndEditModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, previewAndEdit: !prev.previewAndEdit }));
	}, [info]);

	const changeSubjectOrEmailBody = useCallback(
		(updatedData) => {
			setInfo((prev) => ({
				...prev,
				selectedTemplate: {
					...prev.selectedTemplate,
					subject: updatedData.subject,
					htmlBody: updatedData.emailBody,
				},
			}));
		},
		[info],
	);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 16,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);
	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let workflowTemplates = [];

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					workflowTemplates?.push(data?.[i]);
				}
			}

			if (fetchMore) {
				workflowTemplates = [...(info?.workflowTemplates || [])]?.concat(workflowTemplates);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				workflowTemplates,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.workflowTemplates],
	);

	const handleSelectedSmartFileTemplate = useCallback(
		(data) => {
			if (data?._id === info?.selectedSmartFileTemplate?._id) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				selectedSmartFileTemplate: data,
				activeStage: 'stage2',
			}));
		},
		[info],
	);

	const modifiedClose = useCallback(() => {
		if (info?.activeStage === 'stage5') {
			onCLose();
			setInfo((prev) => ({
				...prev,
				...initialState,
				workflowTemplates: prev.workflowTemplates,
				slackChannelsOptions: prev.slackChannelsOptions,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				activeStage: `stage${Number(info?.activeStage?.at(-1)) - 1}`,
			}));
		}
	}, [info, onclose]);

	const createNewNotificationNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const previousStepId = activeEdge?.split('-')?.[0];

		const payload = {
			stepInput: {
				actionType: 'notification',
				previousStepId: previousStepId,
				type: 'action',
				title: info?.title,
				channels: info?.selectedChannel,
				emailTemplateId: info?.selectedTemplate?._id,
				htmlBody: info?.selectedTemplate?.htmlBody,
				subject: info?.selectedTemplate?.subject,
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
	}, [info]);

	const editNotificationNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const previousStepId = activeEdge?.split('-')?.[0];

		const payload = {
			updateStepInput: {
				previousStepId: previousStepId,
				title: info?.title,
				channels: info?.selectedChannel,
				emailTemplateId: info?.selectedTemplate?._id,
				htmlBody: info?.selectedTemplate?.htmlBody,
				subject: info?.selectedTemplate?.subject,
				stepId: activeStepsData?._id,
				type: 'action',
				actionType: 'notification',
			},
			templateId: templateId,
		};
		const response = await updateSteps(payload);
		if (response?.[0]) {
			await refetchWorkflowBuilderData();
			onCLose();
		}
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, []);

	const createNewNotificationSlackNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const previousStepId = activeEdge?.split('-')?.[0];

		const payload = {
			stepInput: {
				actionType: 'notification',
				previousStepId: previousStepId,
				type: 'action',
				title: info?.title,
				channels: info?.selectedChannel,
				slackChannelId: info?.selectedSlackChannel?.value,
				slackMessage: info?.slackMessage,
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
	}, [info]);

	const editNotificationSlackNode = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const previousStepId = activeEdge?.split('-')?.[0];
		const payload = {
			updateStepInput: {
				previousStepId: previousStepId,
				stepId: activeStepsData?._id,
				title: info?.title,
				channels: info?.selectedChannel,
				slackChannelId: info?.selectedSlackChannel?.value,
				slackMessage: info?.slackMessage,
				type: 'action',
				actionType: 'notification',
			},
			templateId: templateId,
		};
		const response = await updateSteps(payload);
		if (response?.[0]) {
			await refetchWorkflowBuilderData();
			onCLose();
		}
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, [info]);

	const handleEmailTitleChange = useCallback((e) => {
		setInfo((prev) => ({ ...prev, title: e.target.value }));
	}, []);

	const onChangeSlackChannels = useCallback(
		(data) => {
			let obj = {};
			// if (mode === 'edit') {
			// 	obj = { madeEditChanges: true };
			// }
			if (data?.value === info?.selectedSlackChannel?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedSlackChannel: data, ...obj }));
		},
		[info?.selectedChannel],
	);

	const addNewStep = useCallback(
		async (type = 'sendMessage') => {
			const variableRegex = /^\{\{.*\}\}$/;
			const variables = {};

			if (info?.saveLoader) {
				return;
			}
			if (!info?.stepTitle?.trim()?.length) {
				return message.error('Title is mandatory');
			}
			if (!info?.stepDescription?.trim()?.length) {
				return message.error('Description is mandatory');
			}
			if (!info?.selectedTemplate?._id?.trim()?.length) {
				return message.error('Email template is mandatory');
			}
			const previousStepId = activeEdge?.split('-')?.[0];
			const previousStepPath = activeEdge?.split('-')?.[2] || null;
			const payload = {
				title: info?.stepTitle,
				description: info?.stepDescription,
				type: 'action',
				app: 'gmail',
				isEnabled: true,
				previousStepId: previousStepId,
				...(previousStepPath && { previousStepPath }),
			};

			if (type === 'sendMessage') {
				const recipientEmail = info?.recipientEmail?.trim();
				const isVariable = variableRegex.test(recipientEmail);
				if (!isVariable && !recipientEmail?.length) {
					return message.error('Recipient email is mandatory');
				}
				if (!isVariable && !validator.isEmail(recipientEmail)) {
					return message.error('Please enter a valid recipient email address');
				}
				if (!info?.selectedGoogleAccount?.value?.trim()?.length) {
					return message.error('Google account is mandatory');
				}

				payload.actionType = 'sendMessage';

				payload.inputBody = {
					action: 'sendMessage',
					emailTemplateTitle: info?.selectedTemplate?.title,
					toEmail: recipientEmail,
					connectedEmail: info?.selectedGoogleAccount?.value,
					htmlBody: info?.selectedTemplate?.htmlBody,
					emailTemplateSubject: info?.selectedTemplate?.subject,
					emailTemplateId: info?.selectedTemplate?._id,
				};
				if (isVariable) {
					variables.toEmail = [recipientEmail.slice(2, -2)];
				}
			}
			if (type === 'sendReply') {
				payload.gmail = {
					emailTemplateId: info?.selectedTemplate?._id,
					action: 'replyMessage',
					messageId: '',
					connectedEmail: info?.selectedGoogleAccount?.value,
					htmlBody: info?.selectedTemplate?.htmlBody,
				};
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			if (Object.keys(variables)?.length) {
				payload.variables = variables;
			}

			const response = await addStep(automationId, payload);

			if (response?.[0]) {
				onCLose();
				await getAutomation(automationId);
			} else {
				message.error(response?.[1]?.message || 'Failed to add step');
			}

			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[
			info?.saveLoader,
			info?.stepTitle,
			info?.stepDescription,
			info?.recipientEmail,
			info?.selectedGoogleAccount?.value,
			info?.selectedTemplate?._id,
			info?.selectedTemplate?.title,
			info?.selectedTemplate?.htmlBody,
			info?.selectedTemplate?.subject,
			activeEdge,
			addStep,
			automationId,
			getAutomation,
		],
	);

	const handelUpdateState = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const stageMapper = useMemo(() => {
		return {
			stage1: (
				<Stage1
					info={info}
					handleSearch={handleSearch}
					changeStage={changeStage}
					slackConnected={info?.slackConnected}
					googleConnected={info?.googleConnected}
				/>
			),
			stage2: (
				<Stage2
					changeStage={changeStage}
					info={info}
					selectedTemplate={info?.selectedTemplate}
					togglePreviewAndEditModal={togglePreviewAndEditModal}
					changeSubjectOrEmailBody={changeSubjectOrEmailBody}
					createNewNotificationNode={createNewNotificationNode}
					handleEmailTitleChange={handleEmailTitleChange}
					editMode={editMode}
					activeStepsData={activeStepsData}
					editNotificationNode={editNotificationNode}
					addNewStep={addNewStep}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					stepTitle={info?.stepTitle}
					stepDescription={info?.stepDescription}
					recipientEmail={info?.recipientEmail}
					handleUpdateState={handelUpdateState}
					variables={variables}
				/>
			),
			stage3: (
				<Stage3
					changeStage={changeStage}
					info={info}
					emailTemplates={info?.emailTemplates}
					selectedTemplate={info?.selectedTemplate}
					handleSelectEmailTemplate={handleSelectEmailTemplate}
				/>
			),
			stage4: (
				<Stage4
					changeStage={changeStage}
					info={info}
					handleSelectedSmartFileTemplate={handleSelectedSmartFileTemplate}
					fetcMoreDocsFilesList={fetchMoreMyWorkflows}
					selectedSmartFileTemplate={info?.selectedSmartFileTemplate}
				/>
			),
			stage5: (
				<Stage5
					info={info}
					changeStage={changeStage}
					handleEmailTitleChange={handleEmailTitleChange}
					handleSlackMessageChange={handleSlackMessageChange}
					onChangeSlackChannels={onChangeSlackChannels}
					createNewNotificationSlackNode={createNewNotificationSlackNode}
					editNotificationSlackNode={editNotificationSlackNode}
					editMode={editMode}
					activeStepsData={activeStepsData}
				/>
			),
		};
	}, [
		info,
		changeStage,
		slackConnected,
		googleConnected,
		togglePreviewAndEditModal,
		changeSubjectOrEmailBody,
		createNewNotificationNode,
		handleEmailTitleChange,
		editMode,
		activeStepsData,
		editNotificationNode,
		addNewStep,
		handelUpdateState,
		handleSelectEmailTemplate,
		handleSelectedSmartFileTemplate,
		fetchMoreMyWorkflows,
		onChangeSlackChannels,
		createNewNotificationSlackNode,
		editNotificationSlackNode,
	]);

	return (
		<div className="actionSidebarComponents">
			<HeaderComponent heading={'Send Email'} onBack={modifiedClose} />
			{stageMapper?.[info?.activeStage]}
		</div>
	);
};

export default memo(Notification);

const Stage1 = ({ info, handleSearch, changeStage }) => {
	const navigate = useNavigate();
	const notificationsListOnClick = useCallback(
		(data) => {
			if (data?.id === 'email') {
				if (info?.googleConnected) {
					changeStage({ activeStage: 'stage2', selectedChannel: data?.id });
				} else {
					navigate('/settings/integrations');
				}
			}
			if (data?.id === 'slack') {
				if (info?.slackConnected) {
					changeStage({ activeStage: 'stage5', selectedChannel: data?.id });
				} else {
					navigate('/settings/integrations');
				}
			}
		},
		[info?.googleConnected, info?.slackConnected],
	);

	const checkConnection = useCallback(
		(data) => {
			if (data?.id === 'email') {
				return info?.googleConnected;
			}
			if (data?.id === 'slack') {
				return info?.slackConnected;
			}
		},
		[info?.googleConnected, info?.slackConnected],
	);
	return (
		<>
			<div className="actionSideBarSearchbarContainer">
				<div className="actionSidebarSearch">
					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
						<Search />
					</span>
					<input
						className="actionSideBarSearchInput"
						placeholder="Search Notifications"
						value={info?.search}
						onChange={handleSearch}
					/>
				</div>
			</div>

			<div className="actionsListContainer">
				{info?.list?.map((ele, index) => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							gap: '12px',
						}}
						key={index}
						onClick={() => notificationsListOnClick(ele)}
					>
						<span className="notificationTitle">{ele?.title}</span>
						{ele?.notification?.map((item, ind) => (
							<div className="actionListItem" key={ind}>
								<span className="notificationIconContainer">{ele?.icon}</span>
								{item}

								{checkConnection(ele) ? (
									<div className="notificationConnectionContainer">
										Connected
										<div className="connectedDivIndicator"></div>
									</div>
								) : (
									<div className="notificationConnectionContainer">
										Connect
										<RightArrrow />
									</div>
								)}
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
	selectedTemplate,
	togglePreviewAndEditModal,
	changeSubjectOrEmailBody,
	createNewNotificationNode,
	handleEmailTitleChange,
	editMode,
	activeStepsData,
	editNotificationNode,
	addNewStep,
	googleAccountOptions,
	selectedGoogleAccount,
	recipientEmail,
	stepTitle,
	stepDescription,
	handleUpdateState,
	variables,
}) => {
	const modifiedHandleClick = useCallback(() => {
		// if (!info?.title?.length) {
		// 	return message.error('title is mandatory');
		// }
		// if (!info?.selectedTemplate) {
		// 	return message.error('email Template Selections is mandatory');
		// }

		// if (editMode) {
		// 	return editNotificationNode();
		// }

		addNewStep();
	}, [info]);

	return (
		<div className="createTaskUiContainer">
			<div className="createTasksUi">
				<div className="createTasksHeadingContainer">
					<div className="createHeadingLabelContainer">
						<div className="createTaskHeadingLabel">
							<span className="actionsCreateHeader">Send Notification</span>
							<span className="createTaskHeading">Send Email</span>
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
					<input
						type="text"
						name=""
						id=""
						className="stepTitleInput"
						placeholder="Add step title"
						value={stepTitle}
						onChange={(e) => handleUpdateState({ stepTitle: e.target.value })}
					/>
					<input
						type="text"
						name=""
						id=""
						className="stepDescriptionInput"
						placeholder="Add step description..."
						value={stepDescription}
						onChange={(e) => handleUpdateState({ stepDescription: e.target.value })}
					/>
				</div>

				<div className="notificationInputsContainer">
					<h2 className="notificationInputsTitle">Inputs</h2>
					<div className="notificationInputItem">
						<span className="notificationInputTitle">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) =>
								handleUpdateState({ selectedGoogleAccount: option })
							}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="notificationInputItem">
						<span className="notificationInputTitle">
							Recipient email<sup>*</sup>
						</span>
						<VariableComponent
							value={recipientEmail}
							onChange={(value) => handleUpdateState({ recipientEmail: value })}
							variables={variables}
						/>
						{/* <div className="inputContainer">
							<input
								className="input"
								placeholder="Select an option or type here"
								value={recipientEmail}
								onChange={(e) =>
									handleUpdateState({ recipientEmail: e.target.value })
								}
							/>
							<div className="inputBottomSection">Insert variable</div>
						</div> */}
						<div className="inputButtonWrapper">
							<button className="sidebarButton">CC</button>
							<button className="sidebarButton">BCC</button>
						</div>
					</div>

					<div className="notificationInputItem">
						{!selectedTemplate ? (
							<div
								className="chooseEmailTemplateButton"
								onClick={() => changeStage({ activeStage: 'stage3' })}
							>
								Choose from Template
							</div>
						) : (
							<div className="editEmailTemplateContainer">
								<span className="emailTemplateSubTitle">Email Template</span>
								<div
									className="editSelectedTemplateOptions"
									onClick={togglePreviewAndEditModal}
								>
									<span>{selectedTemplate?.title}</span>
									<div className="editSelectedEmailOptionContainer">
										Email Template <Edit />
									</div>
								</div>
								<div className="emailTemplateActionContainer">
									<button
										className="sidebarButton"
										onClick={() => changeStage({ activeStage: 'stage3' })}
									>
										Change
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* <div className="chooseEmailTemplateContainer">
					<span className="chooseEmailTemplateLabel">Select Email Template</span>
					{!selectedTemplate ? (
						<div
							className="chooseEmailTemplateButton"
							onClick={() => changeStage({ activeStage: 'stage3' })}
						>
							Choose from Template
						</div>
					) : (
						<div className="editEmailTemplateContainer">
							<span className="emailTemplateSubTitle">Email Template</span>
							<div
								className="editSelectedTemplateOptions"
								onClick={togglePreviewAndEditModal}
							>
								<span>{selectedTemplate?.title}</span>
								<div className="editSelectedEmailOptionContainer">
									Email Template <Edit />
								</div>
							</div>
							<div className="emailTemplateActionContainer">
								<div
									className="changeSelectedEmailTemplateButton"
									onClick={() => changeStage({ activeStage: 'stage3' })}
								>
									Change
								</div>
							</div>
						</div>
					)}
				</div> */}

				<div className="includeSendSmartFileSectionsContainer">
					<div className="includeSendSmartFileSections">
						<span>Sent smart file with this</span>
						<ToggleSlider
							value={info?.includeSmartFile}
							onChange={(data) => {
								changeStage({ includeSmartFile: data });
							}}
						/>
					</div>
					{info?.includeSmartFile ? (
						!info?.selectedSmartFileTemplate ? (
							<div
								className="chooseEmailTemplateButton"
								onClick={() => changeStage({ activeStage: 'stage4' })}
							>
								Choose from Template
							</div>
						) : (
							<>
								<div className="selectedSmartFileContainer">
									{info?.selectedSmartFileTemplate?.title}
								</div>
								<div
									className="changeSmartFileButton"
									onClick={() => changeStage({ activeStage: 'stage4' })}
								>
									Change
								</div>
							</>
						)
					) : (
						''
					)}
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
			<EditAndViewEmailTemplateModal
				open={info?.previewAndEdit}
				closeModal={togglePreviewAndEditModal}
				subject={selectedTemplate?.subject}
				emailBody={selectedTemplate?.htmlBody}
				changeSubjectOrEmailBody={changeSubjectOrEmailBody}
			/>
		</div>
	);
};
const Stage3 = ({ emailTemplates, selectedTemplate, handleSelectEmailTemplate }) => {
	return (
		<div className="notificationEmailTemplatesContainer">
			{emailTemplates?.map((ele, index) => (
				<div
					className="emailTemplatesCard"
					key={index}
					style={{
						backgroundColor: ele?._id === selectedTemplate?._id ? '#202123' : '',
					}}
					onClick={() => handleSelectEmailTemplate(ele)}
				>
					<div className="emailTemplateCardContent">
						<span className="emailTemplateTitle">{ele?.title}</span>
						<span className="emailTemplateSubjectStyling">{ele?.subject}</span>
					</div>

					{ele?._id === selectedTemplate?._id ? <FilledTick /> : ''}
				</div>
			))}
		</div>
	);
};

const Stage4 = ({
	info,
	fetcMoreDocsFilesList,
	selectedSmartFileTemplate,
	handleSelectedSmartFileTemplate,
}) => {
	return (
		<div className="notificationEmailTemplatesContainer">
			<InfiniteScroll
				dataLength={info?.workflowTemplates?.length || 0}
				next={fetcMoreDocsFilesList}
				hasMore={info?.hasNextPage}
				loader={<FetchMoreLoaderComp />}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
					width: '100%',
				}}
				className="tetsing"
				height="calc(100vh - 52px - 80px - 80px )"
			>
				{info?.workflowTemplates?.map((ele, index) => (
					<div
						className="emailTemplatesCard"
						key={index}
						style={{
							backgroundColor:
								ele?._id === selectedSmartFileTemplate?._id ? '#202123' : '',
						}}
						onClick={() => handleSelectedSmartFileTemplate(ele)}
					>
						<div className="emailTemplateCardContent">
							<span className="emailTemplateTitle">{ele?.title}</span>
							{/* <span className="emailTemplateSubjectStyling"></span> */}
						</div>

						{ele?._id === selectedSmartFileTemplate?._id ? <FilledTick /> : ''}
					</div>
				))}
			</InfiniteScroll>
		</div>
	);
};

const Stage5 = ({
	info,
	changeStage,
	handleEmailTitleChange,
	onChangeSlackChannels,
	handleSlackMessageChange,
	createNewNotificationSlackNode,
	activeStepsData,
	editMode,
	editNotificationSlackNode,
}) => {
	const modifiedSaveClick = useCallback(() => {
		if (!info?.title?.length) {
			return message.error('title is mandatory');
		}
		if (editMode) {
			return editNotificationSlackNode();
		}
		createNewNotificationSlackNode();
	}, [createNewNotificationSlackNode, info]);

	return (
		<div className="createTaskUiContainer">
			<div className="createTasksUi">
				<div className="createTasksHeadingContainer">
					<div className="createHeadingLabelContainer">
						<div className="createTaskHeadingLabel">
							<span className="actionsCreateHeader">Send Notification</span>
							<span className="createTaskHeading">Send Slack Message</span>
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
					<span className="addTaskTitleTextStyle">Add Slack Title</span>
					<textarea
						className="addTaskTitleTextArea"
						placeholder="Add Slack description..."
						value={info?.title}
						onChange={handleEmailTitleChange}
					/>
				</div>
				<div className="addTaskTitleContainer">
					<span className="addTaskTitleTextStyle">Inputs</span>
					<div className="actionDropDownContainer" style={{ marginTop: '18px' }}>
						<span className="actionTitle">Slack Channel</span>
						<HeadersDropDownComp
							options={info?.slackChannelsOptions}
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

					<div className="actionDropDownContainer" style={{ marginTop: '18px' }}>
						<span className="actionTitle">Message</span>
						<textarea
							className="slackMessageTextArea"
							placeholder="Type your message here..."
							value={info?.slackMessage}
							onChange={handleSlackMessageChange}
						/>
					</div>
				</div>
			</div>
			{editMode ? (
				<div className="actionsSaveButton" onClick={modifiedSaveClick}>
					{info?.saveLoader ? <Spin /> : 'Update'}
				</div>
			) : (
				<div className="actionsSaveButton" onClick={modifiedSaveClick}>
					{info?.saveLoader ? <Spin /> : 'Save'}
				</div>
			)}
		</div>
	);
};
