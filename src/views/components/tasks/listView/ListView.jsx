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
import { Tooltip } from 'antd';

const rowTypes = {
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
};

const responseTypes = {
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
};

const ListView = () => {
	const {
		tasks: { listTasks, getListItems, addListItem },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: [],
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

	const updateListViewInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const generateRow = useCallback((row) => {
		const rowItems = [];
		for (let key in row) {
			const value = row[key];
			if (!value || key == '__typename') {
				continue;
			}
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

	const addNewTask = useCallback(async (payload) => {
		const response = await addListItem({ input: payload });
		if (response) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: [...prevInfo?.listItems, response?.createTask],
			}));
		}
	}, []);

	return (
		<div className="listViewParentContainer">
			<div className="listHeader">
				{/* <button className="btn-stats">
					<ChartList />
				</button> */}

				<Tooltip
					placement="bottom"
					title={
						<OptionsDropDown
							properties={info?.properties}
							open={info?.isOptionsDropDownOpen}
						/>
					}
					arrow={false}
					trigger={'click'}
					color={'transparent'}
					overlayStyle={{ minWidth: 'fit-content' }}
				>
					<button className="btn-options">
						<OptionsLine />
					</button>
				</Tooltip>
				<button
					className="btn-createTask"
					onClick={() => updateListViewInfo('isCreateModalOpen', true)}
				>
					Create new task
				</button>
			</div>
			<div className="listContainer">
				{info?.listItems
					? info?.listItems?.map((row, index) => (
							<div className="listItemRow" key={index}>
								{generateRow(row)}
							</div>
					  ))
					: ''}
			</div>
			<CreateTaskPopup
				isOpen={info?.isCreateModalOpen}
				closeModal={() => updateListViewInfo('isCreateModalOpen', false)}
				addNewTask={addNewTask}
			/>
		</div>
	);
};

export default memo(ListView);
