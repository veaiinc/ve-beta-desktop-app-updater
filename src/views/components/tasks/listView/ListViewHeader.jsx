import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
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
import TabHeader from './TabHeader';

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
	properties,
	searchValue,
	responseMetadata,
	addButtonOnClick,
	taskPreferences,
	editingProperty,
	handleEditPropertyChange,
	colors,
	createButtonText,
	handleTabChange,
	tabs,
	handleAddTab,
	updateViewInfo,
	updateTaskInfo,
	viewData,
	blockTitle,
	handleTabsReorder,
	showEditViewDropDown,
	closeEditViewDropDown,
	handleDuplicateView,
	handleDeleteView,
	handleTabDropdownClick,
}) => {
	const [info, setInfo] = useState({
		searchExpand: false,
		showFilters: true,
		showSort: true,
	});
	const [pendingFilters, setPendingFilters] = useState([]);
	const searchInputRef = useRef(null);
	const [showDropdown, setShowDropdown] = useState(false);

	useEffect(() => {
		if (info.searchExpand && searchInputRef.current) {
			searchInputRef.current?.focus();
		}
	}, [info.searchExpand]);

	const handelSortClick = useCallback(
		(value) => {
			if (!value) {
				setInfo((prev) => ({
					...prev,
					showSort: !prev.showSort,
				}));
				return;
			}

			setInfo((prev) => ({
				...prev,
				showSort: true,
			}));

			const newSort = viewData?.sort?.some((item) => item.sortBy === value)
				? viewData?.sort
				: [...viewData?.sort, { sortBy: value, sortType: 1 }];

			updateViewInfo(viewData?._id, { sort: newSort, page: 1 });
		},
		[viewData, updateViewInfo],
	);

	const handelFilterClick = useCallback(
		(value) => {
			if (!value) {
				setInfo((prev) => ({
					...prev,
					showFilters: !prev.showFilters,
				}));
				return;
			}

			setInfo((prev) => ({
				...prev,
				showFilters: true,
			}));

			if (
				!viewData?.filters?.some((item) => item.key === value) &&
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
		[viewData, pendingFilters],
	);

	const handleTabClick = useCallback(
		(tab) => {
			if (tab._id === viewData?._id) {
				setShowDropdown((prev) => !prev);
			} else {
				setShowDropdown(false);
				handleTabChange(tab);
			}
		},
		[viewData?._id, handleTabChange],
	);
	// Add click outside handler
	useEffect(() => {
		const handleClickOutside = (event) => {
			const dropdownElement = document.querySelector('.tab-dropdown-content');
			const tabElement = document.querySelector('.tabHeaderButton.active');

			if (dropdownElement && tabElement) {
				// Don't close if clicking inside dropdown
				if (dropdownElement.contains(event.target)) {
					return;
				}
				// Don't close if clicking the active tab
				if (tabElement.contains(event.target)) {
					return;
				}
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const hasFilters = viewData?.filters?.length > 0 || pendingFilters.length > 0;
	const hasSort = viewData?.sort?.length > 0;

	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeaderTitle">{blockTitle || 'Untitled'}</div>
			<div className="listViewHeader">
				<div className="listViewHeaderTabsContainer">
					<TabHeader
						activeTab={viewData?._id}
						onTabChange={handleTabClick}
						tabs={Object.values(tabs || {})}
						onTabsReorder={handleTabsReorder}
						showDropDown={showDropdown}
						handleTabDropdownClick={handleTabDropdownClick}
					/>
					{/* <button className="listViewHeaderTabsAddButton" onClick={handleAddTab}>
						<PlusSvg />
					</button> */}
				</div>

				<div className="listViewHeaderActions">
					<button className="listViewHeaderAddTaskButton" onClick={addButtonOnClick}>
						{createButtonText || 'Add'}
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
								onClick={() => {
									setInfo((prev) => ({
										...prev,
										searchExpand: true,
									}));
								}}
							>
								<SearchSvg />
							</span>

							<div className="inputAndCloseContainer">
								<input
									ref={searchInputRef}
									className="searchInputTag"
									placeholder="Search"
									value={searchValue}
									onChange={(e) =>
										updateTaskInfo({ searchValue: e.target?.value })
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
										updateTaskInfo({ searchValue: '' });
									}}
								>
									<CrossIcon style={{ width: '20px', height: '20px' }} />
								</span>
							</div>
						</div>
						{
							// <button className="listViewHeaderActionButton">
							// 	<ThunderSvg />
							// </button>
						}
					</div>
					{hasSort ? (
						<button
							className="listViewHeaderActionButton"
							onClick={() => handelSortClick()}
						>
							<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />
						</button>
					) : (
						<DropDown
							title="Sort"
							options={properties.filter(
								(item) => !['childTasks', 'parentTask']?.includes(item.value),
							)}
							onOptionClick={handelSortClick}
							valueSelector="value"
						>
							<button
								className="listViewHeaderActionButton"
								onClick={() => handelSortClick()}
							>
								<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />
							</button>
						</DropDown>
					)}

					{hasFilters ? (
						<button
							className="listViewHeaderActionButton"
							onClick={() => handelFilterClick()}
						>
							<FilterLinesSvg />
						</button>
					) : (
						<DropDown
							title="Filter"
							options={properties.filter(
								(item) => !['childTasks', 'parentTask']?.includes(item.value),
							)}
							onOptionClick={handelFilterClick}
							valueSelector="value"
						>
							<button
								className="listViewHeaderActionButton"
								onClick={() => handelFilterClick()}
							>
								<FilterLinesSvg />
							</button>
						</DropDown>
					)}
					<OptionsDropDown
						properties={properties}
						updateTaskInfo={updateTaskInfo}
						taskPreferences={taskPreferences}
						editingProperty={editingProperty}
						handleEditPropertyChange={handleEditPropertyChange}
						responseMetadata={responseMetadata}
						colors={colors}
						viewData={viewData}
						updateViewInfo={(viewInfo) => updateViewInfo(viewData?._id, viewInfo)}
						openDropDown={showEditViewDropDown}
						closeDropDown={closeEditViewDropDown}
						handleDuplicateView={handleDuplicateView}
						handleDeleteView={handleDeleteView}
					/>
				</div>
			</div>

			<div className="listViewOptionsContainer">
				{viewData?.sort?.length > 0 && info.showSort ? (
					<SortComponent
						sort={viewData?.sort}
						options={properties.filter(
							(item) => !['childTasks', 'parentTask']?.includes(item.value),
						)}
						responseMetadata={responseMetadata}
						updateViewInfo={(viewInfo) => updateViewInfo(viewData?._id, viewInfo)}
						handelSortClick={handelSortClick}
						properties={properties.filter(
							(item) => !['childTasks', 'parentTask']?.includes(item.value),
						)}
					/>
				) : null}
				{(viewData?.filters?.length > 0 || pendingFilters.length > 0) &&
				info.showFilters ? (
					<div className="listView-filterContainer">
						{[...viewData?.filters, ...pendingFilters].map((filter) => {
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
									updateViewInfo={(viewInfo) =>
										updateViewInfo(viewData?._id, viewInfo)
									}
									filters={viewData?.filters}
									props={props}
									type={type}
									colors={colors}
									isPending={
										!viewData?.filters?.some((f) => f.key === filter?.key)
									}
									onConfirm={(key, value) => {
										setPendingFilters((prev) =>
											prev.filter((f) => f.key !== key),
										);
										updateViewInfo(viewData?._id, {
											filters: [...viewData?.filters, { key, value }],
										});
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
									!viewData?.filters?.some(
										(filter) => filter.key === item.value,
									) && !['childTasks', 'parentTask']?.includes(item.value),
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
