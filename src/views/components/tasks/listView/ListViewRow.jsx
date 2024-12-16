import { memo } from 'react';
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
	clients,
}) => {
	const generateRow = (row) => {
		const leftPart = [];
		const rightPart = [];
		let titleReached = false;

		for (let key in row) {
			const value = row[key];

			if (
				(typeof value === 'object' ? !value?._id : !value) ||
				key === '__typename' ||
				key === '_id' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				continue;
			}

			const property = properties?.find((item) => item.propName === key);
			if (property && !property?.show) {
				continue;
			}

			const componentType = responseTypes[key];
			const RowComponent = rowTypes[componentType] || null;
			if (titleReached) {
				rightPart.push(
					RowComponent ? (
						<RowComponent
							key={key}
							value={value}
							title={key}
							onOptionClick={(value) => updatePropertyValue(task._id, key, value)}
							{...(componentType === 'workflow' ? { workflows } : {})}
							{...(key === 'client'
								? {
										persons: clients,
										showName: true,
								  }
								: {})}
							{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
							{...(key === 'updatedAt' || key === 'createdAt'
								? { showDropDown: false }
								: {})}
						/>
					) : (
						<div key={key}>{value}</div>
					),
				);
			} else {
				leftPart.push(
					RowComponent ? (
						<RowComponent
							key={key}
							value={value}
							title={key}
							isTitle={key === 'title'}
							onOptionClick={(value) => updatePropertyValue(task._id, key, value)}
							{...(componentType === 'workflow' ? { workflows } : {})}
							{...(key === 'client'
								? {
										persons: clients,
										showName: true,
								  }
								: {})}
							{...(key === 'assignedTo' ? { persons: tenantUsers } : {})}
							{...(key === 'updatedAt' || key === 'createdAt'
								? { showDropDown: false }
								: {})}
						/>
					) : (
						<div key={key}>{value}</div>
					),
				);
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
	};

	return (
		<div className="listItemRowContainer" onClick={() => handleRowClick(task._id)}>
			<div className="listItemRow">{generateRow(task)}</div>
		</div>
	);
};

export default memo(ListViewRow);
