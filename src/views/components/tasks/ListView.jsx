import React, { useEffect, useState } from 'react';
import '../../../assets/scss/tasks/listView.scss';
import { ReactComponent as ChartList } from '../../../assets/svg/tasks/chartLine.svg';
import { ReactComponent as OptionsLine } from '../../../assets/svg/tasks/optionsLine.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/tasks/plus.svg';
import Text from './Text';
import Id from './Id';
import Select from './Select';
import Person from './Person';
import MultiSelect from './MultiSelect';
import DateView from './DateView';
import Status from './Status';
import Priority from './Priority';
import Email from './Email';
import Url from './Url';
import Phone from './Phone';
import CheckBox from './CheckBox';
import OptionsDropDown from '../dropDown/tasks/OptionsDropDown';

const dbs = {
	usersDatabase: {
		// Centralized metadata defining the schema and formats for properties
		metadata: {
			properties: {
				title: {
					type: 'text',
				},
				email: {
					type: 'email', // Email type, holds the value of the user's email
				},
				phone: {
					type: 'phone', // Phone type, holds the user's phone number
				},
				isActive: {
					type: 'checkbox', // Checkbox type, indicates whether the user is active or not
				},
				role: {
					type: 'select', // A select field for user roles
					options: [{ label: 'Admin' }, { label: 'Editor' }, { label: 'Viewer' }],
				},
				createdAt: {
					type: 'date',
					format: 'MMM DD, YYYY', // Date format for createdAt
					timestamp: true, // Whether this field should store a timestamp
				},
				updatedAt: {
					type: 'date',
					format: 'MMM DD, YYYY',
					timestamp: true,
				},
				createdBy: {
					type: 'person',
				},
				lastEditedBy: {
					type: 'person',
				},
				recordId: {
					type: 'id', // Unique identifier for each user
				},
			},
			viewMetadata: {
				viewType: 'list',
				filters: [
					{ property: 'isActive', value: true }, // Filter to show only active users
					{ property: 'role', value: 'Admin' }, // Filter to show only Admin role
				],
				sortOrder: [{ property: 'createdAt', order: 'ascending' }],
			},
		},

		// Rows now only include selected values; metadata determines how they are formatted
		rows: [
			{
				title: { type: 'text', value: 'John Doe' },
				email: { type: 'email', value: 'john.doe@example.com' },
				phone: { type: 'phone', value: '+1-800-555-0101' },
				isActive: { type: 'checkbox', value: true },
				role: { type: 'select', value: 'Admin' },
				createdAt: {
					type: 'date',
					value: '2024-11-20',
					format: 'MMM DD, YYYY',
				},
				updatedAt: {
					type: 'date',
					value: '2024-11-22',
					format: 'MMM DD, YYYY',
				},
				createdBy: { type: 'person', name: 'Jane Smith' },
				lastEditedBy: { type: 'person', name: 'John Doe' },
				recordId: { type: 'id', value: 'U001' },
			},
			{
				name: { type: 'text', value: 'Jane Smith' },
				email: { type: 'email', value: 'jane.smith@example.com' },
				phone: { type: 'phone', value: '+1-800-555-0102' },
				isActive: { type: 'checkbox', value: false },
				role: { type: 'select', value: 'Editor' },
				createdAt: {
					type: 'date',
					value: '2024-11-18',
					format: 'MMM DD, YYYY',
				},
				updatedAt: {
					type: 'date',
					value: '2024-11-19',
					format: 'MMM DD, YYYY',
				},
				createdBy: { type: 'person', name: 'Mike Johnson' },
				lastEditedBy: { type: 'person', name: 'Jane Smith' },
				recordId: { type: 'id', value: 'U002' },
			},
			{
				title: { type: 'text', value: 'Mike Johnson' },
				email: { type: 'email', value: 'mike.johnson@example.com' },
				phone: { type: 'phone', value: '+1-800-555-0103' },
				isActive: { type: 'checkbox', value: true },
				role: { type: 'select', value: 'Viewer' },
				createdAt: {
					type: 'date',
					value: '2024-11-10',
					format: 'MMM DD, YYYY',
				},
				updatedAt: {
					type: 'date',
					value: '2024-11-12',
					format: 'MMM DD, YYYY',
				},
				createdBy: { type: 'person', name: 'John Doe' },
				lastEditedBy: { type: 'person', name: 'Mike Johnson' },
				recordId: { type: 'id', value: 'U003' },
			},
		],
	},
	tasksDatabase: {
		// Centralized metadata defining the schema and formats for properties
		metadata: {
			properties: {
				// Properties with select, multi-select, etc.
				status: {
					type: 'status',
				},
				priority: {
					type: 'priority',
				},
				tags: {
					type: 'multi-select',
					options: [
						{ label: 'Design' },
						{ label: 'Development' },
						{ label: 'Marketing' },
						{ label: 'Branding' },
					],
				},
				assignedTo: {
					type: 'person',
					options: ['John Doe', 'Jane Smith', 'Mike Johnson'],
				},
				project: {
					type: 'relation',
					linkedDatabase: 'projects',
				},
				subtasks: {
					type: 'relation',
					linkedDatabase: 'tasks',
				},
				// Metadata for date and other properties
				createdAt: {
					type: 'date',
					format: 'MMM DD, YYYY', // Date format for createdAt
					timestamp: true, // Whether this field should store a timestamp
				},
				updatedAt: {
					type: 'date',
					format: 'MMM DD, YYYY',
					timestamp: true,
				},
				createdBy: {
					type: 'person',
					// No specific format needed, just person reference
				},
				lastEditedBy: {
					type: 'person',
				},
				recordId: {
					type: 'id',
					// No specific format, just unique identifier
				},
			},
			viewMetadata: {
				viewType: 'list',
				filters: [
					{ property: 'status', value: 'In Progress' },
					{ property: 'priority', value: 'High' },
				],
				sortOrder: [{ property: 'dueDate', order: 'ascending' }],
				groupBy: 'status',
			},
		},

		// Rows now only include selected values; metadata determines how they are formatted
		rows: [
			{
				title: { type: 'text', value: 'Prepare Presentation' },
				status: { type: 'status', value: 'In progress' },
				priority: { type: 'priority', value: 'High' },
				dueDate: { type: 'date', value: '2024-12-10', format: 'MMM DD' },
				assignedTo: { type: 'person', name: 'Jane Smith' },
				tags: { type: 'multi-select', value: [{ color: 'red', label: 'Marketing' }] },
				createdAt: {
					type: 'date',
					value: '2024-11-30',
					format: 'MMM DD, YYYY',
				},
				updatedAt: {
					type: 'date',
					value: '2024-12-01',
					format: 'MMM DD, YYYY',
				},
				createdBy: { type: 'person', name: 'Mike Johnson' },
				lastEditedBy: { type: 'person', name: 'Jane Smith' },
				recordId: { type: 'id', value: 'VEAI-003' },
				// project: { type: 'relation', value: { id: 'P002', name: 'Project B' } },
				// subtasks: {
				// 	type: 'relation',
				// 	value: [
				// 		{ id: 'T005', name: 'Create Slide Deck' },
				// 		{ id: 'T006', name: 'Review Draft with Team' },
				// 	],
				// },
			},
			{
				title: { type: 'text', value: 'Update Website Content' },
				status: { type: 'status', value: 'Done' },
				priority: { type: 'priority', value: 'Medium' },
				dueDate: { type: 'date', value: '2024-12-05', format: 'MMM DD' },
				assignedTo: { type: 'person', name: 'John Doe' },
				tags: { type: 'multi-select', value: [{ color: 'green', label: 'Development' }] },
				createdAt: {
					type: 'date',
					value: '2024-11-29',
					format: 'MMM DD, YYYY',
				},
				updatedAt: {
					type: 'date',
					value: '2024-11-30',
					format: 'MMM DD, YYYY',
				},
				createdBy: { type: 'person', name: 'Jane Smith' },
				lastEditedBy: { type: 'person', name: 'John Doe' },
				recordId: { type: 'id', value: 'VEAI-004' },
				// project: { type: 'relation', value: { id: 'P001', name: 'Project A' } },
				// subtasks: {
				// 	type: 'relation',
				// 	value: [
				// 		{ id: 'T007', name: 'Draft New Content' },
				// 		{ id: 'T008', name: 'Implement in CMS' },
				// 	],
				// },
			},
		],
	},
};

