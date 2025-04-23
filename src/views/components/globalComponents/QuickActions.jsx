/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from 'antd';
import { useContext, useState, useCallback, useEffect, memo, useMemo } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import LoaderModal from '../modalsV2/automationBuilder/AutomationLoaderModal';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ProposalsPopup from '../../../views/components/docs/ProposalsPopup';
import CreateClientModal from '../../../views/components/modalsV2/contacts/CreateClientModal';
import CreateGallery from '../../../views/components/modalsV2/gallery/CreateGallery';
import CreateTaskPopup from '../modalsV2/tasks/CreateTaskPopup';
import { message } from '../globalComponents/CustomToast';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import { colors } from '../../features/tasks/Tasks';
import jwtDecode from 'jwt-decode';
const moduleOptions = [
	{
		id: 0,
		title: 'Contact/Lead',
		value: 'contacts',
		controlValue: 'contact',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openClientPopup: true }));
		},
	},
	{
		id: 1,
		title: 'Task',
		value: 'task',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, createTaskPopup: true }));
		},
	},
	{
		id: 2,
		title: 'Event',
		value: 'event',
		action: ({ navigate }) => {
			navigate('/calendar');
		},
	},
	// {
	// 	id: 3,
	// 	title: 'Session',
	// 	value: 'session',
	// 	controlValue: 'calendar',
	// 	action: ({ navigate }) => {
	// 		navigate('/calendar');
	// 	},
	// },
	{
		id: 4,
		title: 'Documents',
		value: '',
		controlValue: 'all',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: '' }));
		},
	},
	{
		id: 5,
		title: 'Form',
		value: 'form-submission',
		controlValue: 'form',
		action: ({ setInfo }) => {
			setInfo((prev) => ({
				...prev,
				openProposalPopup: true,
				commonState: 'form-submission',
			}));
		},
	},
	{
		id: 6,
		title: 'Proposal',
		value: 'proposal',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'proposal' }));
		},
	},
	{
		id: 7,
		title: 'Invoice',
		value: 'invoice',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'invoice' }));
		},
	},
	{
		id: 8,
		title: 'Contracts',
		value: 'contract',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'contract' }));
		},
	},
	{
		id: 9,
		title: 'Presentation',
		value: 'presentation',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'presentation' }));
		},
	},
	{
		id: 10,
		title: 'Automation',
		value: 'automation',
		controlValue: 'automation',
		action: async ({ setInfo, navigate, createAutomation, info }) => {
			if (info?.isAutomationLoading) return;
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating automation...',
				}));
				const response = await createAutomation({
					name: 'Untitled Automation',
					version: 1,
					steps: [],
					status: 'draft',
				});
				if (response?.[0]) {
					navigate(`/automation-builder/${response?.[1]?._id}`);
				} else {
					message.error('Failed to create automation');
				}
			} catch (error) {
				message.error('Failed to create automation');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
	{
		id: 11,
		title: 'Conversational Agent',
		value: 'ai-assistant',
		controlValue: 'conversationalAgent',
		action: async ({ setInfo, createNewAiAssistant, navigate }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating AI Assistant...',
				}));
				const aiAssistantId = await createNewAiAssistant({
					name: 'Untitled Assistant',
				});
				if (aiAssistantId) {
					navigate(`/ai-assistant/${aiAssistantId}/edit`);
				}
			} catch (error) {
				message.error('Failed to create AI Assistant');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
	{
		id: 12,
		title: 'Classic Gallery',
		value: 'galleries',
		controlValue: 'classicGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openGalleryPopup: true }));
		},
	},
	{
		id: 13,
		title: 'Lite Gallery',
		value: 'lite-gallery',
		controlValue: 'liteGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openLiteGalleryPopup: true }));
		},
	},
	{
		id: 14,
		title: 'Note',
		value: 'note',
		action: async ({ setInfo, navigate, createNotesList }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating note...',
				}));
				const payload = {
					input: {
						title: 'New Note',
					},
				};
				const response = await createNotesList(payload);
				if (response?.[1]?._id) {
					navigate(`/note/${response[1]._id}`);
				}
			} catch (error) {
				message.error('Failed to create note');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
	{
		id: 15,
		title: 'Knowledge Agent',
		value: 'knowledge-agent',
		controlValue: 'knowledgeAgent',
		action: async ({ setInfo, navigate, createNewKnowledgeAgent }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating knowledge agent...',
				}));
				const [, data] = await createNewKnowledgeAgent('Untitled Assistant');
				const aiAssistantId = data?.insertedId;
				if (aiAssistantId) {
					navigate(`/knowledge-agent/${aiAssistantId}/edit`);
				}
			} catch (error) {
				console.log(error);

				message.error('Failed to create knowledge agent');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
];

