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

import Context from '../../../context/context';
import { Tooltip } from 'antd';
import FilterDropdown from '../dropDown/tasks/FilterDropdown';
import CurrentViewOptions from '../dropDown/tasks/CurrentViewOptions';
import SortDropdown from '../dropDown/tasks/SortDropdown';
import { sortBy } from 'lodash';

const Taskwidget = ({ properties, responseMetadata, viewData, updateViewInfo }) => {
	const {
		tasks: { listTasks },
	} = useContext(Context);
	const [info, setInfo] = useState({
		widgetShown: false,
		filterShown: false,
		sort: null,
	});

	useEffect(() => {
		if (info?.sort?.length) {
			return;
		}
		setInfo((prevInfo) => ({
			...prevInfo,
			sort: viewData?.sort,
		}));
	}, [JSON.stringify(viewData?.sort)]);

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

	const { allTasks, today, completed, overdue, allPending } = listTasks?.analytics || {};
	console.log(viewData);

	return (
		<div className="taskWidgetContainer">
			<div className="taskWidgetHeader taskWidgetHeaderTitle">Tasks</div>
			<div className="taskWidgetHeader filter-container">
				<div className="task-widget-search-container">
					<SearchSvg />
					<input type="text" placeholder="Search" className="task-widget-search-input" />
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
				<button
					className="filter-icon-btn"
					onClick={() => handleStateChange({ filterShown: !info?.filterShown })}
				>
					<SortIcon />
				</button>
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
							<button className="filter-clear-btn" onClick={handleClearAllSort}>
								Clear All
							</button>
						</div>
						<div className="sort-filter-values-container">
							{info?.sort?.length > 0 ? (
								info?.sort?.map((sort) => (
									<button
										className="sort-btn"
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
							<button className="sort-filter-button">
								<PlusIcon />
							</button>
						</div>
						<div className="sort-filter-values-container"></div>
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
						// style={{
						// 	transform: info?.widgetShown ? 'rotate(-90deg)' : 'rotate(90deg)',
						// }}
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
