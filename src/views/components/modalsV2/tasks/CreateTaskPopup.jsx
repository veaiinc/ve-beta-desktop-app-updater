import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/tasks/modals/createTaskPopup.scss';
import { ReactComponent as ExpandIcon } from '../../../../assets/svg/gallery/expand.svg';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as PaperClip } from '../../../../assets/svg/tasks/paperClip.svg';
import { ReactComponent as ParellalLines } from '../../../../assets/svg/tasks/parallelLines.svg';
import { ReactComponent as CircleHollow } from '../../../../assets/svg/tasks/circleHollowThin.svg';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as PageIcon } from '../../../../assets/svg/tasks/pagePlus.svg';
import { ReactComponent as CalendarIcon } from '../../../../assets/svg/calendar-icon.svg';
import { ReactComponent as LinkIcon } from '../../../../assets/svg/activity/link.svg';

import Priority from '../../tasks/listView/Priority';
import DropDown from '../../dropDown/tasks/DropDown';
import Status from '../../tasks/listView/Status';
import { DatePicker, Tooltip } from 'antd';
import Spinner from '../../loaders/Spinner';
import moment from 'moment';
import WorkFlow from '../../tasks/listView/WorkFlow';

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
	assignedTo: '',
	clientId: '',
	description: '',
	dueDate: null,
	priority: 'low',
	status: 'todo',
	title: '',
	workflowId: '507f1f77bcf86cd799439011',
	workflowTemplateId: '507f1f77bcf86cd799439011',
};

const CreateTaskPopup = ({ isOpen, closeModal, addNewTask, workflows }) => {
	const [info, setInfo] = useState({
		...initialState,
		isLoading: false,
		datePickerModalOpen: false,
		dateOptions: [
			{ label: 'Remove date', value: null },
			{ label: 'Custom', value: 'custom' },
			{ label: 'Tomorrow', value: moment().add(1, 'days').unix() },
			{ label: 'End of the week', value: moment().isoWeekday(7).unix() }, // End of the week (Sunday)
			{ label: 'In one week', value: moment().add(1, 'weeks').unix() },
		],
	});

	useEffect(() => {
		return () => {
			setInfo((prevInfo) => ({ ...prevInfo, ...initialState }));
		};
	}, []);

	useEffect(() => {
		console.log(info?.title, 'Title');
	}, []);

	const updateModalInfo = (key, value) => {
		if (key === 'title') {
			value = value?.trim();
		}
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	const preparePayload = useCallback(() => {
		const {
			assignedTo,
			clientId,
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
			assignedTo,
			clientId,
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

	const onOptionClick = (value) => {
		if (value === 'custom') {
			return;
		}

		updateModalInfo('dueDate', value);
	};

	const handleAddTask = useCallback(async () => {
		setInfo((prevInfo) => ({ ...prevInfo, isLoading: true }));
		const payload = preparePayload();
		await addNewTask(payload);
		setInfo((prevInfo) => ({ ...prevInfo, isLoading: false, ...initialState }));
		closeModal();
	}, [preparePayload]);

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} modalType={'center'}>
			<div className="createTask-container">
				<div className="header-wrapper">
					<div className="logo"></div>
					<div className="actions-wrapper">
						<ExpandIcon className="expandsvg" />
						<CrossWhite className="crossSvg" onClick={closeModal} />
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
					/>
					<Status
						value={info?.status}
						showLabel={true}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('status', value)}
					/>
					<Priority
						value={info?.priority}
						showLabel={true}
						customListItemStyle={customListItemStyle}
						onOptionClick={(value) => updateModalInfo('priority', value)}
					/>
					<Tooltip
						overlayClassName="moreOptions-container"
						placement={'bottomRight'}
						title={
							<div className="moreOptions-wrapper">
								<DropDown
									title={'Change due date'}
									options={info?.dateOptions}
									onOptionClick={onOptionClick}
									selected={info?.dueDate}
									valueSelector="value"
								>
									<div className="more-listItem">
										<CalendarIcon />
										<span>Set due date</span>
									</div>
								</DropDown>
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