const tasksDatabase = {
	// Centralized metadata defining the schema and formats for properties
	metadata: {
		properties: {
			// Properties with select, multi-select, etc.
			status: {
				type: 'status',
			},
			priority: {
				type: 'priority',
			},
			tags: {
				type: 'multi-select',
				options: [
					{ label: 'Design' },
					{ label: 'Development' },
					{ label: 'Marketing' },
					{ label: 'Branding' },
				],
			},
			assignedTo: {
				type: 'person',
				options: ['John Doe', 'Jane Smith', 'Mike Johnson'],
			},
			project: {
				type: 'relation',
				linkedDatabase: 'projects',
			},
			subtasks: {
				type: 'relation',
				linkedDatabase: 'tasks',
			},
			// Metadata for date and other properties
			createdAt: {
				type: 'date',
				format: 'MMM DD, YYYY', // Date format for createdAt
				timestamp: true, // Whether this field should store a timestamp
			},
			updatedAt: {
				type: 'date',
				format: 'MMM DD, YYYY',
				timestamp: true,
			},
			createdBy: {
				type: 'person',
				// No specific format needed, just person reference
			},
			lastEditedBy: {
				type: 'person',
			},
			recordId: {
				type: 'id',
				// No specific format, just unique identifier
			},
		},
		viewMetadata: {
			viewType: 'list',
			filters: [
				{ property: 'status', value: 'In Progress' },
				{ property: 'priority', value: 'High' },
			],
			sortOrder: [{ property: 'dueDate', order: 'ascending' }],
		},
	},

	// Rows now only include selected values; metadata determines how they are formatted
	rows: [
		{
			title: { type: 'text', value: 'Prepare Presentation' },
			status: { type: 'status', value: 'In progress' },
			priority: { type: 'priority', value: 'High' },
			dueDate: { type: 'date', value: '2024-12-10', format: 'MMM DD' },
			assignedTo: { type: 'person', name: 'Jane Smith' },
			tags: { type: 'multi-select', value: [{ color: 'red', label: 'Marketing' }] },
			createdAt: {
				type: 'date',
				value: '2024-11-30',
				format: 'MMM DD, YYYY',
			},
			updatedAt: {
				type: 'date',
				value: '2024-12-01',
				format: 'MMM DD, YYYY',
			},
			createdBy: { type: 'person', name: 'Mike Johnson' },
			lastEditedBy: { type: 'person', name: 'Jane Smith' },
			recordId: { type: 'id', value: 'VEAI-003' },
			project: { type: 'relation', value: { id: 'P002', name: 'Project B' } },
			subtasks: {
				type: 'relation',
				value: [
					{ id: 'T005', name: 'Create Slide Deck' },
					{ id: 'T006', name: 'Review Draft with Team' },
				],
			},
		},
		{
			title: { type: 'text', value: 'Update Website Content' },
			status: { type: 'status', value: 'Done' },
			priority: { type: 'priority', value: 'Medium' },
			dueDate: { type: 'date', value: '2024-12-05', format: 'MMM DD' },
			assignedTo: { type: 'person', name: 'John Doe' },
			tags: { type: 'multi-select', value: [{ color: 'green', label: 'Development' }] },
			createdAt: {
				type: 'date',
				value: '2024-11-29',
				format: 'MMM DD, YYYY',
			},
			updatedAt: {
				type: 'date',
				value: '2024-11-30',
				format: 'MMM DD, YYYY',
			},
			createdBy: { type: 'person', name: 'Jane Smith' },
			lastEditedBy: { type: 'person', name: 'John Doe' },
			recordId: { type: 'id', value: 'VEAI-004' },
			project: { type: 'relation', value: { id: 'P001', name: 'Project A' } },
			subtasks: {
				type: 'relation',
				value: [
					{ id: 'T007', name: 'Draft New Content' },
					{ id: 'T008', name: 'Implement in CMS' },
				],
			},
		},
	],
};

