import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import s from '../../../../assets/scss/globalComponents/widgets/taskWidget.module.scss';
import Select from '../../tasks/listView/Select';
import DateView from '../../tasks/listView/DateView';
import Person from '../../tasks/listView/Person';
import Status from '../../tasks/listView/Status';
import Context from '../../../../context/context';
import { message } from '../CustomToast';
import Spinner from '../../loaders/Spinner';

const TaskWidget = ({ widgetData = null }) => {
	const {
		tasks: { getTaskMetadata, taskMetadata, addListItem },
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		dueDate: null,
		description: '',
		priority: 'low',
		status: null,
		assignedTo: [],
		taskMetadata: null,
		creatingTask: false,
	});

	useEffect(() => {
		if (widgetData) {
			const { title, description, dueDate, priority } = widgetData || {};
			setInfo((prev) => ({
				...prev,
				title,
				description,
				dueDate,
				priority,
			}));
		}
	}, [widgetData]);

	useEffect(() => {
		if (!taskMetadata) {
			getTaskMetadata();
		} else {
			setInfo((prev) => ({ ...prev, taskMetadata: taskMetadata }));
		}
	}, [taskMetadata]);

	const handleInputChange = useCallback((e, type) => {
		setInfo((prev) => ({
			...prev,
			[type]: e?.target?.value,
		}));
	}, []);

	const addNewTask = useCallback(async () => {
		if (info?.creatingTask) return;

		const { title, description, status, priority, dueDate, assignedTo } = info;

		if (!title?.trim()?.length) {
			return message.error('Title is required');
		} else if (!status) {
			return message.error('Status is required');
		}

		const payload = Object.entries({
			assignedTo:
				assignedTo?.length > 0
					? {
							tenantUsers: assignedTo,
					  }
					: '',
			description,
			dueDate,
			priority,
			status,
			title,
		})
			.filter(([key, value]) => value != null && value !== '')
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});
		setInfo((prev) => ({ ...prev, creatingTask: true }));
		const response = await addListItem({ input: payload });
		setInfo((prev) => ({ ...prev, creatingTask: false }));
	}, [info]);

	const handleBtnClick = useCallback(() => {
		addNewTask();
	}, [addNewTask]);

	const responseMetadata = useMemo(
		() => ({
			title: {
				type: 'text',
				name: 'Title',
				// Icon: textSvg,
				props: {},
				doSplit: true,
				isTitle: true,
			},
			description: {
				type: 'text',
				name: 'Description',
				//  Icon: textSvg,
				props: {},
			},
			status: {
				type: 'status',
				name: 'Status',
				// Icon: PieSvg,
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
				// Icon: PrioritySvg,
				props: {
					options: [
						{ label: 'Low', _id: 'low', color: '1' },
						{ label: 'Medium', _id: 'medium', color: '2' },
						{ label: 'High', _id: 'high', color: '3' },
					],
				},
			},
			assignedTo: {
				type: 'person',
				name: 'Assigned To',
				// Icon: PersonSvg,
				props: {
					options: [],
					multiSelect: true,
					parseValue: true,
				},
			},
			dueDate: {
				type: 'date',
				name: 'Due Date',
				// Icon: ClockSvg,
				props: {},
			},
		}),
		[info?.taskMetadata],
	);

	return (
		<div className={s.taskWidgetContainer}>
			<div className={s.header}>Task details</div>
			<div className={s.taskInfo}>
				<div className={s.titleContainer}>
					<div className={s.titleText}>Title</div>
					<input
						type="text"
						value={info?.title}
						className={s.titleInput}
						onChange={(e) => handleInputChange(e, 'title')}
					/>
				</div>

				<div className={s.descriptionContainer}>
					<div className={s.descriptionText}>Description</div>
					<textarea
						rows={4}
						type="text"
						value={info?.description}
						className={s.descriptionInput}
						onChange={(e) => handleInputChange(e, 'description')}
					/>
				</div>

				<div className={s.taskField}>
					<div className={s.leftContainer}>Due Date</div>
					<div className={s.rightContainer}>
						<DateView
							value={info?.dueDate}
							onOptionClick={(value) =>
								setInfo((prev) => ({ ...prev, dueDate: value }))
							}
							title={'Due Date'}
							showIcon={true}
						/>
					</div>
				</div>
				<div className={s.taskField}>
					<div className={s.leftContainer}>Priority</div>
					<div className={s.rightContainer}>
						<Select
							value={info?.priority}
							showLabel={true}
							onOptionClick={(value) =>
								setInfo((prev) => ({ ...prev, priority: value }))
							}
							title={'Priority'}
							{...responseMetadata?.['priority']?.props}
							colors={[]}
						/>
					</div>
				</div>
				<div className={s.taskField}>
					<div className={s.leftContainer}>Assigned To</div>
					<div className={s.rightContainer}>
						<Person
							value={info?.assignedTo || []}
							{...responseMetadata?.['assignedTo']?.props}
							onOptionClick={(value) =>
								setInfo((prev) => ({ ...prev, assignedTo: value }))
							}
							title={'Assigned To'}
							multiSelect={true}
							parseValue={true}
							removeBtn={true}
						/>
					</div>
				</div>

				<div className={s.taskField}>
					<div className={s.leftContainer}>Status</div>
					<div className={s.rightContainer}>
						<Status
							value={info?.status}
							showLabel={true}
							onOptionClick={(value) =>
								setInfo((prev) => ({ ...prev, status: value }))
							}
							title={'Status'}
							options={responseMetadata?.status?.props?.options}
							setDefault={true}
						/>
					</div>
				</div>
			</div>

			<div className={s.buttonsContainer}>
				<button className={s.btn} onClick={handleBtnClick}>
					Create Task
					{info?.creatingTask ? <Spinner width={16} height={16} /> : ''}
				</button>
			</div>
		</div>
	);
};

export default memo(TaskWidget);
