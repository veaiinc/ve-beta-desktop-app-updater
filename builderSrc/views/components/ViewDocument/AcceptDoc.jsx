import React, { memo, useState, useEffect, useContext, useMemo } from 'react';
import ReactModal from '../../components/ui-components/modal';
import { Collapse, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import '../../../assets/scss/document/acceptModel.scss';
// import Spinner from '../loaders/Spinner';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { message } from '../../../../src/views/components/globalComponents/CustomToast';
import moment from 'moment';
import TaskCard from './taskCard/TaskCard';
// import { EventTask } from './taskCard/EventTask';
import EventCreation from './taskCard/EventCreation';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const getToday = () => dayjs().format('YYYY-MM-DD');

const stripHtml = (str) => (str ? str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '') : '');

const getServiceDescription = (item) => {
	const descParts = [];
	if (item.description) descParts.push(stripHtml(item.description));
	if (item.quantity !== undefined)
		descParts.push(`Quantity: ${item.quantity}${item.unit ? ' ' + item.unit : ''}`);
	if (item.unitPrice !== undefined)
		descParts.push(
			`Unit Price: ${item.currency === 'INR' ? '₹' : ''}${Number(
				item.unitPrice,
			).toLocaleString('en-IN')}`,
		);
	if (item.amount !== undefined)
		descParts.push(
			`Amount: ${item.currency === 'INR' ? '₹' : ''}${Number(item.amount).toLocaleString(
				'en-IN',
			)}`,
		);
	return descParts.join(' | ');
};

const getEventDescription = (event) => {
	const descParts = [];
	if (event.description) descParts.push(stripHtml(event.description));
	if (event.date) {
		// Format the date
		const m = moment(event.date, ['YYYY-MM-DD', 'YYYYMMDD', moment.ISO_8601], true);
		if (m.isValid()) {
			descParts.push(`Date: ${m.format('MMM DD, YYYY')}`);
		} else {
			descParts.push(`Date: ${event.date}`);
		}
	}
	if (event.location) descParts.push(`Location: ${event.location}`);
	if (event.numberOfGuests !== undefined) descParts.push(`Guests: ${event.numberOfGuests}`);
	return descParts.join(' | ');
};

