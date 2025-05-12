import { memo, useCallback, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import TabHeader from './TabHeader';

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
	// const [showDropdown, setShowDropdown] = useState(false);

	// const handleTabClick = useCallback(
	// 	(tab) => {
	// 		if (tab._id === viewData?._id) {
	// 			setShowDropdown((prev) => !prev);
	// 		} else {
	// 			setShowDropdown(false);
	// 			handleTabChange(tab);
	// 		}
	// 	},
	// 	[viewData?._id, handleTabChange],
	// );
	// // Add click outside handler
	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		const dropdownElement = document.querySelector('.tab-dropdown-content');
	// 		const tabElement = document.querySelector('.tabHeaderButton.active');

	// 		if (dropdownElement && tabElement) {
	// 			// Don't close if clicking inside dropdown
	// 			if (dropdownElement.contains(event.target)) {
	// 				return;
	// 			}
	// 			// Don't close if clicking the active tab
	// 			if (tabElement.contains(event.target)) {
	// 				return;
	// 			}
	// 			setShowDropdown(false);
	// 		}
	// 	};

	// 	document.addEventListener('mousedown', handleClickOutside);
	// 	return () => document.removeEventListener('mousedown', handleClickOutside);
	// }, []);

	return (
		<div className="listViewHeaderContainer">
			{/* <div className="listViewHeaderTitleWrapper">
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
			</div> */}
		</div>
	);
};

export default memo(ListViewHeader);