const defaultPreference = {
	taskSlNo: { show: false, order: 1 },
	title: { show: true, order: 2 },
	parentTask: { show: false, order: 3 },
	childTasks: { show: false, order: 4 },
	description: { show: false, order: 5 },
	status: { show: true, order: 6 },
	priority: { show: true, order: 7 },
	clients: { show: true, order: 8 },
	assignedTo: { show: true, order: 9 },
	dueDate: { show: true, order: 10 },
	assignedBy: { show: true, order: 11 },
	assignedAt: { show: false, order: 12 },
	completedAt: { show: false, order: 13 },
	createdAt: { show: false, order: 14 },
	updatedAt: { show: false, order: 15 },
};

const QuickActions = ({ styles, suggestedOptions = [], timeout = null, clientDetails = null }) => {
	const {
		templates: { toggleCreateLeadModal },
		profileInfo: { tenantUserAccessControls },
		automationBuilder: { createAutomation },
		aiSetup: { createNewAiAssistant },
		notes: { createNotesList },
		knowledgeAgent: { createNewKnowledgeAgent },
		tasks: {
			getTaskMetadata,
			taskMetadata,
			getTaskPreferences,
			updateTaskPreferences,
			taskPreference,
			addListItem,
			addSubTask,
			updateTaskState,
		},
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		dropdown: false,
		openProposalPopup: false,
		openClientPopup: false,
		openGalleryPopup: false,
		openLiteGalleryPopup: false,
		// openTaskPopup: false,
		options: { suggestedOptions, moduleOptions },
		filteredOptions: { suggestedOptions, moduleOptions },
		isAutomationLoading: false,
		commonState: 'All',
		search: '',
		createTaskPopup: false,
		conversationalAgentLoading: false,
		creatingNoteLoader: false,
		openDocumentPopup: false,
		openedModalType: null,
		loaderMessage: '',
		showLoader: false,
		taskMetadata: null,
		tenantUsers: [],
		taskPreferences: {
			preferenceType: 'taskPreference',
			preferences: defaultPreference,
		},
		group: null,
		page: 1,
	});

	const responseMetadata = useMemo(
		() => ({
			title: {
				type: 'text',
				name: 'Title',
				Icon: textSvg,
				props: {},
				doSplit: true,
				isTitle: true,
			},
			description: { type: 'text', name: 'Description', Icon: textSvg, props: {} },
			status: {
				type: 'status',
				name: 'Status',
				Icon: PieSvg,
				props: {
					options: {
						todo: info?.taskMetadata?.todoGroupLabels,
						inProgress: info?.taskMetadata?.inProgressGroupLabels,
						completed: info?.taskMetadata?.completedGroupLabels,
					},
				},
			},
			priority: {
				type: 'select',
				name: 'Priority',
				Icon: PrioritySvg,
				props: {
					options: [
						{ label: 'Low', _id: 'low', color: '1' },
						{ label: 'Medium', _id: 'medium', color: '2' },
						{ label: 'High', _id: 'high', color: '3' },
					],
				},
			},
			parentTask: {
				type: 'parentTask',
				name: 'Parent Task',
				Icon: WorkflowSvg,
				props: { options: info?.parentTasks },
			},
			childTasks: {
				type: 'childTasks',
				name: 'Sub Tasks',
				Icon: WorkflowSvg,
				props: {},
			},
			assignedTo: {
				type: 'person',
				name: 'Assigned To',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					multiSelect: true,
					parseValue: true,
				},
			},
			dueDate: { type: 'date', name: 'Due Date', Icon: ClockSvg, props: {} },
			assignedBy: {
				type: 'person',
				name: 'Assigned By',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					disabled: true,
					parseValue: true,
				},
			},
			assignedAt: {
				type: 'date',
				name: 'Assigned At',
				Icon: ClockSvg,
				props: { timestamp: true },
			},
			completedAt: { type: 'date', name: 'Completed At', Icon: CalendarSvg, props: {} },
			createdAt: {
				type: 'date',
				name: 'Created At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			updatedAt: {
				type: 'date',
				name: 'Updated At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			createdBy: {
				type: 'person',
				name: 'Created By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			updatedBy: {
				type: 'person',
				name: 'Updated By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			taskSlNo: {
				type: 'id',
				name: 'Id',
				Icon: textSvg,
				props: { prefix: info?.taskMetadata?.prefix },
			},
			clients: {
				type: 'personMultiSelect',
				name: 'Clients',
				Icon: PersonSvg,
				props: {},
			},
		}),
		[info?.tenantUsers, info?.taskMetadata],
	);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseMetadata) {
			if (key === '__typename' || key === '_id' || key === 'completedAt') {
				continue;
			}

			const {
				type = null,
				name = null,
				Icon = null,
				isTitle = false,
			} = responseMetadata[key] || {};
			const { show, order } = info?.taskPreferences?.preferences?.[key] || {
				show: false,
				order: 0,
			};

			properties.push({
				value: key,
				type,
				label: name,
				Icon,
				show,
				order,
				isTitle,
			});
		}
		return properties;
	}, [info?.taskPreferences?.preferences]);

	const accessibleOptions = useCallback(
		(options) => {
			return tenantUserAccessControls?.role === 'admin'
				? options
				: options?.filter((option) => {
						if (!option?.controlValue) {
							return true;
						}
						const matchedApp = tenantUserAccessControls?.accessControls?.find(
							(item) =>
								item?.app?.toLowerCase() === option?.controlValue?.toLowerCase(),
						);
						if (!matchedApp) {
							return false;
						}
						return matchedApp?.isEnabled;
				  });
		},
		[tenantUserAccessControls],
	);

	const filtereOptions = useCallback(
		(searchKey = '') => {
			if (!info?.options) return { suggestedOptions: [], moduleOptions: [] };

			const searchTerm = searchKey.toLowerCase();
			let suggestedOptions = searchKey
				? info?.options?.suggestedOptions?.filter((option) =>
						option?.title?.toLowerCase().includes(searchTerm),
				  )
				: info?.options?.suggestedOptions;

			let moduleOptions = searchKey
				? info?.options?.moduleOptions?.filter((option) =>
						option?.title?.toLowerCase().includes(searchTerm),
				  )
				: info?.options?.moduleOptions;

			moduleOptions = accessibleOptions(moduleOptions);
			suggestedOptions = accessibleOptions(suggestedOptions);

			return { suggestedOptions, moduleOptions };
		},
		[info?.options, tenantUserAccessControls],
	);

	const navigate = useNavigate();

	useEffect(() => {
		const options = filtereOptions();
		setInfo((prev) => ({ ...prev, filteredOptions: options }));
	}, [filtereOptions]);

	useEffect(() => {
		const fetchTaskMetadata = async () => {
			await getTaskMetadata(); // Fetch task metadata
		};
		if (!taskMetadata) {
			fetchTaskMetadata();
		}
	}, []); // Run when getTaskMetadata changes

	useEffect(() => {
		if (taskMetadata) {
			setInfo((prev) => ({ ...prev, taskMetadata })); // Update info.taskMetadata when taskMetadata changes
		}
	}, [taskMetadata]); // Run when taskMetadata changes

	useEffect(() => {
		if (info?.taskPreferences?.preferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				properties: mapPropertyType(),
			}));
		}
	}, [info?.taskPreferences?.preferences]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = tenantsUserList?.map(({ firstName, lastName, _id }) => ({
				label: `${firstName} ${lastName}`,
				value: _id,
			}));

			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
			}));
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (!info.dropdown) {
			// Reset search and filtered options when dropdown closes
			setInfo((prev) => ({
				...prev,
				search: '',
				filteredOptions: {
					suggestedOptions: accessibleOptions(suggestedOptions),
					moduleOptions: accessibleOptions(moduleOptions),
				},
			}));
		}
	}, [info.dropdown, accessibleOptions]);

	useEffect(() => {
		if (taskPreference === null) {
			getTaskPreferences({ preferences: 'taskPreference' });
			return;
		}

		if (taskPreference?.error || taskPreference?.data === false) {
			updateTaskPreferences({
				preferenceType: 'taskPreference',
				data: defaultPreference,
			});

			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'taskPreference',
					preferences: defaultPreference,
				},
			}));
			return;
		}

		setInfo((prevInfo) => ({
			...prevInfo,
			taskPreferences: {
				preferenceType: 'taskPreference',
				preferences: taskPreference?.data,
			},
		}));
	}, [taskPreference]);

	const addNewTask = useCallback(
		async (payload) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				if (info?.isCreatingSubtask) {
					payload.parentTaskId = info?.selectedRow?._id;
				}
				const response = await addListItem({ input: payload });

				if (response) {
					const task = response?.createTask;

					if (task) {
						const token = localStorage.getItem('usertoken');
						const { user_id, userName } = jwtDecode(token);

						const newTask = { ...task };
						newTask.createdBy = { _id: user_id, name: userName };
						newTask.updatedBy = { _id: user_id, name: userName };
						if (info?.isCreatingSubtask) {
							newTask.parentTask = {
								title: info?.selectedRow?.title,
								_id: info?.selectedRow?._id,
							};
							addSubTask(newTask);
						}
						message.success('Task added successfully');
						if (!info?.isCreatingSubtask) {
							if (payload?.assignedTo || payload?.dueDate) {
								updateTaskState({
									refetchTasksForDue: true,
									listTasksForToday: null,
									listTasksForOverdue: null,
									listTasksDueTillToday: null,
								});
							}
						}
					}
				} else {
					throw new Error('Failed to add new task');
				}
			}
		},
		[info?.isCreatingSubtask, info?.selectedRow?._id],
	);

	const handleDebounceSearch = useCallback(
		(search = null) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			const options = filtereOptions(search);
			setInfo((prev) => ({ ...prev, filteredOptions: options }));
		},
		[filtereOptions],
	);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e?.target?.value }));
		if (e?.target?.value === '' || e?.target?.value === null) {
			handleDebounceSearch('');
		} else {
			handleDebounceSearch(e.target.value);
		}
	};
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottomRight"
				align="right"
				open={info?.dropdown}
				trigger={'hover'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				rootClassName="customQuickActionsToolTip"
				title={
					<div className="quick-actions-dropdown-options-container">
						<div className="top-search-container">
							<img src={Search} alt="searchh" />
							<input
								type="text"
								placeholder="Search Anything"
								value={info?.search}
								onChange={handleSearch}
							/>
						</div>
						{info?.filteredOptions?.suggestedOptions?.length > 0 && (
							<div className="suggested-modules-container">
								<div className="suggested-modules-container-header">Suggested</div>
								<div className="suggested-modules-container-options">
									{info?.filteredOptions?.suggestedOptions?.map((option) => (
										<div
											key={option?.id}
											className="dropdown-option"
											onClick={() =>
												option?.action({
													setInfo,
													navigate,
													createNewAiAssistant,
													createAutomation,
													createNotesList,
													createNewKnowledgeAgent,
												})
											}
										>
											{option?.icon && <img src={option?.icon} alt="icon" />}
											{option?.title}
										</div>
									))}
								</div>
							</div>
						)}
						{info?.filteredOptions?.moduleOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Module Actions</div>
								<div className="modules-container-options">
									{info?.filteredOptions?.moduleOptions?.map((option) => (
										<div
											key={option?.id}
											className="dropdown-option"
											onClick={() =>
												option?.action({
													setInfo,
													navigate,
													createNewAiAssistant,
													createAutomation,
													createNotesList,
													createNewKnowledgeAgent,
												})
											}
										>
											{option?.icon && <img src={option?.icon} alt="icon" />}
											{option?.title}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				}
			>
				<button
					className="dropdown-header"
					onClick={() => setInfo({ ...info, dropdown: !info?.dropdown })}
				>
					New
				</button>
			</Tooltip>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() => setInfo({ ...info, openProposalPopup: false })}
				clientDetails={clientDetails}
				commonState={info?.commonState}
			/>
			<CreateClientModal
				modalIsOpen={info?.openClientPopup}
				closeModal={() => setInfo({ ...info, openClientPopup: false })}
				leadOrClient={true}
			/>
			<CreateGallery
				open={info?.openGalleryPopup}
				closeModal={() => setInfo({ ...info, openGalleryPopup: false })}
			/>
			<CreateGallery
				open={info?.openLiteGalleryPopup}
				closeModal={() => setInfo({ ...info, openLiteGalleryPopup: false })}
				isLightGallery={true}
			/>
			<CreateTaskPopup
				isOpen={info?.createTaskPopup}
				closeModal={() => setInfo({ ...info, createTaskPopup: false })}
				responseMetadata={responseMetadata}
				colors={colors}
				tenantUsers={info?.tenantUsers}
				addNewTask={addNewTask}
			/>
			<LoaderModal loading={info?.showLoader} message={info?.loaderMessage} />
		</div>
	);
};

export default memo(QuickActions);
