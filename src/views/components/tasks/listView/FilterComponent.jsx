import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/filterComponent.scss';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrow.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { Tooltip } from 'antd';
import Person from './Person';
import WorkFlow from './WorkFlow';
import Status from './Status';
import Priority from './Priority';
import DateView from './DateView';
import moment from 'moment';
const FilterComponent = ({
	Icon,
	title,
	type,
	value,
	fieldName,
	filters,
	updateListViewInfo,
	isPending,
	onConfirm,
	setPendingFilters,
	props,
}) => {
	const handleFilterChange = useCallback(
		(key, value) => {
			if (isPending) {
				onConfirm(key, value);
			} else {
				const newFilters = filters.map((item) =>
					item.key === key ? { ...item, value } : item,
				);
				updateListViewInfo('filters', newFilters);
			}
		},
		[filters, updateListViewInfo, isPending, onConfirm],
	);
	const removeFilter = useCallback(() => {
		if (isPending) {
			setPendingFilters((prev) => prev.filter((f) => f.key !== fieldName));
		} else {
			const newFilters = filters.filter((item) => item.key !== fieldName);
			updateListViewInfo('filters', newFilters);
		}
	}, [fieldName, filters, updateListViewInfo, isPending, setPendingFilters]);
	const componentOptionsMapper = {
		workflow: (value) => (
			<WorkFlow
				value={value}
				{...props}
				onOptionClick={(value) => {
					const workflow = props?.options?.find((workflow) => workflow._id === value);
					handleFilterChange('workflow', workflow);
				}}
			/>
		),
		person: (value) => (
			<Person
				value={value?.value}
				title={title}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
				showLabel={true}
				defaultLabel={'hiiii'}
				{...props}
			/>
		),
		status: (value) => (
			<Status
				value={value}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
				setDefault={false}
			/>
		),
		priority: (value) => (
			<Priority
				value={value}
				onOptionClick={(value) => handleFilterChange(fieldName, value)}
				setDefault={false}
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
				<span className="filterComponent-value">
					:{' '}
					{type === 'date' && value
						? moment.unix(value).format('MMM DD')
						: typeof value === 'object'
						? value?.title || value?.name || value?.label
						: value}
				</span>
				<DownArrow />
			</div>
		</Tooltip>
	);
};

export default memo(FilterComponent);