const AcceptDocumentModel = ({ open, closeModal }) => {
	const {
		templates: { workflowInfoDetails, moveWorkflowStatus },
		tasks: { taskMetadata, getTaskMetadata, addListItem },
		calendarInfo: { createCalendarEvent, calendarCategoriesList, getCalendarCategories },
	} = useContext(Context);
	const navigate = useNavigate();
	// State to control contract sign modal
	const [showContractSignModal, setShowContractSignModal] = useState(false);

	// Centralized info state
	const [info, setInfo] = useState({
		taskMetadata: null,
		taskState: [],
		eventState: [],
		activeTaskKey: null,
		activeEventKeys: [],
		calendarCategories: [],
	});

	// Add new state for editing
	const [editingTask, setEditingTask] = useState({ key: null, field: null });
	const [editingEvent, setEditingEvent] = useState({ key: null, field: null });
	const [taskEditFields, setTaskEditFields] = useState({});
	const [eventEditFields, setEventEditFields] = useState({});

	// Fetch taskMetadata if needed
	useEffect(() => {
		if (open && !info.taskMetadata) {
			getTaskMetadata();
			setInfo((prev) => ({
				...prev,
				taskMetadata: taskMetadata,
			}));
		}
	}, [open, taskMetadata]);

	useEffect(() => {
		if (!calendarCategoriesList) {
			getCalendarCategories();
		} else {
			setInfo((prev) => ({
				...prev,
				...(!calendarCategoriesList?.error && {
					calendarCategories: [...calendarCategoriesList],
				}),
			}));
		}
	}, [calendarCategoriesList]);

	// Extract tables from summary
	const { tables = [] } = workflowInfoDetails?.summary || {};
	const serviceTables = tables.filter((t) => t.type === 'services');
	const eventTables = tables.filter((t) => t.type === 'events');

	// Helper to filter service items based on services_selection, show, and isSelected (table version)
	const filterServiceTableItems = (items, selection) => {
		if (!Array.isArray(items)) return [];
		if (selection === 2) {
			return items.filter((item) => item.show);
		} else if (selection === 1 || selection === 0) {
			return items.filter((item) => item.show && item.isSelected);
		}
		return items;
	};

	// Flatten all service items
	const allServiceItems = useMemo(
		() =>
			serviceTables.flatMap((table) => {
				const styles = table.styles || {};
				const filteredItems = filterServiceTableItems(
					table.values || [],
					styles.services_selection,
				);
				return filteredItems.map((item) => ({
					...item,
					key: item.subBlockId || item._id || item.id || item.key,
					title: stripHtml(item.title) || '',
					description: getServiceDescription(item),
					checked: true,
					tableId: table._id,
				}));
			}),
		[JSON.stringify(serviceTables)],
	);

	// Flatten all event items
	const allEventItems = useMemo(
		() =>
			eventTables.flatMap((table) =>
				(table.values || []).map((item) => ({
					...item,
					key: item.subBlockId || item._id || item.id || item.key,
					title: stripHtml(item.name || item.title) || '',
					description: getEventDescription(item),
					checked: true,
					tableId: table._id,
				})),
			),
		[JSON.stringify(eventTables)],
	);

	// Initialize taskState and eventState in info

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			// taskState: allServiceItems.map((t) => ({ ...t, checked: true })),
			//jeevan changess
			taskState: allServiceItems.map((t) => ({
				...t,
				checked: true,
				assignedTo: t.assignedTo || { tenantUsers: [] },
				priority: t.priority || 'low',
				status: t.status || statusId || '', // default status
				title: t.title || '',
			})),
			activeTaskKey: null,
		}));
	}, [JSON.stringify(allServiceItems)]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			eventState: allEventItems.map((e) => ({ ...e, checked: true })),
			activeEventKeys: [],
		}));
	}, [JSON.stringify(allEventItems)]);

	// Compute default statusId for tasks using info.taskMetadata
	const combinedTaskMetadata = useMemo(() => {
		return info.taskMetadata?.todoGroupLabels
			?.concat(info.taskMetadata?.inProgressGroupLabels)
			.concat(info.taskMetadata?.completedGroupLabels);
	}, [info.taskMetadata]);

	const statusId = useMemo(() => {
		return combinedTaskMetadata?.find((item) => item.isDefault === true)?._id;
	}, [combinedTaskMetadata]);

	const allTasksChecked = info.taskState.length > 0 && info.taskState.every((t) => t.checked);
	const handleSelectAllTasks = () => {
		setInfo((prev) => ({
			...prev,
			taskState: prev.taskState.map((t) => ({ ...t, checked: !allTasksChecked })),
		}));
	};
	const handleTaskCheck = (key) => {
		setInfo((prev) => ({
			...prev,
			taskState: prev.taskState.map((t) =>
				t.key === key ? { ...t, checked: !t.checked } : t,
			),
		}));
	};

	const allEventsChecked = info.eventState.length > 0 && info.eventState.every((e) => e.checked);
	const handleSelectAllEvents = () => {
		setInfo((prev) => ({
			...prev,
			eventState: prev.eventState.map((e) => ({ ...e, checked: !allEventsChecked })),
		}));
	};
	const handleEventCheck = (key) => {
		setInfo((prev) => ({
			...prev,
			eventState: prev.eventState.map((e) =>
				e.key === key ? { ...e, checked: !e.checked } : e,
			),
		}));
	};
	const handleEventUpdate = (event, updateEvent) => {
		setInfo((prev) => ({
			...prev,
			eventState: prev.eventState.map((e) =>
				e.key === event.key ? { ...e, ...updateEvent } : e,
			),
		}));
	};

	// Helper to regenerate description for service
	const buildServiceDescription = (item) => {
		const descParts = [];
		if (item.description) descParts.push(stripHtml(item.description));
		if (item.quantity !== undefined)
			descParts.push(`Quantity: ${item.quantity}${item.unit ? ' ' + item.unit : ''}`);
		if (item.unitPrice !== undefined)
			descParts.push(
				`Unit Price: ${item.currency === 'INR' ? '₹' : ''}${Number(
					item.unitPrice,
				).toLocaleString('en-IN')}`,
			);
		if (item.amount !== undefined)
			descParts.push(
				`Amount: ${item.currency === 'INR' ? '₹' : ''}${Number(item.amount).toLocaleString(
					'en-IN',
				)}`,
			);
		return descParts.join(' | ');
	};
	// Helper to regenerate description for event
	const buildEventDescription = (event) => {
		const descParts = [];
		if (event.description) descParts.push(stripHtml(event.description));
		if (event.date) descParts.push(`Date: ${event.date}`);
		if (event.location) descParts.push(`Location: ${event.location}`);
		if (event.numberOfGuests !== undefined) descParts.push(`Guests: ${event.numberOfGuests}`);
		return descParts.join(' | ');
	};

	// When entering edit mode, initialize edit fields
	const handleTaskFieldEdit = (task, field) => {
		setEditingTask({ key: task.key, field });
		setTaskEditFields({ value: task[field] });
	};
	const handleEventFieldEdit = (event, field) => {
		setEditingEvent({ key: event.key, field });
		setEventEditFields({ value: event[field] });
	};
	const handleTaskFieldSave = (task, field) => {
		setInfo((prev) => ({
			...prev,
			taskState: prev.taskState.map((t) =>
				t.key === task.key ? { ...t, [field]: taskEditFields.value } : t,
			),
		}));
		setEditingTask({ key: null, field: null });
		setTaskEditFields({});
	};
	const handleEventFieldSave = (event, field) => {
		setInfo((prev) => ({
			...prev,
			eventState: prev.eventState.map((e) =>
				e.key === event.key ? { ...e, [field]: eventEditFields.value } : e,
			),
		}));
		setEditingEvent({ key: null, field: null });
		setEventEditFields({});
	};
	//jeevan changess
	const handleTaskUpdate = (task, updateTask) => {
		setInfo((prev) => ({
			...prev,
			taskState: prev.taskState.map((t) =>
				t.key === task.key ? { ...t, ...updateTask } : t,
			),
		}));
	};

	const handleAccept = async () => {
		// Check for tenant user signature before proceeding
		const contractTable = (workflowInfoDetails?.summary?.tables || []).find(
			(t) => t.type === 'contract-with-signature',
		);

		let tenantUserSigned = true;
		if (contractTable) {
			const tenantUser = (contractTable.values || []).find(
				(v) => v.userType === 'tenantUser',
			);
			if (tenantUser && !tenantUser.value) {
				navigate(
					`/builder/document/edit/${workflowInfoDetails?._id}?workflow=true&openSignature=true`,
				);
				return;
			}
		}

		if (!statusId) {
			message.error('Default status not found. Please check your workflow settings.');
			return;
		}
		const checkedTasks = info.taskState.filter((task) => task.checked);
		const checkedEvents = info.eventState.filter((event) => event.checked);
		let allSuccess = true;

		for (const task of checkedTasks) {
			// Always start with the original description
			const descriptionParts = [task.description || ''];

			// Helper function to check if a property already exists in description
			const hasProperty = (property) => task.description?.includes(property);

			// Add metadata only if not already present
			if (!hasProperty('Quantity:') && task.quantity !== undefined) {
				descriptionParts.push(
					`Quantity: ${task.quantity}${task.unit ? ' ' + task.unit : ''}`,
				);
			}
			if (!hasProperty('Unit Price:') && task.unitPrice !== undefined) {
				descriptionParts.push(
					`Unit Price: ${task.currency === 'INR' ? '₹' : ''}${Number(
						task.unitPrice,
					).toLocaleString('en-IN')}`,
				);
			}
			if (!hasProperty('Amount:') && task.amount !== undefined) {
				descriptionParts.push(
					`Amount: ${task.currency === 'INR' ? '₹' : ''}${Number(
						task.amount,
					).toLocaleString('en-IN')}`,
				);
			}

			// Filter out empty strings and join with separator
			const finalDescription = descriptionParts.filter((part) => part).join(' | ');

			const payload = {
				title: `${workflowInfoDetails?.clientDetails?.name} | ${task.title}`,
				description: finalDescription,
				// priority: 'low',
				// status: statusId,
				clients: [workflowInfoDetails?.clientDetails?._id],
				//jeevan changes
				priority: task.priority,
				status: task.status,
				// clients: [workflowInfoDetails?.clientDetails?._id],
				assignedTo: task.assignedTo,
				dueDate: task.dueDate,
			};

			try {
				await addListItem({ input: payload });
			} catch (e) {
				message.error('Error creating task:', e);
				allSuccess = false;
			}
		}

		// For events, use createCalendarEvent with the correct payload
		const calendarCategory = (info.calendarCategories || []).find((cat) => cat.type === 'all');

		for (const event of checkedEvents) {
			// Format date if it's in YYYYMMDD format
			const formatDateString = (dateStr) => {
				if (
					typeof dateStr === 'number' ||
					(typeof dateStr === 'string' && /^\d{8}$/.test(dateStr))
				) {
					const str = dateStr.toString();
					return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
				}
				return dateStr;
			};

			// Convert date format if needed
			const formattedDate = formatDateString(event.date);

			// Use startDate and endDate from event (already in YYYY-MM-DD format)
			const startDate = event.startDate || formattedDate || getToday();
			const endDate = event.endDate || formattedDate || getToday();

			// Create dates in Asia/Calcutta timezone to avoid UTC conversion issues
			const startDateTime = dayjs.tz(startDate, 'Asia/Calcutta').startOf('day').format();
			const endDateTime = dayjs.tz(endDate, 'Asia/Calcutta').endOf('day').format();

			const payload = {
				title: `${workflowInfoDetails?.clientDetails?.name} | ${event.title}`,
				description: event.description,
				location: event.location || null,
				startDateTime:
					event.startDateTime !== false && event.startDateTime
						? event.startDateTime
						: formattedDate || startDateTime,
				endDateTime:
					event.startDateTime !== false && event.startDateTime
						? event.startDateTime
						: formattedDate || endDateTime,
				timezone: 'Asia/Calcutta',
				allDay: true,
				calendarCategory: calendarCategory || null,
				meeting: null,
				phone: null,
				attendees: event.attendees,
				// Do not add numberOfGuests or any custom keys
			};
			try {
				await createCalendarEvent(payload);
			} catch (e) {
				allSuccess = false;
			}
		}

		try {
			await moveWorkflowStatus({
				updateWorkflowStatusId: workflowInfoDetails?._id,
				workflowInput: {
					status: 'confirmed',
				},
			});
		} catch (e) {
			allSuccess = false;
		}
		if (allSuccess) {
			message.success('Accepted and created successfully!');
		} else {
			message.error('Some items failed to process.');
		}
		closeModal();
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1002 },
				content: { borderRadius: '15px', zIndex: 1003 },
			}}
		>
			<div className="acceptDocumentModalParentContainer">
				<div className="acceptDocumentModalHeader">
					<div className="acceptDocumentModalTitle">Accept Document</div>
					<div className="acceptDocumentModalSubtitle">
						This is a summary of all the selections your client has made so far for
						Ve.ai Workflow
					</div>
				</div>
				<div className="acceptDocumentModalScrollableContent">
					{info.taskState.length > 0 && (
						<div className="acceptDocumentModalSection">
							<div className="acceptDocumentModalSectioncheckbox">
								<span className="acceptDocumentModalSectionTitle">Tasks</span>
								<div className="allcheckbox">
									<label htmlFor="selectAllTasks">Select All</label>
									<input
										type="checkbox"
										checked={allTasksChecked}
										onChange={handleSelectAllTasks}
										id="selectAllTasks"
									/>
								</div>
							</div>
							<Collapse
								accordion
								ghost
								activeKey={info.activeTaskKey}
								onChange={(key) =>
									setInfo((prev) => ({ ...prev, activeTaskKey: key }))
								}
								style={{ width: '100%' }}
								expandIcon={({ isActive }) => (
									<span
										className={`acceptDocumentModalCollapseExpandIcon${
											isActive ? ' active' : ''
										}`}
									></span>
								)}
							>
								{info.taskState.map((task) => (
									<Collapse.Panel
										header={
											<div className="acceptDocumentModalCardHeader">
												{editingTask.key === task.key &&
												editingTask.field === 'title' ? (
													<input
														value={taskEditFields.value}
														className="acceptDocumentModalEditInput"
														autoFocus
														onChange={(e) =>
															setTaskEditFields({
																value: e.target.value,
															})
														}
														onBlur={() =>
															handleTaskFieldSave(task, 'title')
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter')
																handleTaskFieldSave(task, 'title');
														}}
													/>
												) : (
													<span
														className="acceptDocumentModalCardTitle"
														onClick={() =>
															handleTaskFieldEdit(task, 'title')
														}
														style={{
															cursor: 'pointer',
															textTransform: 'capitalize',
														}}
													>
														{`${workflowInfoDetails?.clientDetails?.name}'s `}
														{task.title || 'title'}
													</span>
												)}
												<input
													type="checkbox"
													checked={task.checked}
													onChange={() => handleTaskCheck(task.key)}
													className="acceptDocumentModalCheckbox"
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
										}
										key={task.key}
										className="acceptDocumentModalCard acceptDocumentModalCollapsePanel"
									>
										<div className="acceptDocumentModalCardDetails">
											<div style={{ width: '100%' }}>
												<TaskCard
													updateTask={(task, updateTask) =>
														handleTaskUpdate(task, updateTask)
													}
													task={task}
												/>
												{/* {editingTask.key === task.key &&
												editingTask.field === 'description' ? (
													<input
														value={taskEditFields.value}
														className="acceptDocumentModalEditInput"
														autoFocus
														onChange={(e) =>
															setTaskEditFields({
																value: e.target.value,
															})
														}
														onBlur={() =>
															handleTaskFieldSave(
																	task,
																	'description',
																);
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter')
																handleTaskFieldSave(
																	task,
																	'description',
																);
														}}
													/>
												) : (
													<div
														className="acceptDocumentModalCardDescription"
														onClick={() =>
															handleTaskFieldEdit(task, 'description')
														}
														style={{ cursor: 'pointer' }}
													>
														{task.description}
													</div>
												)} */}
											</div>
										</div>
									</Collapse.Panel>
								))}
							</Collapse>
						</div>
					)}

					{info.eventState.length > 0 && (
						<div className="acceptDocumentModalSection">
							<div className="acceptDocumentModalSectioncheckbox">
								<span className="acceptDocumentModalSectionTitle">Events</span>
								<div className="allcheckbox">
									<label htmlFor="selectAllEvents">Select All</label>
									<input
										type="checkbox"
										checked={allEventsChecked}
										onChange={handleSelectAllEvents}
										id="selectAllEvents"
									/>
								</div>
							</div>
							<Collapse
								ghost
								activeKey={info.activeEventKeys}
								onChange={(keys) =>
									setInfo((prev) => ({ ...prev, activeEventKeys: keys }))
								}
								style={{ width: '100%' }}
								expandIcon={({ isActive }) => (
									<span
										className={`acceptDocumentModalCollapseExpandIcon${
											isActive ? ' active' : ''
										}`}
									></span>
								)}
							>
								{info.eventState.map((event) => (
									<Collapse.Panel
										header={
											<div className="acceptDocumentModalCardHeader">
												{editingEvent.key === event.key &&
												editingEvent.field === 'title' ? (
													<input
														value={eventEditFields.value}
														className="acceptDocumentModalEditInput"
														autoFocus
														onChange={(e) =>
															setEventEditFields({
																value: e.target.value,
															})
														}
														onBlur={() =>
															handleEventFieldSave(event, 'title')
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter')
																handleEventFieldSave(
																	event,
																	'title',
																);
														}}
													/>
												) : (
													<span
														className="acceptDocumentModalCardTitle"
														onClick={() =>
															handleEventFieldEdit(event, 'title')
														}
														style={{
															cursor: 'pointer',
															textTransform: 'capitalize',
														}}
													>
														{`${workflowInfoDetails?.clientDetails?.name}'s `}
														{event.title}
													</span>
												)}
												<input
													type="checkbox"
													checked={event.checked}
													onChange={() => handleEventCheck(event.key)}
													className="acceptDocumentModalCheckbox"
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
										}
										key={event.key}
										className="acceptDocumentModalCard acceptDocumentModalCollapsePanel"
									>
										<div className="acceptDocumentModalCardDetails">
											<div style={{ width: '100%' }}>
												<EventCreation
													event={event}
													updateEvent={(updateEvent) => {
														handleEventUpdate(event, updateEvent);
													}}
												/>
												{/* <EventTask
													event={event}
													updateEvent={(updateEvent) => {
														handleEventUpdate(event, updateEvent);
													}}
												/> */}
												{/* {editingEvent.key === event.key &&
												editingEvent.field === 'description' ? (
													<input
														value={eventEditFields.value}
														className="acceptDocumentModalEditInput"
														autoFocus
														onChange={(e) =>
															setEventEditFields({
																value: e.target.value,
															})
														}
														onBlur={() =>
															handleEventFieldSave(
																event,
																'description',
															)
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter')
																handleEventFieldSave(
																	event,
																	'description',
																);
														}}
													/>
												) : (
													<div
														className="acceptDocumentModalCardDescription"
														onClick={() =>
															handleEventFieldEdit(
																event,
																'description',
															)
														}
														style={{ cursor: 'pointer' }}
													>
														{event.description}
													</div>
												)} */}
											</div>
										</div>
									</Collapse.Panel>
								))}
							</Collapse>
						</div>
					)}
				</div>
				<div className="acceptDocumentModalFooter">
					<button className="acceptDocumentModalBackBtn" onClick={closeModal}>
						Go Back
					</button>
					<button className="acceptDocumentModalAcceptBtn" onClick={handleAccept}>
						Accept & Create <span className="arrow">→</span>
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AcceptDocumentModel);
