import { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/tasks/taskwidget.scss';
import { ReactComponent as Warn } from '../../../assets/svg/tasks/warn.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/check.svg';
import { ReactComponent as Pending } from '../../../assets/svg/tasks/time.svg';
import { ReactComponent as Calendar } from '../../../assets/svg/tasks/calender.svg';
import { ReactComponent as Calendar1 } from '../../../assets/svg/tasks/Calender1.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SortIcon } from '../../../assets/svg/tasks/newSort.svg';
import { ReactComponent as SortDownIcon } from '../../../assets/svg/tasks/sortDown.svg';
import { ReactComponent as SortUpIcon } from '../../../assets/svg/tasks/sortUp.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/tasks/plus.svg';
import { ReactComponent as CrossIcon } from '../../../assets/svg/tasks/cross.svg';

import Context from '../../../context/context';
import FilterDropdown from '../dropDown/tasks/FilterDropdown';
import CurrentViewOptions from '../dropDown/tasks/CurrentViewOptions';
import SortDropdown from '../dropDown/tasks/SortDropdown';
import { rowTypes } from '../../features/tasks/Tasks';
import TextField from './listView/TextField';

const Taskwidget = ({
	properties,
	responseMetadata,
	viewData,
	updateViewInfo,
	updateTaskInfo,
	searchValue,
	colors,
}) => {
	const {
		tasks: { listTasks },
	} = useContext(Context);
	const [info, setInfo] = useState({
		widgetShown: false,
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

		setInfo((prevInfo) => ({
			...prevInfo,
			filters: newFilters,
		}));

		updateViewInfo(viewData?._id, { filters: newFilters });
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

	const { allTasks, today, completed, overdue, allPending } = listTasks?.analytics || {};

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
						onChange={(e) => updateTaskInfo({ searchValue: e.target?.value })}
					/>
				</div>
				{/* <FilterDropdown
					properties={properties}
					colors={colors}
					responseMetadata={responseMetadata}
				/>
				<CurrentViewOptions /> */}

				<button
					className="filter-icon-btn"
					onClick={() => handleStateChange({ filterShown: !info?.filterShown })}
				>
					<FilterIcon />
				</button>
				{/* <button
					className="filter-icon-btn"
					onClick={() => handleStateChange({ filterShown: !info?.filterShown })}
				>
					<SortIcon />
				</button> */}
				<CurrentViewOptions />
			</div>
			{info?.filterShown && (
				<div className="filter-sort-wrapper">
					<div className="sort-filter-container">
						<div className="sort-filter-header">
							<div className="sort-filter-title">Sort</div>
							<SortDropdown
								properties={properties}
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
								properties={properties}
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
							{info?.filters?.length > 0 ? (
								info?.filters?.map((filter, index) => {
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

			<div className="taskWidgetHeaderContainer">
				<div className="taskHeader">
					<div className="taskWidgetHeaderNumber">{allTasks || 0}</div>
					<div className="taskWidgetHeaderText">All tasks</div>
				</div>
				<div className="taskWidgeticon">
					<ChevronRightThinSvg
						className={`chevron-icon ${info?.widgetShown && 'chevron-icon-rotate'}`}
						onClick={() =>
							setInfo((prevInfo) => ({
								...prevInfo,
								widgetShown: !prevInfo?.widgetShown,
							}))
						}
					/>
				</div>
			</div>
			<div className={`widgets ${info?.widgetShown && 'widget-show'}`}>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{today || 0}</div>
						<div className="taskWidgettext">Due today</div>
					</div>
					<div className="taskWidgeticon">
						<Calendar />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{allPending || 0}</div>
						<div className="taskWidgettext">Pending</div>
					</div>
					<div className="taskWidgeticon">
						<Pending />
					</div>
				</div>
				<div className="taskWidgetcontent">
					<div className="taskWidgetoption">
						<div className="taskWidgetnumber">{overdue || 0}</div>
						<div className="taskWidgettext">Overdue</div>
					</div>
					<div className="taskWidgeticon">
						<Warn />
					</div>
				</div>
				<div className="taskWidgetcontent">
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
