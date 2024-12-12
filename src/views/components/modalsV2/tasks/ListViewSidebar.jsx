import { Drawer, Popconfirm, Progress, Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
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
}) => {
	const {
		templates: { clientList, getClientList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflowId: selectedRow?.workflowId,
		clients: clientList?.data?.map(({ name, _id }) => ({ label: name, value: _id })),
	});

	useEffect(() => {
		getClientList({
			filters: {
				limit: 10,
				page: 1,
				workflowId: info?.workflowId,
			},
		});
	}, [info?.workflowId]);

	useEffect(() => {
		if (clientList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				clients: clientList?.data?.map(({ name, _id }) => ({
					label: name,
					value: _id,
				})),
			}));
		}
	}, [clientList]);

	const generateRow = useCallback(
		(row) => {
			const listItems = [];
			for (let key in row) {
				const value = row[key];

				if (
					['__typename', '_id', 'title', 'description', 'workflowTemplateId'].includes(
						key,
					)
				) {
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
									{...(key === 'client'
										? {
												persons: info?.clients,
												showName: true,
										  }
										: {})}
									{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
									{...(key === 'updatedAt' || key === 'createdAt'
										? { showDropDown: false }
										: {})}
									onOptionClick={(value) => {
										if (key === 'workflowId') {
											// Add custom workflow update handling if needed
											updatePropertyValue(row._id, key, value);
										} else {
											updatePropertyValue(row._id, key, value);
										}
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
		},
		[info?.clients],
	);

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

					<Popconfirm
						title="Delete Task"
						description="Are you sure you want to delete this task?"
						okText="Yes"
						cancelText="No"
						okButtonProps={{
							style: {
								background: '#ff4d4d',
								border: 'none',
								borderRadius: '6px',
								fontFamily: 'Inter',
								fontWeight: 500,
							},
						}}
						cancelButtonProps={{
							style: {
								background: '#1d1d1d',
								border: '1px solid #1d1d1d',
								borderRadius: '6px',
								color: '#e4e5e6',
								fontFamily: 'Inter',
								fontWeight: 500,
							},
						}}
						overlayStyle={{
							background: '#151515',
							border: '1px solid rgba(36, 36, 36, 0.64)',
							borderRadius: '16px',
						}}
						overlayInnerStyle={{
							color: '#e4e5e6',
							fontFamily: 'Inter',
						}}
						onConfirm={() => {
							deleteTask({ taskId: selectedRow?._id });
						}}
					>
						<button className="deleteTask">Delete Task</button>
					</Popconfirm>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
