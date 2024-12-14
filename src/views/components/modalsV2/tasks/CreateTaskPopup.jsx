import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/tasks/modals/createTaskPopup.scss';
import { ReactComponent as ExpandIcon } from '../../../../assets/svg/gallery/expand.svg';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as PaperClip } from '../../../../assets/svg/tasks/paperClip.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as PageIcon } from '../../../../assets/svg/tasks/pagePlus.svg';
import { ReactComponent as CalendarIcon } from '../../../../assets/svg/calendar-icon.svg';
import { ReactComponent as LinkIcon } from '../../../../assets/svg/activity/link.svg';

import Priority from '../../tasks/listView/Priority';
import Status from '../../tasks/listView/Status';
import { message, Tooltip } from 'antd';
import Spinner from '../../loaders/Spinner';
import moment from 'moment';
import WorkFlow from '../../tasks/listView/WorkFlow';
import Person from '../../tasks/listView/Person';
import DateView from '../../tasks/listView/DateView';

const customListItemStyle = {
	borderRadius: '34px',
	backgroundColor: '#1F1F1F',
	minHeight: '34px',
	padding: '6px 8px',
	display: 'flex',
	alignItems: 'center',
	minWidth: '40px',
	justifyContent: 'center',
};

const initialState = {
	assignedTo: null,
	client: null,
	description: '',
	dueDate: null,
	priority: 'low',
	status: 'todo',
	title: '',
	workflowId: '',
	workflowTemplateId: '',
	isLoading: false,
};

const CreateTaskPopup = ({ isOpen, closeModal, addNewTask, workflows, tenantUsers, clients }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		setInfo({ ...initialState });
	}, [isOpen]);

	const updateModalInfo = (key, value) => {
		if (key === 'title') {
			value = value?.trim();
		}
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	const preparePayload = useCallback(() => {
		const {
			assignedTo,
			client,
			description,
			dueDate,
			priority,
			status,
			title,
			workflowId,
			workflowTemplateId,
		} = info;
		if (!title.trim()) {
			return;
		}

		return Object.entries({
			assignedTo: assignedTo ? { userId: assignedTo?.value } : '',
			client: client ? client?.value : '',
			description,
			dueDate,
			priority,
			status,
			title,
			workflowId,
			workflowTemplateId,
		})
			.filter(([key, value]) => value != null && value !== '')
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});
	}, [info]);

	const handleAddTask = useCallback(async () => {
		try {
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: true }));
			const payload = preparePayload();
			await addNewTask(payload);
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false, ...initialState }));
			closeModal();
		} catch (error) {
			messageApi.open({
				type: 'error',
				content: error?.message || 'Something went wrong! Please try again.',
			});
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false }));
		}
	}, [addNewTask, closeModal, messageApi, preparePayload]);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={info?.isLoading ? null : closeModal}
			modalType={'center'}
		>
			{contextHolder}
			<div className="createTask-container">
				<div className="header-wrapper">
					<div className="logo"></div>
					<div className="actions-wrapper">
						<ExpandIcon className="expandsvg" />
						<CrossWhite
							className="crossSvg"
							onClick={info?.isLoading ? null : closeModal}
						/>
					</div>
				</div>
				<div className="text-wrapper">
					<input
						type="text"
						placeholder="Task title"
						// value={info?.title}
						onChange={(e) => updateModalInfo('title', e?.target?.value)}
					/>
					<textarea
						name=""
						id=""
						placeholder="Add description..."
						value={info?.description}
						onChange={(e) => updateModalInfo('description', e.target.value)}
					></textarea>
				</div>
				<div className="properties-wrapper">
					<WorkFlow
						value={info?.workflowId}
						workflows={workflows}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('workflowId', value)}
						title={'Workflow'}
					/>
					<Person
						value={info?.client}
						persons={clients}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('client', value)}
						showName
						title={'Client'}
						removeBtn={true}
					/>
					<Status
						value={info?.status}
						showLabel={true}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('status', value)}
						title={'Status'}
					/>
					<Priority
						value={info?.priority}
						showLabel={true}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('priority', value)}
						title={'Priority'}
					/>
					<Person
						value={info?.assignedTo}
						persons={tenantUsers}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('assignedTo', value)}
						title={'Assigned To'}
						removeBtn={true}
					/>
					{info?.dueDate ? (
						<DateView
							value={info?.dueDate}
							customListItemStyle={customListItemStyle}
							onOptionClick={(value) => updateModalInfo('dueDate', value)}
							title={'Due Date'}
						/>
					) : (
						''
					)}
					<Tooltip
						overlayClassName="moreOptions-container"
						placement={'bottomRight'}
						title={
							<div className="moreOptions-wrapper">
								<div
									className="more-listItem"
									onClick={() => updateModalInfo('dueDate', moment().unix())}
								>
									<CalendarIcon />
									<span>Set due date</span>
								</div>

								<div className="more-listItem">
									<LinkIcon /> <span>Add link</span>
								</div>
								<div className="more-listItem">
									<PageIcon />
									<span>Add sub-issue</span>
								</div>
							</div>
						}
						arrow={false}
						trigger={'click'}
						color="transparent"
					>
						<div className="more" style={customListItemStyle}>
							<HorizontalMoreIcon />
						</div>
					</Tooltip>
				</div>
				<div className="footer-wrapper">
					<PaperClip />
					<button
						className="btn-createIssue"
						onClick={handleAddTask}
						disabled={info?.isLoading || info?.title.trim() === ''}
					>
						{info?.isLoading ? (
							<Spinner width={'20px'} height={'20px'} />
						) : (
							'Create issue'
						)}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateTaskPopup);
