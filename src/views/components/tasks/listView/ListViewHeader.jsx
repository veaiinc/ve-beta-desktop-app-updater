import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
// import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
// import { ReactComponent as ThunderSvg } from '../../../../assets/svg/tasks/thunder.svg';
import { ReactComponent as FilterLinesSvg } from '../../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as ArrowUpAndDown } from '../../../../assets/svg/tasks/arrowUpAndDown.svg';
import { Tooltip } from 'antd';
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import DropDown from '../../dropDown/tasks/DropDown';
import SortComponent from './SortComponent';
import FilterComponent from './FilterComponent';

const defaultFilterValue = {
	workflow: null,
	status: 'todo',
	priority: 'low',
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
	togglePropertyVisibility,
	sort,
	filters,
	responseTypes,
	workflows,
	tenantUsers,
}) => {
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
			const newFilters = filters.some((item) => item.key === value)
				? filters
				: [...filters, { key: value, value: defaultFilterValue[value] }];
			updateListViewInfo('filters', newFilters);
		},
		[filters, updateListViewInfo],
	);

	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeader">
				<div className="listViewHeaderTitle">Tasks</div>
				<div className="listViewHeaderActions">
					<button
						className="listViewHeaderActionButton"
						onClick={() => {
							updateListViewInfo('isCreatingSubtask', false);
							updateListViewInfo('isCreateModalOpen', true);
						}}
					>
						<PlusSvg style={{ width: '20px', height: '20px' }} />
					</button>
					{
						// 	<button className="listViewHeaderActionButton">
						// 	<SearchSvg />
						// </button>
						// <button className="listViewHeaderActionButton">
						// 	<ThunderSvg />
						// </button>
					}
					<DropDown
						title="Sort"
						options={properties}
						onOptionClick={handelSortClick}
						valueSelector="value"
					>
						<button className="listViewHeaderActionButton">
							<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />
						</button>
					</DropDown>
					<DropDown
						title="Filter"
						options={properties}
						onOptionClick={handelFilterClick}
						valueSelector="value"
					>
						<button className="listViewHeaderActionButton">
							<FilterLinesSvg />
						</button>
					</DropDown>
					<Tooltip
						placement="bottom"
						title={
							<OptionsDropDown
								properties={properties}
								togglePropertyVisibility={togglePropertyVisibility}
							/>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content' }}
					>
						<button className="btn-options">
							<HorizontalMoreIcon style={{ width: '20px', height: '20px' }} />
						</button>
					</Tooltip>
				</div>
			</div>
			<div className="listViewOptionsContainer">
				{sort.length > 0 ? (
					<SortComponent
						sort={sort}
						properties={properties}
						responseTypes={responseTypes}
						updateListViewInfo={updateListViewInfo}
						handelSortClick={handelSortClick}
					/>
				) : (
					''
				)}
				{filters.length > 0 ? (
					<div className="listView-filterContainer">
						{filters.map((filter) => (
							<FilterComponent
								key={filter?.key}
								Icon={responseTypes[filter?.key]?.Icon}
								title={responseTypes[filter?.key]?.name}
								fieldName={filter?.key}
								value={filter?.value}
								updateListViewInfo={updateListViewInfo}
								filters={filters}
								workflows={workflows}
								tenantUsers={tenantUsers}
								type={responseTypes[filter?.key]?.type}
							/>
						))}
						<DropDown
							title="Add Filter"
							options={properties?.filter(
								(item) => !filters.some((filter) => filter.key === item.value),
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
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default memo(ListViewHeader);
