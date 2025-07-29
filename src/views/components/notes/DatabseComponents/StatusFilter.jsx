import { memo } from 'react';
import { Tooltip } from 'antd';
import StatusFilterDropdown from '../../dropDown/notes/database/StatusFilterDropdown';

const groupMapper = {
	todo: 'Todo',
	inProgress: 'In Progress',
	completed: 'Completed',
};

const StatusFilter = ({
	value = { groups: [], labels: [] },
	options = { todo: [], inProgress: [], completed: [] },
	onChange,
	title,
}) => {
	// Get all selected items (both groups and individual labels)
	const selectedItems = [];

	// Add selected groups
	value.groups.forEach((group) => {
		selectedItems.push(groupMapper[group]);
	});

	// Add individual labels that aren't part of selected groups
	value.labels.forEach((labelId) => {
		// Check if this label belongs to any selected group
		const isInSelectedGroup = value.groups.some((group) =>
			options[group]?.some((option) => option._id === labelId),
		);

		// Only add if not part of a selected group
		if (!isInSelectedGroup) {
			// Find the label in any group
			for (const group in options) {
				const label = options[group].find((opt) => opt._id === labelId);
				if (label) {
					selectedItems.push(label.label);
					break;
				}
			}
		}
	});

	return (
		<Tooltip
			title={
				<StatusFilterDropdown
					options={options}
					value={value}
					onChange={onChange}
					title={title}
				/>
			}
			placement="bottomLeft"
			classNames={{ root: 'status-dropdown' }}
			color="transparent"
			trigger={['click']}
		>
			<div className="filter-wrapper">{selectedItems.join(', ') || 'Select status'}</div>
		</Tooltip>
	);
};

export default memo(StatusFilter);
