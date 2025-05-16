import { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/tasks/taskwidget.scss';
import { ReactComponent as Warn } from '../../../assets/svg/tasks/warn.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/check.svg';
import { ReactComponent as Pending } from '../../../assets/svg/tasks/time.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/tasks/calender.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SortIcon } from '../../../assets/svg/tasks/newSort.svg';
import { ReactComponent as SortDownIcon } from '../../../assets/svg/tasks/sortDown.svg';
import { ReactComponent as SortUpIcon } from '../../../assets/svg/tasks/sortUp.svg';
import { ReactComponent as CrossIcon } from '../../../assets/svg/tasks/cross.svg';

import Context from '../../../context/context';
import FilterDropdown from '../dropDown/tasks/FilterDropdown';
import CurrentViewOptions from '../dropDown/tasks/CurrentViewOptions';
import SortDropdown from '../dropDown/tasks/SortDropdown';
import { rowTypes } from '../../features/tasks/Tasks';
import TextField from './listView/TextField';
import Spinner from '../loaders/Spinner';

const Taskwidget = ({
	properties,
	responseMetadata,
	viewData,
	updateViewInfo,
	updateTaskInfo,
	searchValue,
	colors,
	showEditViewDropDown,
	handleEditViewDropDown,
	taskPreferences,
	searchLoader,
}) => {
	const {
		tasks: { listTasks },
	} = useContext(Context);
	const [info, setInfo] = useState({
		filterShown: false,
		sort: null,
		filters: null,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			sort: viewData?.sort,
		}));
	}, [viewData?._id]);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			filters: viewData?.filters,
		}));
	}, [viewData?._id]);

	const handleStateChange = (data) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			...data,
		}));
	};

	const statusOptions = responseMetadata?.status?.props?.options;
	const filteredProperties = useMemo(
		() =>
			properties?.filter((property) => {
				return !['parentTask', 'childTasks', 'createdWithAi'].includes(property?.value);
			}),
		[properties],
	);

	const handleSortChange = (sort, update = false) => {
		const currentSort = info?.sort || [];

		const updatedSort = update
			? currentSort.map((item) => (item.sortBy === sort.sortBy ? sort : item))
			: currentSort.some((item) => item.sortBy === sort.sortBy)
			? currentSort.filter((item) => item.sortBy !== sort.sortBy)
			: [...currentSort, sort];

		setInfo((prevInfo) => ({
			...prevInfo,
			sort: updatedSort,
		}));

		updateViewInfo(viewData?._id, { sort: updatedSort });
	};

	const handleClearAllSort = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			sort: [],
		}));

		updateViewInfo(viewData?._id, { sort: [] });
	};

	const handleFilterChange = (key, value) => {
		const existing = info?.filters?.find((filter) => filter.key === key);
		let newFilters;

		if (existing) {
			newFilters = info?.filters?.map((filter) =>
				filter.key === key ? { ...filter, value } : filter,
			);
		} else {
			newFilters = [...(info?.filters || []), { key, value }];
		}

		const filteredWidgets = newFilters?.filter((filter) => {
			if (key === 'status' && Array.isArray(value)) {
				return !['dueToday', 'overDue'].includes(filter?.key);
			}
			if (key === 'dueToday') {
				return (
					filter?.key !== 'overDue' &&
					!(filter?.key === 'status' && Array.isArray(filter?.value))
				);
			}
			if (key === 'overDue') {
				return (
					filter?.key !== 'dueToday' &&
					!(filter?.key === 'status' && Array.isArray(filter?.value))
				);
			}
			return true;
		});

		setInfo((prevInfo) => ({
			...prevInfo,
			filters: filteredWidgets,
		}));

		updateViewInfo(viewData?._id, { filters: filteredWidgets });
	};

	const handleClearAllFilters = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			filters: [],
		}));

		updateViewInfo(viewData?._id, { filters: [] });
	};

	const handleRemoveFilter = (index) => {
		const newFilters = info?.filters?.filter((_, i) => i !== index);

		setInfo((prevInfo) => ({
			...prevInfo,
			filters: newFilters,
		}));

		updateViewInfo(viewData?._id, { filters: newFilters });
	};

	const handleWidgetStatusFilter = (key) => {
		if (key === 'pending') {
			const todo = statusOptions?.todo;
			const inProgress = statusOptions?.inProgress;
			handleFilterChange(
				'status',
				[...todo, ...inProgress]?.map((item) => item?._id),
			);
		}
		if (key === 'completed') {
			const completed = statusOptions?.completed;
			handleFilterChange(
				'status',
				completed?.map((item) => item?._id),
			);
		}
	};

	const handleRemoveWidgetFilter = (key) => {
		let newFilters = [];

		if (Array.isArray(key)) {
			newFilters = info?.filters?.filter((filter) => !key?.includes(filter?.key));
		} else {
			newFilters = info?.filters?.filter((filter) => filter?.key !== key);
		}

		setInfo((prevInfo) => ({
			...prevInfo,
			filters: newFilters,
		}));

		updateViewInfo(viewData?._id, { filters: newFilters });
	};

	const { allTasks, today, completed, overdue, allPending } = listTasks?.analytics || {};
	let dueTodayWidget = false;
	let overDueWidget = false;
	let pendingWidget = false;
	let completedWidget = false;
	const cleanedFilters = info?.filters?.filter((filter) => {
		if (filter?.key === 'dueToday') {
			dueTodayWidget = true;
			return false;
		}
		if (filter?.key === 'overDue') {
			overDueWidget = true;
			return false;
		}
		if (filter?.key === 'status' && Array.isArray(filter?.value)) {
			const { todo, inProgress, completed } = statusOptions;
			if (filter?.value?.length === [...todo, ...inProgress]?.length) {
				pendingWidget = true;
			}
			if (filter?.value?.length === completed?.length) {
				completedWidget = true;
			}

			return false;
		}
		return true;
	});

	return (
		<div className="taskWidgetContainer">
			<div className="taskWidgetHeader taskWidgetHeaderTitle">Tasks</div>
			<div className="taskWidgetHeader filter-container">
				<div className="task-widget-search-container">
					<SearchSvg />
					<input
						type="text"
						placeholder="Search"
						className="task-widget-search-input"
						value={searchValue}
						onChange={(e) =>
							updateTaskInfo({ searchValue: e.target?.value, searchLoader: true })
						}
					/>
					{searchLoader && (
						<div className="task-widget-search-spinner">
							<Spinner width="20px" height="20px" />
						</div>
					)}
				</div>

				<button
					className="filter-icon-btn"
					onClick={() => handleStateChange({ filterShown: !info?.filterShown })}
				>
					<FilterIcon />
				</button>

				<CurrentViewOptions
					showEditViewDropDown={showEditViewDropDown}
					handleEditViewDropDown={handleEditViewDropDown}
					viewData={viewData}
					updateViewInfo={updateViewInfo}
					properties={properties}
					updateTaskInfo={updateTaskInfo}
					taskPreferences={taskPreferences}
				/>
			</div>
			{info?.filterShown && (
				<div className="filter-sort-wrapper">
					<div className="sort-filter-container">
						<div className="sort-filter-header">
							<div className="sort-filter-title">Sort</div>
							<SortDropdown
								properties={filteredProperties}
								responseMetadata={responseMetadata}
								sort={info?.sort}
								handleSortChange={handleSortChange}
							/>
							{info?.sort?.length > 0 && (
								<button className="filter-clear-btn" onClick={handleClearAllSort}>
									Clear All
								</button>
							)}
						</div>
						<div className="sort-filter-values-container">
							{info?.sort?.length > 0 ? (
								info?.sort?.map((sort) => (
									<button
										className="sort-btn"
										key={sort?.sortBy}
										onClick={() =>
											handleSortChange(
												{
													sortBy: sort?.sortBy,
													sortType: sort?.sortType * -1,
												},
												true,
											)
										}
									>
										<div className="sort-btn-text">
											{responseMetadata?.[sort?.sortBy]?.name}
										</div>
										<div className="sort-btn-icon">
											{sort?.sortType === 1 ? (
												<SortDownIcon />
											) : (
												<SortUpIcon />
											)}
										</div>
									</button>
								))
							) : (
								<div className="no-sort-text">No sort applied</div>
							)}
						</div>
					</div>
					<div className="sort-filter-container">
						<div className="sort-filter-header">
							<div className="sort-filter-title">Filter</div>
							<FilterDropdown
								properties={filteredProperties}
								responseMetadata={responseMetadata}
								colors={colors}
								filters={info?.filters}
								handleFilterChange={handleFilterChange}
							/>
							{info?.filters?.length > 0 && (
								<button
									className="filter-clear-btn"
									onClick={handleClearAllFilters}
								>
									Clear All
								</button>
							)}
						</div>
						<div className="sort-filter-values-container">
							{cleanedFilters?.length > 0 ? (
								cleanedFilters?.map((filter, index) => {
									const { type, props, name } = responseMetadata?.[filter?.key];
									let Component = null;
									if (type === 'text') {
										Component = TextField;
									} else {
										Component = rowTypes?.[type];
									}
									return (
										<div className="sort-filter-value-item" key={filter?.key}>
											<div className="filter-title">{name}</div>
											<div className="filter-type">is</div>
											<Component
												value={
													filter?.key === 'clients'
														? [filter?.value]
														: filter?.value
												}
												options={props?.options}
												labelField={props?.labelField}
												title={name}
												showLabel={true}
												multiSelect={false}
												showEmail={false}
												onOptionClick={(value) => {
													handleFilterChange(filter?.key, value);
												}}
												onChange={(value) => {
													handleFilterChange(filter?.key, value);
												}}
												hideRemove={true}
											/>
											<button
												className="filter-remove-btn"
												onClick={() => handleRemoveFilter(index)}
											>
												<CrossIcon />
											</button>
										</div>
									);
								})
							) : (
								<div className="no-sort-text">No filters applied</div>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="widgets">
				<div
					className={`taskWidgetHeaderContainer ${
						!pendingWidget && !overDueWidget && !dueTodayWidget && !completedWidget
							? 'active'
							: ''
					}`}
					onClick={() => handleRemoveWidgetFilter(['dueToday', 'overDue', 'status'])}
				>
					<div className="taskHeader">
						<div className="taskWidgetHeaderNumber">{allTasks || 0}</div>
						<div className="taskWidgetHeaderText">All tasks</div>
					</div>
					{/* <div className="taskWidgeticon">
						<ChevronRightThinSvg
							className={`chevron-icon ${info?.widgetShown && 'chevron-icon-rotate'}`}
						/>
					</div> */}
				</div>
				<div
					className={`taskWidgetcontent ${dueTodayWidget && 'active'}`}
					onClick={() => {
						if (dueTodayWidget) {
							handleRemoveWidgetFilter('dueToday', '');
						} else {
							handleFilterChange('dueToday', '');
						}
					}}
				>
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{today || 0}</div>
						<div className="taskWidgettext">Due today</div>
					</div>
					<div className="taskWidgeticon">
						<Calendar />
					</div>
				</div>
				<div
					className={`taskWidgetcontent ${overDueWidget && 'active'}`}
					onClick={() => {
						if (overDueWidget) {
							handleRemoveWidgetFilter('overDue', '');
						} else {
							handleFilterChange('overDue', '');
						}
					}}
				>
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{overdue || 0}</div>
						<div className="taskWidgettext">Overdue</div>
					</div>
					<div className="taskWidgeticon">
						<Warn />
					</div>
				</div>
				<div
					className={`taskWidgetcontent ${pendingWidget && 'active'}`}
					onClick={() => {
						if (pendingWidget) {
							handleRemoveWidgetFilter('status', '');
						} else {
							handleWidgetStatusFilter('pending');
						}
					}}
				>
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{allPending || 0}</div>
						<div className="taskWidgettext">Pending</div>
					</div>
					<div className="taskWidgeticon">
						<Pending />
					</div>
				</div>
				<div
					className={`taskWidgetcontent ${completedWidget && 'active'}`}
					onClick={() => {
						if (completedWidget) {
							handleRemoveWidgetFilter('status', '');
						} else {
							handleWidgetStatusFilter('completed');
						}
					}}
				>
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{completed || 0}</div>
						<div className="taskWidgettext">Completed</div>
					</div>
					<div className="taskWidgeticon">
						<Check />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Taskwidget);
