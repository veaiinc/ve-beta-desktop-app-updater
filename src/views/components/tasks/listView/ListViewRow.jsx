import { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listViewRow.scss';
const ListViewRow = ({
	task,
	properties,
	rowTypes,
	handleUpdate,
	handleRowClick,
	isSubTask = false,
	responseMetadata,
	colors,
}) => {
	const generateRow = useCallback(
		(row) => {
			const leftPart = [];
			const rightPart = [];
			let split = false;

			// Sort properties by order
			const sortedProperties = [...(properties || [])]
				?.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				?.filter((property) => property?.show);

			// Loop through sorted properties instead of row keys
			sortedProperties?.forEach((property) => {
				const key = property?.value;
				const value = row?.[key];

				const {
					type = null,
					name = null,
					props = {},
					doSplit = false,
				} = responseMetadata?.[key] || {};

				if (type === null) {
					return;
				}

				const RowComponent = rowTypes?.[type] || null;

				if (doSplit) {
					split = true;
				}

				if (
					(typeof value === 'object' && !Array.isArray(value)
						? !value?._id
						: key === '!title' && !value) ||
					(Array?.isArray(value) && value?.length === 0) ||
					key === '__typename' ||
					key === '_id' ||
					key === 'parentTaskId' ||
					key === 'workflowTemplateId' ||
					key === 'completedAt' ||
					(isSubTask && key === 'workflow')
				) {
					return;
				}

				const listItem = RowComponent ? (
					<RowComponent
						key={key}
						value={value}
						title={name}
						onOptionClick={(value) => handleUpdate(task?._id, key, value, isSubTask)}
						{...props}
						colors={colors}
						showTitle={true}
						showEditProperty={true}
					/>
				) : null;

				if (split && !doSplit) {
					rightPart?.push(listItem);
				} else {
					leftPart?.push(listItem);
				}
			});

			return [
				<div key="listItemRowLeft" className="leftPart">
					{leftPart}
				</div>,
				<div key="listItemRowRight" className="rightPart">
					{rightPart}
				</div>,
			];
		},
		[properties, responseMetadata, rowTypes, isSubTask, colors, handleUpdate, task?._id],
	);

	return (
		<div
			className={`listItemRowContainer ${isSubTask ? 'subTaskRowContainer' : ''}`}
			onClick={() => {
				handleRowClick(task?._id);
			}}
		>
			<div className="listItemRow">{generateRow(task)}</div>
		</div>
	);
};

export default memo(ListViewRow);
