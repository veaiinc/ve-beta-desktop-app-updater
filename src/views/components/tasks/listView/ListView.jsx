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
import ListViewSidebar from '../../modalsV2/tasks/ListViewSidebar';
import WorkFlow from './WorkFlow';

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
	workflow: WorkFlow,
};

const responseTypes = {
	title: 'text',
	description: 'text',
	status: 'status',
	priority: 'priority',
	workflowTemplateId: 'text',
	workflowId: 'workflow',
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
		templates: { getTemplatesListForCreateLead, templatesListForCreateLead },
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		workflows: [],
		tenantUsers: [],
	});
	useEffect(() => {
		getListItems({
			filters: {
				limit: 20,
				page: 1,
			},
		});
		getTemplatesListForCreateLead();
		getTeamMembers();
	}, []);

	useEffect(() => {
		if (listTasks) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: listTasks?.data || [],
				properties: mapPropertyType(listTasks?.data?.[0]),
			}));
		}
	}, [listTasks]);

	useEffect(() => {
		if (templatesListForCreateLead) {
			setInfo((prevInfo) => ({
				...prevInfo,
				workflows: templatesListForCreateLead?.data || [],
			}));
		}
	}, [templatesListForCreateLead]);

	useEffect(() => {
		if (tenantsUserList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: tenantsUserList || [],
			}));
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (info?.selectedRow) {
			updateListViewInfo(
				'selectedRow',
				info?.listItems.find((item) => item._id === info?.selectedRow._id),
			);
		}
	}, [info?.listItems, info?.selectedRow]);

	const updateListViewInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const mapPropertyType = useCallback((row) => {
		let properties = [];
		for (let key in row) {
			if (key === '__typename' || key === '_id') {
				continue;
			}

			properties.push({
				propName: key,
				type: responseTypes[key],
				show: true,
			});
		}
		return properties;
	}, []);

	const togglePropertyVisibility = useCallback((index, value) => {
		setInfo((prevInfo) => {
			const newProperties = [...prevInfo?.properties];
			newProperties[index] = { ...newProperties[index], show: value };
			return {
				...prevInfo,
				properties: newProperties,
			};
		});
	}, []);

	const updatePropertyValue = useCallback((rowId, propName, value) => {
		setInfo((prevInfo) => {
			const newListItems = [...prevInfo?.listItems].map((row) => {
				if (row._id === rowId) {
					return {
						...row,
						[propName]: value,
					};
				}
				return row;
			});
			return {
				...prevInfo,
				listItems: newListItems,
			};
		});
	}, []);

	const generateRow = useCallback(
		(row) => {
			const leftPart = [];
			const rightPart = [];
			let titleReached = false;

			for (let key in row) {
				const value = row[key];

				if (!value || key === '__typename' || key === '_id') {
					continue;
				}

				const property = info?.properties?.find((item) => item.propName === key);
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
								onOptionClick={(value) => updatePropertyValue(row._id, key, value)}
								{...(componentType === 'workflow'
									? { workflows: info?.workflows }
									: {})}
								{...(key === 'updatedBy' ? { persons: info?.tenantUsers } : {})}
								// {...(key === 'client' ? { options: info?.clients } : {})}
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
								{...(componentType === 'workflow'
									? { workflows: info?.workflows }
									: {})}
								{...(key === 'updatedBy' ? { options: info?.tenantUsers } : {})}
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
				<div key="leftPart" className="leftPart">
					{leftPart}
				</div>,
				<div key="rightPart" className="rightPart">
					{rightPart}
				</div>,
			];
		},
		[info?.properties, info?.workflows, info?.tenantUsers, updatePropertyValue],
	);

	const addNewTask = useCallback(async (payload) => {
		const response = await addListItem({ input: payload });
		if (response) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: [...prevInfo?.listItems, response?.createTask],
			}));
		}
	}, []);

	const handleRowClick = useCallback(
		(rowId) => {
			const row = info?.listItems?.find((row) => row._id === rowId);
			if (row) {
				updateListViewInfo('selectedRow', row);
				updateListViewInfo('sidebarIsOpen', true);
			}
		},
		[info?.listItems],
	);

	return (
		<div className="listViewParentContainer">
			<div className="listHeader">
				<h2 className="listView-title">Tasks</h2>

				<Tooltip
					placement="bottom"
					title={
						<OptionsDropDown
							properties={info?.properties}
							togglePropertyVisibility={togglePropertyVisibility}
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
				{info?.listItems?.length !== 0
					? info?.listItems?.map((row, index) => (
							<div
								className="listItemRow"
								key={index}
								onClick={() => handleRowClick(row._id)}
							>
								{generateRow(row)}
							</div>
					  ))
					: ''}
			</div>
			<CreateTaskPopup
				isOpen={info?.isCreateModalOpen}
				closeModal={() => updateListViewInfo('isCreateModalOpen', false)}
				addNewTask={addNewTask}
				workflows={info?.workflows}
			/>
			<ListViewSidebar
				selectedRow={info?.selectedRow}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={() => updateListViewInfo('sidebarIsOpen', false)}
				updatePropertyValue={updatePropertyValue}
			/>
		</div>
	);
};

export default memo(ListView);
