import React, { useState, useEffect, useCallback, memo, useMemo, useContext } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowBuilderSidebarComponents/notification.scss';
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

const notificationList = {
	Google: { title: 'Google', notification: ['Send Email'], icon: <Google />, id: 'email' },
	Slack: {
		title: 'Slack',
		notification: ['Send Slack Message', 'Send Slack Actions'],
		icon: <Slack />,
		id: 'Slack',
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
};
const Notification = ({ onCLose, templateId, activeEdge }) => {
	const {
		templates: {
			allEmailTemplates,
			addNewSteps,
			updateStateValues,
			specificTemplatesInfo,
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialState });

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	useEffect(() => {
		if (allEmailTemplates) {
			setInfo((prev) => ({
				...prev,
				emailTemplates: allEmailTemplates?.data,
				// selectedTemplate: allEmailTemplates?.data?.[0],
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
		onCLose();
		setInfo((prev) => ({
			...prev,
			...initialState,
			workflowTemplates: prev.workflowTemplates,
		}));
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

	const handleEmailTitleChange = useCallback((e) => {
		setInfo((prev) => ({ ...prev, title: e.target.value }));
	}, []);
	const stageMapper = useMemo(() => {
		return {
			stage1: <Stage1 info={info} handleSearch={handleSearch} changeStage={changeStage} />,
			stage2: (
				<Stage2
					changeStage={changeStage}
					info={info}
					selectedTemplate={info?.selectedTemplate}
					togglePreviewAndEditModal={togglePreviewAndEditModal}
					changeSubjectOrEmailBody={changeSubjectOrEmailBody}
					createNewNotificationNode={createNewNotificationNode}
					handleEmailTitleChange={handleEmailTitleChange}
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
		};
	}, [info, handleSearch]);

	return (
		<div className="actionSidebarComponents">
			<div className="actionSidebarComponentsHeader">
				<span onClick={modifiedClose} style={{ cursor: 'pointer' }}>
					<DoubleArrow />
				</span>
			</div>
			{stageMapper?.[info?.activeStage]}
		</div>
	);
};

export default memo(Notification);

const Stage1 = ({ info, handleSearch, changeStage }) => {
	const notificationsListOnClick = useCallback((data) => {
		if (data?.id === 'email') {
			changeStage({ activeStage: 'stage2', selectedChannel: data?.id });
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
						onClick={() => notificationsListOnClick(ele)}
					>
						<span className="notificationTitle">{ele?.title}</span>
						{ele?.notification?.map((item, ind) => (
							<div className="actionListItem" key={index}>
								<span className="notificationIconContainer">{ele?.icon}</span>
								{item}
								<div className="notificationConnectionContainer">
									{' '}
									Connect
									<RightArrrow />
								</div>
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
}) => {
	const modifiedHandleClick = useCallback(() => {
		if (!info?.title?.length) {
			return message.error('title is mandatory');
		}
		if (!info?.selectedTemplate) {
			return message.error('email Template Selections is mandatory');
		}
		createNewNotificationNode();
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
					<span className="addTaskTitleTextStyle">Add Email Title</span>
					<textarea
						className="addTaskTitleTextArea"
						placeholder="Add Email description..."
						value={info?.title}
						onChange={handleEmailTitleChange}
					/>
				</div>

				<div className="chooseEmailTemplateContainer">
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
				</div>

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
			<div className="actionsSaveButton" onClick={modifiedHandleClick}>
				{info?.saveLoader ? <Spin /> : 'Save'}
			</div>
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
