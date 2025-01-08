import React, { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
import { ReactComponent as FilterLinesSvg } from '../../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as ArrowUpAndDown } from '../../../../assets/svg/tasks/arrowUpAndDown.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import DropDown from '../../dropDown/tasks/DropDown';
import SortComponent from './SortComponent';
import FilterComponent from './FilterComponent';

const defaultFilterValue = {
	workflow: null,
	status: null,
	priority: null,
	title: '',
	description: '',
	dueDate: null,
	createdAt: null,
	updatedAt: null,
	assignedTo: null,
	assignedBy: null,
	createdBy: null,
	updatedBy: null,
};

const ListViewHeader = ({
	updateListViewInfo,
	properties,
	sort,
	filters,
	searchValue,
	responseMetadata,
	headerTitle,
	addButtonOnClick,
	taskPreferences,
	editingProperty,
	handleEditPropertyChange,
	colors,
}) => {
	const [info, setInfo] = useState({
		searchExpand: false,
	});
	const [pendingFilters, setPendingFilters] = useState([]);

	const handelSortClick = useCallback(
		(value) => {
			const newSort = sort.some((item) => item.sortBy === value)
				? sort
				: [...sort, { sortBy: value, sortType: 1 }];
			updateListViewInfo('sort', newSort);
			updateListViewInfo('page', 1);
		},
		[sort, updateListViewInfo],
	);

	const handelFilterClick = useCallback(
		(value) => {
			if (
				!filters.some((item) => item.key === value) &&
				!pendingFilters.some((item) => item.key === value)
			) {
				setPendingFilters((prev) => [
					...prev,
					{
						key: value,
						value: defaultFilterValue[value],
					},
				]);
			}
		},
		[filters, pendingFilters],
	);

	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeader">
				<div className="listViewHeaderTitle">{headerTitle}</div>
				<div className="listViewHeaderActions">
					<button className="listViewHeaderAddTaskButton" onClick={addButtonOnClick}>
						Create Task
					</button>
					<div
						className="searchContainer"
						style={{
							width: info?.searchExpand ? '140px' : '16px',
						}}
					>
						<div className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}>
							<span
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									cursor: 'pointer',
								}}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										searchExpand: true,
									}))
								}
							>
								<SearchSvg />
							</span>

							<div className="inputAndCloseContainer">
								<input
									className="searchInputTag"
									placeholder="Search"
									value={searchValue}
									onChange={(e) =>
										updateListViewInfo('searchValue', e.target?.value)
									}
								/>
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() => {
										setInfo((prev) => ({
											...prev,
											searchExpand: false,
										}));
										updateListViewInfo('searchValue', '');
									}}
								>
									<CrossIcon style={{ width: '20px', height: '20px' }} />
								</span>
							</div>
						</div>
					</div>
					{
						// <button className="listViewHeaderActionButton">
						// 	<ThunderSvg />
						// </button>
					}
					<DropDown
						title="Sort"
						options={properties.filter(
							(item) => !['childTasks', 'parentTask']?.includes(item.value),
						)}
						onOptionClick={handelSortClick}
						valueSelector="value"
					>
						<button className="listViewHeaderActionButton">
							<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />
						</button>
					</DropDown>
					<DropDown
						title="Filter"
						options={properties.filter(
							(item) => !['childTasks', 'parentTask']?.includes(item.value),
						)}
						onOptionClick={handelFilterClick}
						valueSelector="value"
					>
						<button className="listViewHeaderActionButton">
							<FilterLinesSvg />
						</button>
					</DropDown>
					<OptionsDropDown
						properties={properties}
						updateListViewInfo={updateListViewInfo}
						taskPreferences={taskPreferences}
						editingProperty={editingProperty}
						handleEditPropertyChange={handleEditPropertyChange}
						responseMetadata={responseMetadata}
						colors={colors}
					/>
				</div>
			</div>
			<div className="listViewOptionsContainer">
				{sort.length > 0 ? (
					<SortComponent
						sort={sort}
						options={properties.filter(
							(item) => !['childTasks', 'parentTask']?.includes(item.value),
						)}
						responseMetadata={responseMetadata}
						updateListViewInfo={updateListViewInfo}
						handelSortClick={handelSortClick}
					/>
				) : (
					''
				)}
				{filters.length > 0 || pendingFilters.length > 0 ? (
					<div className="listView-filterContainer">
						{[...filters, ...pendingFilters].map((filter) => {
							const {
								Icon = null,
								name = null,
								props = {},
								type = null,
							} = responseMetadata?.[filter?.key];
							return (
								<FilterComponent
									key={filter?.key}
									Icon={Icon}
									title={name}
									fieldName={filter?.key}
									value={filter?.value}
									updateListViewInfo={updateListViewInfo}
									filters={filters}
									props={props}
									type={type}
									colors={colors}
									isPending={!filters.includes(filter)}
									onConfirm={(key, value) => {
										setPendingFilters((prev) =>
											prev.filter((f) => f.key !== key),
										);
										updateListViewInfo('filters', [...filters, { key, value }]);
									}}
									setPendingFilters={setPendingFilters}
									responseMetadata
								/>
							);
						})}
						<DropDown
							title="Add Filter"
							options={properties?.filter(
								(item) =>
									!filters.some((filter) => filter.key === item.value) &&
									!['childTasks', 'parentTask']?.includes(item.value),
							)}
							onOptionClick={handelFilterClick}
							valueSelector="value"
						>
							<button className="listView-addFilterButton">
								<PlusSvg />
								<span className="listView-addFilterButtonText">Add Filter</span>
							</button>
						</DropDown>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default memo(ListViewHeader);
