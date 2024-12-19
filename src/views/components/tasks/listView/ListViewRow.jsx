import { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listViewRow.scss';
const ListViewRow = ({
	task,
	properties,
	responseTypes,
	rowTypes,
	updatePropertyValue,
	workflows,
	tenantUsers,
	handleRowClick,
	isSubTask = false,
}) => {
	const generateRow = useCallback(
		(row) => {
			const leftPart = [];
			const rightPart = [];
			let titleReached = false;

			for (let key in row) {
				const value = row[key];

				if (
					(typeof value === 'object' ? !value?._id : key === '!title' && !value) ||
					key === '__typename' ||
					key === '_id' ||
					key === 'workflowTemplateId' ||
					key === 'completedAt' ||
					(isSubTask && key === 'workflow')
				) {
					continue;
				}

				const property = properties?.find((item) => item.propName === key);
				if (property && !property?.show) {
					continue;
				}

				const { type, name } = responseTypes[key];
				const RowComponent = rowTypes[type] || null;

				const listItem = RowComponent ? (
					<RowComponent
						key={key}
						value={value}
						title={name}
						onOptionClick={(value) =>
							updatePropertyValue(task._id, key, value, isSubTask)
						}
						{...(key === 'workflow' ? { workflows } : {})}
						{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
						{...(key === 'updatedAt' || key === 'createdAt' ? { timestamp: true } : {})}
					/>
				) : null;
				if (titleReached) {
					rightPart.push(listItem);
				} else {
					leftPart.push(listItem);
				}
				if (key === 'title') {
					titleReached = true;
				}
			}

			return [
				<div key="listItemRowLeft" className="leftPart">
					{leftPart}
				</div>,
				<div key="listItemRowRight" className="rightPart">
					{rightPart}
				</div>,
			];
		},
		[
			task,
			properties,
			responseTypes,
			rowTypes,
			updatePropertyValue,
			workflows,
			tenantUsers,
			isSubTask,
		],
	);

	return (
		<div
			className={`listItemRowContainer ${isSubTask ? 'subTaskRowContainer' : ''}`}
			onClick={() => handleRowClick(task._id)}
		>
			<div className="listItemRow">{generateRow(task)}</div>
		</div>
	);
};

export default memo(ListViewRow);
