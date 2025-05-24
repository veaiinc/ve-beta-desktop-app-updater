import React, { memo, useState, useEffect, useContext, useMemo } from 'react';
import ReactModal from '../../components/ui-components/modal';
import { Collapse } from 'antd';
import '../../../assets/scss/document/acceptModel.scss';
import Spinner from '../loaders/Spinner';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';
import { message } from 'antd';
import moment from 'moment';

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

	// Centralized info state
	const [info, setInfo] = useState({
		taskMetadata: null,
		taskState: [],
		eventState: [],
		activeTaskKey: null,
		activeEventKeys: [],
		calendarCategories: [],
	});

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
			taskState: allServiceItems.map((t) => ({ ...t, checked: true })),
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

	const handleAccept = async () => {
		if (!statusId) {
			message.error('Default status not found. Please check your workflow settings.');
			return;
		}
		const checkedTasks = info.taskState.filter((task) => task.checked);
		const checkedEvents = info.eventState.filter((event) => event.checked);
		let allSuccess = true;

		for (const task of checkedTasks) {
			const payload = {
				title: task.title,
				description: task.description,
				priority: 'low',
				status: statusId,
				clients: [workflowInfoDetails?.clientDetails?._id],
				// Add more fields as needed
			};
			try {
				await addListItem({ input: payload });
			} catch (e) {
				allSuccess = false;
			}
		}

		// For events, use createCalendarEvent with the correct payload
		const today = new Date();
		const todayISO = today.toISOString();
		const calendarCategory = (info.calendarCategories || []).find((cat) => cat.type === 'all');

		for (const event of checkedEvents) {
			const payload = {
				title: event.title,
				description: event.description,
				location: null,
				startDateTime: todayISO,
				endDateTime: todayISO,
				timezone: 'Asia/Calcutta',
				allDay: true,
				calendarCategory: calendarCategory || null,
				meeting: null,
				phone: null,
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
												<span className="acceptDocumentModalCardTitle">
													{task.title}
												</span>
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
											<div>
												{task.description && (
													<div className="acceptDocumentModalCardDescription">
														{task.description}
													</div>
												)}
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
												<span className="acceptDocumentModalCardTitle">
													{event.title}
												</span>
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
											<div>
												{event.description && (
													<div className="acceptDocumentModalCardDescription">
														{event.description}
													</div>
												)}
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
