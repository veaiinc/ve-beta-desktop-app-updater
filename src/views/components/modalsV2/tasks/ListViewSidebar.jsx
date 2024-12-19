/* eslint-disable no-unused-vars */
import { Drawer, Progress } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as DustBinIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
const ListViewSidebar = ({
	selectedRow,
	sidebarIsOpen,
	closeSidebar,
	updatePropertyValue,
	workflows,
	tenantUsers,
	deleteTask,
	responseTypes,
	rowTypes,
	handleCreateSubTaskClick,
}) => {
	// const {
	// 	tasks: { subTasks, getSubTasks },
	// } = useContext(Context);
	const [info, setInfo] = useState({
		deleteLoading: false,
	});

	// useEffect(() => {
	// 	if (!subTasks) {
	// 		getSubTasks({ taskId: selectedRow?._id });
	// 	} else {
	// 		console.log('subTasks', subTasks);
	// 	}
	// }, [subTasks, selectedRow?._id]);

	const handleDeleteTask = async () => {
		setInfo({ deleteLoading: true });
		await deleteTask({ taskId: selectedRow?._id });
		setInfo({ deleteLoading: false });
	};

	const generateRow = useCallback(
		(row) => {
			const listItems = [];
			for (let key in row) {
				const value = row[key];

				if (
					[
						'__typename',
						'_id',
						'title',
						'description',
						'workflowTemplateId',
						'completedAt',
						'taskSlNo',
						'workflowId',
					].includes(key)
				) {
					continue;
				}

				const { type = null, name = null, Icon = null } = responseTypes[key];

				const RowComponent = rowTypes[type] || null;
				listItems.push(
					<div className="property-list" key={key}>
						<span className="property-title">
							{Icon && <Icon width={16} height={16} />}
							{name}
						</span>
						<span className={`property-value`}>
							{RowComponent ? (
								<RowComponent
									key={key}
									value={value}
									title={name}
									showLabel
									defaultLabel={'Not selected'}
									{...(type === 'date' ? { format: 'MMM DD, YYYY h:mm A' } : {})}
									{...(key === 'workflow' ? { workflows } : {})}
									{...(type === 'person' ? { showName: true } : {})}
									{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
									{...(key === 'updatedAt' ||
									key === 'createdAt' ||
									key === 'assignedAt'
										? { timestamp: true }
										: {})}
									onOptionClick={(value) =>
										updatePropertyValue(row._id, key, value)
									}
								/>
							) : (
								<div key={key}>{value}</div>
							)}
						</span>
					</div>,
				);
			}

			return listItems;
		},
		[responseTypes, rowTypes, workflows, tenantUsers, updatePropertyValue],
	);

	return (
		<Drawer
			onClose={closeSidebar}
			width={480}
			open={sidebarIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="listView-sidebar-container">
				<div className="listView-sidebar-innerContainer">
					<div className="sidebar-header">
						<CloseArrow
							width={16}
							height={16}
							onClick={closeSidebar}
							className="cursor-pointer"
						/>
						<span className="sidebar-id">{selectedRow?.taskSlNo}</span>
						<button
							className="sidebar-delete-button"
							onClick={() => {
								handleDeleteTask();
							}}
							disabled={info?.deleteLoading}
						>
							{info?.deleteLoading ? (
								<Spinner width={20} height={20} color="#7d7d7d" />
							) : (
								<DustBinIcon width={20} height={20} className="cursor-pointer" />
							)}
						</button>
					</div>

					<div className="sidebar-title">
						<textarea
							className="sidebar-title-input"
							value={selectedRow?.title || ''}
							onChange={(e) =>
								updatePropertyValue(selectedRow?._id, 'title', e.target.value)
							}
							placeholder="Enter title"
							rows={1}
						/>
					</div>
					<div className="sidebar-properties-container">{generateRow(selectedRow)}</div>

					<div className="sidebar-description">
						<textarea
							className="sidebar-description-textarea"
							value={selectedRow?.description || ''}
							onChange={(e) =>
								updatePropertyValue(selectedRow?._id, 'description', e.target.value)
							}
							placeholder="Enter description"
							rows={5}
						/>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
