import React, { useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listViewRow.scss';
import Context from '../../../../context/context';
const ListViewRow = ({
	task,
	properties,
	responseTypes,
	rowTypes,
	updatePropertyValue,
	workflows,
	tenantUsers,
	handleRowClick,
}) => {
	const {
		templates: { clientList, getClientList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflowId: task?.workflowId,
		clients: clientList?.data?.map(({ name, _id }) => ({ label: name, value: _id })),
	});

	const [initialWorkflowId, setInitialWorkflowId] = useState(task?.workflowId?._id);

	useEffect(() => {
		getClientList({ filters: { limit: 10, page: 1, workflowId: info?.workflowId } });
	}, [info?.workflowId]);

	useEffect(() => {
		// console.log(clientList);

		if (clientList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				clients: clientList?.data?.map(({ name, _id }) => ({ label: name, value: _id })),
			}));
		}
	}, [clientList]);

	useEffect(() => {
		if (task?.workflowId?._id !== initialWorkflowId && info?.clients?.length > 0) {
			updatePropertyValue(task._id, 'client', info?.clients[0]);
		}
	}, [task?.workflowId?._id, info?.clients]);

	const customUpdateForWorkflow = (value) => {
		setInfo((prevInfo) => ({ ...prevInfo, workflowId: value._id }));
		updatePropertyValue(task._id, 'workflowId', value);
	};
	const generateRow = (row) => {
		const leftPart = [];
		const rightPart = [];
		let titleReached = false;

		for (let key in row) {
			const value = row[key];

			if (!value || key === '__typename' || key === '_id' || key === 'workflowTemplateId') {
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
							onOptionClick={(value) => {
								if (key === 'workflowId') {
									customUpdateForWorkflow(value);
								} else {
									updatePropertyValue(task._id, key, value);
								}
							}}
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
							{...(componentType === 'workflow' ? { workflows } : {})}
							{...(key === 'updatedBy' ? { options: tenantUsers } : {})}
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

export default ListViewRow;
