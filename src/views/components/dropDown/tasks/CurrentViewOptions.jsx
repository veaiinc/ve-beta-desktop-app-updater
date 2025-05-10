import { memo } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as SortIcon } from '../../../../assets/svg/tasks/newSort.svg';
import '../../../../assets/scss/dropdown/tasks/currentViewOptions.scss';
import { ReactComponent as ListViewIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../assets/svg/tasks/blocks.svg';

const viewOptions = [
	{
		value: 'list',
		label: 'List',
		Icon: ListViewIcon,
	},
	{
		value: 'board',
		label: 'Board',
		Icon: BoardViewIcon,
	},
	{
		value: 'table',
		label: 'Table',
		Icon: TableViewIcon,
	},
	{
		value: 'gallery',
		label: 'Widget',
		Icon: GalleryViewIcon,
	},
];

const CurrentViewOptions = ({ showEditViewDropDown, handleEditViewDropDown }) => {
	return (
		<Tooltip
			title={
				<div className="current-view-options-tooltip">
					<div className="current-view-options-tooltip-header">Current View</div>
					<div className="view-options-container">
						{viewOptions.map((option) => (
							<div className="view-option-item" key={option.value}>
								<option.Icon />
								<span>{option.label}</span>
							</div>
						))}
					</div>
					<div className="groupby-wrapper">
						<div className="current-view-option-title">Group By</div>
					</div>
					<div className="id-prefix-wrapper">
						<div className="current-view-option-title">ID Prefix</div>
						<input className="current-view-id-prefix-input" />
					</div>
					<div className="status-edit-wrapper">
						<div className="current-view-option-title">Status</div>
					</div>
					<div className="properties-wrapper">
						<div className="current-view-option-title">Task Properties</div>
						<div className="property-items-wrapper">
							<div className="property-item show">Status</div>
							<div className="property-item show">Priority</div>
							<div className="property-item">Due Date</div>
							<div className="property-item">Assignee</div>
							<div className="property-item">Created By</div>
							<div className="property-item">Created At</div>
							<div className="property-item">Updated At</div>
						</div>
					</div>
				</div>
			}
			open={showEditViewDropDown}
			onOpenChange={(value) => {
				if (!value) {
					handleEditViewDropDown(false);
				}
			}}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomRight'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<div
				className="current-view-options-icon"
				onClick={() => handleEditViewDropDown(!showEditViewDropDown)}
			>
				<SortIcon />
			</div>
		</Tooltip>
	);
};

export default memo(CurrentViewOptions);
