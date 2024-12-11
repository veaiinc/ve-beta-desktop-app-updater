import { Drawer, Progress } from 'antd';
import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/calendar/plus.svg';
import { ReactComponent as DownArrow } from '../../../../assets/svg/workflow/downArrow.svg';
import Text from '../../tasks/listView/Text';
import Select from '../../tasks/listView/Select';
import Person from '../../tasks/listView/Person';
import MultiSelect from '../../tasks/listView/MultiSelect';
import Id from '../../tasks/listView/Id';
import Status from '../../tasks/listView/Status';
import Priority from '../../tasks/listView/Priority';
import Email from '../../tasks/listView/Email';
import Phone from '../../tasks/listView/Phone';
import Url from '../../tasks/listView/Url';
import CheckBox from '../../tasks/listView/CheckBox';
import DateView from '../../tasks/listView/DateView';
import WorkFlow from '../../tasks/listView/WorkFlow';

const rowTypes = {
	text: Text,
	select: Select,
	person: Person,
	'multi-select': MultiSelect,
	date: DateView,
	id: Id,
	status: Status,
	priority: Priority,
	email: Email,
	phone: Phone,
	url: Url,
	checkbox: CheckBox,
	workflow: WorkFlow,
};

const responseTypes = {
	title: 'text',
	description: 'text',
	status: 'status',
	priority: 'priority',
	workflowTemplateId: 'text',
	workflowId: 'workflow',
	client: 'text',
	assignedTo: 'person',
	dueDate: 'date',
	assignedBy: 'person',
	assignedAt: 'date',
	completedAt: 'date',
	createdAt: 'date',
	updatedAt: 'date',
	createdBy: 'person',
	updatedBy: 'person',
};

const ListViewSidebar = ({
	selectedRow,
	sidebarIsOpen,
	closeSidebar,
	updatePropertyValue,
	workflows,
	tenantUsers,
}) => {
	const generateRow = useCallback((row) => {
		const listItems = [];
		for (let key in row) {
			const value = row[key];

			if (['__typename', '_id', 'title', 'description', 'workflowTemplateId'].includes(key)) {
				continue;
			}

			const componentType = responseTypes[key];
			const RowComponent = rowTypes[componentType] || null;
			listItems.push(
				<div className="property-list" key={key}>
					<span className="property-title">{key}</span>
					<span className={`property-value`}>
						{RowComponent ? (
							<RowComponent
								key={key}
								value={value}
								title={key}
								showLabel
								{...(componentType === 'workflow' ? { workflows } : {})}
								{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
								// onOptionClick={(value) => updatePropertyValue(row._id, key, value)}
								onOptionClick={(value) => {
									updatePropertyValue(row._id, key, value);
								}}
							/>
						) : (
							<div key={key}>{value}</div>
						)}
					</span>
				</div>,
			);
		}

		return listItems;
	}, []);

	return (
		<Drawer
			onClose={closeSidebar}
			width={420}
			open={sidebarIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="listView-sidebar-container">
				<div className="listView-sidebar-innerContainer">
					<div className="sidebar-header">
						<span className="sidebar-id">{selectedRow?.id || 'VEAI-302'}</span>
						<HorizontalMoreIcon className="cursor-pointer" />
						<CloseArrow onClick={closeSidebar} className="cursor-pointer" />
					</div>

					{/* Title input */}
					<div className="sidebar-title">
						<input
							type="text"
							className="sidebar-title-input"
							value={selectedRow?.title || ''}
							onChange={(e) =>
								updatePropertyValue(selectedRow?._id, 'title', e.target.value)
							}
							placeholder="Enter title"
						/>
					</div>

					{/* Description textarea */}
					<div className="sidebar-description">
						<textarea
							className="sidebar-description-textarea"
							value={selectedRow?.description || ''}
							onChange={(e) =>
								updatePropertyValue(selectedRow?._id, 'description', e.target.value)
							}
							placeholder="Enter description"
						/>
					</div>

					<div className="sidebar-image"></div>
					<div className="sidebar-properties-container">{generateRow(selectedRow)}</div>
					<div className="sidebar-subtasks-container">
						<div className="subtask-header">
							<DownArrow />
							<span className="subtask-heading">Sub Tasks</span>
							<div className="subtaskCount-container">
								<Progress
									type="circle"
									percent={40}
									size={18}
									trailColor="#2F2F2F"
									strokeColor="#6055EC"
									strokeWidth="14"
								/>
								<span className="taskCount">1/3</span>
							</div>
							<div className="subTask-actions-wrapper">
								<PlusSvg className="cursor-pointer" />
								<HorizontalMoreIcon className="cursor-pointer" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
