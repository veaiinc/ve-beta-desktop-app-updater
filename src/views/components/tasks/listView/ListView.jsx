import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import { ReactComponent as ChartList } from '../../../../assets/svg/tasks/chartLine.svg';
import { ReactComponent as OptionsLine } from '../../../../assets/svg/tasks/optionsLine.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
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
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import CreateTaskPopup from '../../modalsV2/tasks/CreateTaskPopup';

const ListView = () => {
	const [info, setInfo] = useState({
		listItems: [
			{
				_id: '675040179acebeb7cb6406a3',
				title: ' test',
				description: 'sdfgh rtyu ertyu',
				status: 'todo',
				priority: 'low',
				workflowTemplateId: '674d4726a6197ccc17241b9b',
				workflowId: '668fde44f6446e011c5d4354',
				client: null,
				assignedTo: null,
				dueDate: 20241228,
				assignedBy: null,
				assignedAt: null,
				completedAt: null,
				createdAt: 1733312535,
				updatedAt: 1733312535,
				createdBy: '66e82e442c20e33a4f04f040',
				updatedBy: '66e82e442c20e33a4f04f040',
			},
			{
				_id: '67503fea9acebeb7cb6406a2',
				title: ' sample title',
				description: 'sdfgh rtyu ertyu',
				status: 'todo',
				priority: 'low',
				workflowTemplateId: '674d4726a6197ccc17241b9b',
				workflowId: '668fde44f6446e011c5d4354',
				client: null,
				assignedTo: null,
				dueDate: 20241228,
				assignedBy: null,
				assignedAt: null,
				completedAt: null,
				createdAt: 1733312490,
				updatedAt: 1733312490,
				createdBy: '66e82e442c20e33a4f04f040',
				updatedBy: '66e82e442c20e33a4f04f040',
			},
			{
				_id: '6750041128f0e43b63a576b9',
				title: 'sample title 2',
				description: 'asdfgh werty',
				status: 'completed',
				priority: 'medium',
				workflowTemplateId: '6704e431ae01f0dc8fc1eaa5',
				workflowId: '66e7df2f079ca82993cd21f6',
				client: '66e82e442c20e33a4f04f040',
				assignedTo: null,
				dueDate: 20241228,
				assignedBy: null,
				assignedAt: null,
				completedAt: null,
				createdAt: 1733297169,
				updatedAt: 1733297169,
				createdBy: '66e82e442c20e33a4f04f040',
				updatedBy: '66e82e442c20e33a4f04f040',
			},
			{
				_id: '674f0f09c0a47ecf542064bc',
				title: 'updated title',
				description: 'sample description',
				status: 'todo',
				priority: 'low',
				workflowTemplateId: '6704e431ae01f0dc8fc1eaa5',
				workflowId: '66e7df2f079ca82993cd21f6',
				client: '66e7d9cc1319f53f63c506da',
				assignedTo: null,
				dueDate: 20241228,
				assignedBy: null,
				assignedAt: null,
				completedAt: null,
				createdAt: 1733234441,
				updatedAt: 1733297542,
				createdBy: '66e82e442c20e33a4f04f040',
				updatedBy: '66e82e442c20e33a4f04f040',
			},
		],
		isOptionsDropDownOpen: false,
		properties: [],
	});

	const rowTypes = useMemo(() => ({
		text: Text,
		select: Select,
		person: Person,
		'multi-select': MultiSelect,
		date: DateView,
		id: Id,
		status: Status,
		priority: Priority,
		email: Email,
		phone: Phone,
		url: Url,
		checkbox: CheckBox,
	}));

	const responseTypes = useMemo(
		() => ({
			_id: 'id',
			title: 'text',
			description: 'text',
			status: 'status',
			priority: 'priority',
			workflowTemplateId: 'text',
			workflowId: 'text',
			client: 'text',
			assignedTo: 'person',
			dueDate: 'date',
			assignedBy: 'person',
			assignedAt: 'date',
			completedAt: 'date',
			createdAt: 'date',
			updatedAt: 'date',
			createdBy: 'person',
			updatedBy: 'person',
		}),
		[],
	);

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

	const generateRow = useCallback((row) => {
		const rowItems = [];
		for (let key in row) {
			const value = row[key];
			const componetType = responseTypes[key];
			const RowComponent = rowTypes[componetType] || null;
			rowItems.push(
				RowComponent ? (
					<RowComponent key={key} value={value} title={key} isTitle={key === 'title'} />
				) : (
					<div key={key}>{value}</div>
				),
			);
		}

		return rowItems;
	}, []);

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
			<div className="listContainer">
				{info?.listItems
					? info?.listItems?.map((row, index) => (
							<div className="listItem" key={index}>
								{generateRow(row)}
							</div>
					  ))
					: ''}
			</div>
			<CreateTaskPopup />
		</div>
	);
};

export default ListView;
