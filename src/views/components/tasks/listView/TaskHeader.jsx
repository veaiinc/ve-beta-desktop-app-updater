import React, { memo, useMemo } from 'react';
import '../../../../assets/scss/tasks/taskHeader.scss';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ListViewIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../assets/svg/tasks/blocks.svg';
import { Tooltip } from 'antd';

const layouts = {
	list: {
		Icon: <ListViewIcon />,
		label: 'List view',
	},
	board: {
		Icon: <BoardViewIcon />,
		label: 'Board view',
	},
	table: {
		Icon: <TableViewIcon />,
		label: 'Table view',
	},
	gallery: {
		Icon: <GalleryViewIcon />,
		label: 'Gallery view',
	},
};

const tabTooltipContent = [{ label: 'Edit' }, { label: 'Rename' }, { label: 'Duplicate' }];

const TaskHeader = ({ tabs }) => {
	const tabArray = useMemo(() => Object?.values(tabs || {}), [tabs]);
	console.log('tabs', tabArray);

	return (
		<div className="task-tabs-header-container">
			<div className="tab-wrapper">
				{tabArray?.map((tab, index) => (
					<Tooltip
						title={
							<div className="tab-tooltip-content">
								{tabTooltipContent?.map((item, index) => (
									<div className="tab-tooltip-content-item" key={index}>
										<div className="tab-tooltip-content-item-icon">
											{item?.icon}
										</div>
										<div className="tab-tooltip-content-item-label">
											{item?.label}
										</div>
									</div>
								))}
								<div className="delete-view-container">
									<div className="delete-view-icon">{/* <DeleteIcon /> */}</div>
									<div className="delete-view-label">Delete</div>
								</div>
							</div>
						}
						key={tab?._id}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						style={{ padding: 0 }}
						placement="bottomLeft"
					>
						<div className={`tab-item ${index === 0 && 'tab-active'}`}>
							<div className="tab-icon">{layouts[tab?.viewType]?.Icon}</div>
							<div className="tab-title">{tab?.label}</div>
						</div>
					</Tooltip>
				))}
			</div>
			<div className="tab-divider" />
			<Tooltip
				title={
					<div className="add-new-tab-tooltip-content">
						<div className="add-new-tab-tooltip-header">New view</div>
						<div className="add-new-tab-tooltip-body">
							{Object.values(layouts)
								?.filter((layout) => layout?.label !== 'Table view')
								?.map((layout) => (
									<div className="add-new-tab-tooltip-body-item">
										<div className="add-new-tab-tooltip-body-item-icon">
											{layout?.Icon}
										</div>
										<div className="add-new-tab-tooltip-body-item-label">
											{layout?.label}
										</div>
									</div>
								))}
						</div>
					</div>
				}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
				style={{ padding: 0 }}
				placement="bottom"
			>
				<button className="add-new-tab-button">
					<PlusIcon />
				</button>
			</Tooltip>
		</div>
	);
};

export default memo(TaskHeader);
