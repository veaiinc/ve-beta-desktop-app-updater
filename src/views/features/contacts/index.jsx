import React, { memo, useMemo, useState } from 'react';
import ListView from '../../components/tasks/listView/ListView';

const Contacts = () => {
	const [info, setInfo] = useState({
		listItems: [
			{ name: 'Sabith', email: 'sabith@example.com', phone: '+1 234-567-8901' },
			{ name: 'John Doe', email: 'john@example.com', phone: '+1 555-123-4567' },
			{ name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-987-6543' },
			{ name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 555-246-8135' },
			{ name: 'Michael Brown', email: 'michael@example.com', phone: '+1 555-369-1478' },
		],
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		selectedSubTask: null,
		workflows: [],
		tenantUsers: [],
		page: 1,
		hasMore: false,
		loadingSkeleton: false,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
	});
	const responseMetadata = useMemo(
		() => ({
			name: { isTitle: true, type: 'text', name: 'Name' },
			email: { type: 'email', name: 'Email' },
			phone: { type: 'phone', name: 'Phone' },
		}),
		[],
	);
	return (
		<div>
			{/* {contextHolder} */}
			<ListView
				info={info}
				updateListViewInfo={() => {}}
				resetSubTasks={() => {}}
				togglePropertyVisibility={() => {}}
				updatePropertyValue={() => {}}
				deleteTask={() => {}}
				addNewTask={() => {}}
				responseMetadata={responseMetadata}
			/>
		</div>
	);
};

export default memo(Contacts);