const ListView = () => {
	const [info, setInfo] = useState({
		selectedDatabase: null,
		availableDabatases: Object.keys(dbs),
		isOptionsDropDownOpen: false,
		properties: [],
	});

	useEffect(() => {
		if (info?.selectedDatabase) {
			const properties = Object.keys(info?.selectedDatabase.metadata.properties).map(
				(propName) => ({ propName, show: true }),
			);
			setInfo((prevInfo) => ({ ...prevInfo, properties }));
		}
	}, [info?.selectedDatabase]);

	const updateListViewInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	const togglePropertyVisibility = (index) => {
		setInfo((prevInfo) => {
			const newProperty = [...prevInfo?.properties];
			newProperty[index] = {
				...newProperty[index],
				show: !newProperty[index].show,
			};
			return { ...prevInfo, properties: newProperty };
		});
	};

	const generateRow = (row) => {
		const rowItems = [];
		const metadata = info?.selectedDatabase?.metadata?.properties;
		for (let key in row) {
			const property = row[key];
			const showProperty = info?.properties.find(({ propName }) => propName === key)?.show;

			if (!showProperty) {
				continue;
			}

			switch (property.type) {
				case 'text':
					rowItems.push(<Text {...property} {...metadata[key]} title={key} />);
					break;
				case 'select':
					rowItems.push(<Select {...property} {...metadata[key]} title={key} />);
					break;
				case 'person':
					rowItems.push(<Person {...property} {...metadata[key]} />);
					break;
				case 'multi-select':
					rowItems.push(<MultiSelect {...property} {...metadata[key]} />);
					break;
				case 'date':
					rowItems.push(<DateView {...property} {...metadata[key]} />);
					break;
				case 'id':
					rowItems.push(<Id {...property} {...metadata[key]} />);
					break;
				case 'status':
					rowItems.push(<Status {...property} {...metadata[key]} />);
					break;
				case 'priority':
					rowItems.push(<Priority {...property} {...metadata[key]} />);
					break;
				case 'email':
					rowItems.push(<Email {...property} {...metadata[key]} />);
					break;
				case 'phone':
					rowItems.push(<Phone {...property} {...metadata[key]} />);
					break;
				case 'url':
					rowItems.push(<Url {...property} {...metadata[key]} />);
					break;
				case 'checkbox':
					rowItems.push(<CheckBox {...property} {...metadata[key]} />);
					break;
				default:
					rowItems.push(<div>{property.type}</div>);
			}
		}
		return rowItems;
	};

	return (
		<div className="listViewParentContainer">
			<div className="listHeader">
				<button className="btn-stats">
					<ChartList />
				</button>
				<button
					className="btn-options"
					onClick={() =>
						updateListViewInfo('isOptionsDropDownOpen', !info?.isOptionsDropDownOpen)
					}
				>
					<OptionsLine />
				</button>
				<button className="btn-createTask">Create new task</button>
				<OptionsDropDown
					properties={info?.properties}
					togglePropertyVisibility={togglePropertyVisibility}
					open={info?.isOptionsDropDownOpen}
				/>
			</div>
			<div className="listViewItemsContainer">
				<div className="group">
					<div className="groupHeader">
						<div className="groupDetails">
							<div className="icon">
								<div className="avatar"></div>
							</div>
							<div className="text">Avinash</div>
							<div className="itemCount">4</div>
						</div>
						<PlusSvg />
					</div>
					<div className="listContainer">
						{info?.selectedDatabase ? (
							info?.selectedDatabase?.rows?.map((row, index) => (
								<div className="listItem">{generateRow(row)}</div>
							))
						) : (
							<div className="availabledbsContainer">
								<h3>Connect Database</h3>
								{info?.availableDabatases?.map((dbName) => (
									<div
										className="dbItem"
										key={dbName}
										onClick={() =>
											updateListViewInfo('selectedDatabase', dbs[dbName])
										}
									>
										{dbName}
									</div>
								))}
							</div>
						)}
						{
							// <div className="listItem">
							// 	{/* {generateRow(row)} */}
							// 	<CheckBox value={true} />
							// 	<Priority value={'Critical'} />
							// 	<Id value={'VEAI-001'} />
							// 	<Text value={'Change color of something'} />
							// 	<Status value={'Todo'} />
							// 	<MultiSelect
							// 		value={[
							// 			{ color: 'green', label: 'Features' },
							// 			{ color: 'red', label: 'Bugs' },
							// 		]}
							// 		options={[
							// 			{ color: 'green', label: 'Features' },
							// 			{ color: 'red', label: 'Bugs' },
							// 			{ color: 'blue', label: 'Improments' },
							// 		]}
							// 	/>
							// 	<DateView value={new Date()} format={'MMM DD'} title={'Due date'} />
							// 	<DateView
							// 		value={new Date()}
							// 		format={'MMM DD'}
							// 		timestamp
							// 		title={'Created time'}
							// 	/>
							// 	<Person
							// 		profile={
							// 			'https://a.storyblok.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp'
							// 		}
							// 		name={'Prasanth'}
							// 		showName={false}
							// 		title={'Created by'}
							// 	/>
							// 	<Phone value={'5627177819'} />
							// 	<Email value={'abbbc@ve.ai'} />
							// 	<Url value={'http://google.com'} />
							// </div>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListView;
