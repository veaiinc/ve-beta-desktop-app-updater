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

import Priority from '../../tasks/listView/Priority';
import DropDown from '../../dropDown/tasks/DropDown';
import Status from '../../tasks/listView/Status';
import { Tooltip } from 'antd';
import Spinner from '../../loaders/Spinner';

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

const CreateTaskPopup = ({ isOpen, closeModal, addNewTask }) => {
	const [info, setInfo] = useState({
		...initialState,
		isLoading: false,
	});

	useEffect(() => {
		return () => {
			setInfo((prevInfo) => ({ ...prevInfo, ...initialState }));
		};
	}, []);

	const updateModalInfo = (key, value) => {
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
						value={info?.title}
						onChange={(e) => updateModalInfo('title', e.target.value)}
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
					<div className="property">
						<Cube />
						<span className="label">Project hunt</span>
					</div>
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
					<Tooltip title={<></>} arrow={false} placement="bottom" trigger={'click'}>
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
						disabled={info?.isLoading}
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
