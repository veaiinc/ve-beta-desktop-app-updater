import React, { useCallback } from 'react';
import '../../../../assets/scss/tasks/filterComponent.scss';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrow.svg';
import { ReactComponent as BackArrow } from '../../../../assets/svg/gallery/backArrow.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { Tooltip } from 'antd';
import Person from './Person';
import WorkFlow from './WorkFlow';
import Status from './Status';
import Priority from './Priority';
import DateView from './DateView';
const FilterComponent = ({
	Icon,
	title,
	type,
	value,
	handleOnChange,
	fieldName,
	filters,
	updateListViewInfo,
	workflows,
	tenantUsers,
}) => {
	const handleFilterChange = useCallback(
		(key, value) => {
			console.log(key, typeof value);

			const newFilters = filters.map((item) =>
				item.key === key
					? { ...item, value: typeof value === 'object' ? value?.value : value }
					: item,
			);
			updateListViewInfo('filters', newFilters);
		},
		[filters, updateListViewInfo],
	);

	const removeFilter = useCallback(() => {
		const newFilters = filters.filter((item) => item.key !== fieldName);
		updateListViewInfo('filters', newFilters);
	}, [fieldName, filters, updateListViewInfo]);

	const componentOptionsMapper = {
		workflow: (value) => (
			<WorkFlow
				val={value}
				workflows={workflows}
				onOptionClick={(value) => handleFilterChange('workflow', value)}
			/>
		),
		person: (value) => (
			<Person
				value={value}
				persons={tenantUsers}
				title={title}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
				showName={true}
			/>
		),
		status: (value) => (
			<Status
				value={value || 'todo'}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
			/>
		),
		priority: (value) => (
			<Priority
				value={value || 'low'}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
			/>
		),
		date: (value) => (
			<DateView
				value={value}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
			/>
		),
	};

	return (
		<Tooltip
			overlayClassName="filterComponent-tooltip"
			color="transparent"
			arrow={false}
			trigger={'click'}
			style={{ padding: 0 }}
			title={
				<div className="filterComponent-container">
					<div className="filterComponent-header">
						{/* <BackArrow width={16} height={16} className="cursor-pointer" /> */}
						<span className="filterComponent-header-title">Add Filter</span>
						<button onClick={removeFilter} className="filterComponent-header-remove">
							<CrossIcon width={24} height={24} className="cursor-pointer" />
						</button>
					</div>
					<div className="filterComponent-field">
						<span className="filterComponent-field-title">{title}</span>
						<span className="filterComponent-field-is">is</span>
					</div>
					{componentOptionsMapper[type] ? (
						componentOptionsMapper[type](value)
					) : (
						<input
							type="text"
							className="filterComponent-field-input"
							value={value}
							onChange={(e) => handleFilterChange(fieldName, e.target.value)}
						/>
					)}
				</div>
			}
			placement="bottomLeft"
		>
			<div className="filterComponent">
				{Icon && <Icon className="filterComponent-icon" />}
				<span className="filterComponent-title">{title}</span>
				<DownArrow />
			</div>
		</Tooltip>
	);
};

export default FilterComponent;
