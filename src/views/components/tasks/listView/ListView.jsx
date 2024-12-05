import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import Context from '../../../../context/context';

const ListView = () => {
	const {
		tasks: { listTasks, getListItems },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: null,
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
	});

	useEffect(() => {
		getListItems({
			filters: {
				limit: 20,
				page: 1,
			},
		});
	}, []);

	useEffect(() => {
		if (listTasks) {
			setInfo((prevInfo) => ({ ...prevInfo, listItems: listTasks?.data || [] }));
		}
	}, [listTasks]);

	useEffect(() => {
		if (info?.selectedDatabase) {
			const properties = Object.keys(info?.selectedDatabase.metadata.properties).map(
				(propName) => ({ propName, show: true }),
			);
			setInfo((prevInfo) => ({ ...prevInfo, properties }));
		}
	}, [info?.selectedDatabase]);

	const rowTypes = useMemo(
		() => ({
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
		}),
		[],
	);

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

	const updateListViewInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	const togglePropertyVisibility = useCallback((index) => {
		setInfo((prevInfo) => {
			const newProperty = [...prevInfo?.properties];
			newProperty[index] = {
				...newProperty[index],
				show: !newProperty[index].show,
			};
			return { ...prevInfo, properties: newProperty };
		});
	}, []);

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

export default memo(ListView);
