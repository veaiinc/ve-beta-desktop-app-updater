import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import { ReactComponent as FilterLinesSvg } from '../../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as ArrowUpAndDown } from '../../../../assets/svg/tasks/arrowUpAndDown.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import DropDown from '../../dropDown/tasks/DropDown';
import SortComponent from './SortComponent';
import FilterComponent from './FilterComponent';
import TabHeader from './TabHeader';
import SearchSvg from '../../../../assets/svg/activity/SearchSvg';
import CrossSvg from '../../../../assets/svg/docs/CrossSvg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SortIcon } from '../../../../assets/svg/tasks/newSort.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/my_templates/plus.svg';

const defaultFilterValue = {
	text: '',
	linkText: '',
};

const suggestedOptions = [
	{
		id: 0,
		title: 'Create new Task',
		value: 'task',
		controlValue: 'task',
		action: () => {
			// This will be handled by the parent component
		},
	},
];

const ListViewHeader = ({
	properties,
	responseMetadata,
	taskPreferences,
	editingProperty,
	handleEditPropertyChange,
	colors,
	handleTabChange,
	tabs,
	prefix,
	updateViewInfo,
	updateTaskInfo,
	viewData,
	handleTabsReorder,
	showEditViewDropDown,
	closeEditViewDropDown,
	handleDuplicateView,
	handleDeleteView,
	handleTabDropdownClick,
	layoutOptions,
	handleLayoutOptionClick,
}) => {
	const [info, setInfo] = useState({
		searchExpand: false,
		showFilters: true,
	});
	const [pendingFilters, setPendingFilters] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);

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
						value: null,
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

	const hasFilters = viewData?.filters?.length > 0 || pendingFilters?.length > 0;
	const hasSort = viewData?.sort?.length > 0;

	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeaderTitleWrapper">
				{/* <div className="listViewHeader-title">{blockTitle || 'Untitled'}</div> */}
				<div className="listViewHeader">
					<div className="listViewHeaderTabsContainer">
						<TabHeader
							activeTab={viewData?._id}
							onTabChange={handleTabClick}
							tabs={Object.values(tabs || {})}
							onTabsReorder={handleTabsReorder}
							showDropDown={showDropdown}
							handleTabDropdownClick={handleTabDropdownClick}
							layoutOptions={layoutOptions}
							handleLayoutOptionClick={handleLayoutOptionClick}
						/>
					</div>

					<div className="listViewHeaderActions">
						{hasFilters ? (
							<div
								className="listViewHeaderActionButton"
								onClick={() => handelFilterClick()}
							>
								<FilterIcon />
							</div>
						) : (
							<DropDown
								title="Filter"
								options={properties.filter(
									(item) => !['childTasks', 'parentTask']?.includes(item.value),
								)}
								onOptionClick={handelFilterClick}
								valueSelector="value"
							>
								<div
									className="listViewHeaderActionButton"
									onClick={() => handelFilterClick()}
									style={{ color: 'var(--primary-color)' }}
								>
									<FilterIcon />
								</div>
							</DropDown>
						)}
						<OptionsDropDown
							properties={properties}
							prefix={prefix}
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
							layoutOptions={layoutOptions}
							tabLength={Object.values(tabs || {}).length}
						/>
						<span className="list-separator"></span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ListViewHeader);
