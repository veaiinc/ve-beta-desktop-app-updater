import s from '../../../../assets/scss/notes/databaseComponents/databaseHeader.module.scss';
import CustomTextArea from '../../globalComponents/CustomTextArea';
import DatabaseViewTabs from './DatabaseViewTabs';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SettingsIcon } from '../../../../assets/svg/tasks/newSort.svg';
import FilterComponent from './FilterComponent';
import SortComponent from './SortComponent';
import { useState } from 'react';
import TaskHeader from '../../tasks/listView/TaskHeader';

const DatabaseHeader = ({
	databaseId,
	selectedDatabaseView,
	fields,
	pageId,
	block,
	currentDatabaseViews,
	handleTabChange,
	handleCreateDatabaseView,
	handleTabDropdownClick,
	handleSearchChange,
	searchQuery,
	selectedViewId,
}) => {
	const [info, setInfo] = useState({
		filterSortOpen: false,
	});

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, filterSortOpen: !prev.filterSortOpen }));
	};

	return (
		<div className={s.databaseHeader}>
			<div className={s.titleArea}>
				<CustomTextArea
					// value={info?.databaseName}
					defaultValue="Database"
					// onChange={(e) => handleInfoChange({ databaseName: e.target.value })}
					className={s.title}
				/>
			</div>
			<div className={s.viewsArea}>
				{/* <DatabaseViewTabs /> */}
				<TaskHeader
					tabArray={currentDatabaseViews}
					activeTab={selectedViewId}
					handleTabChange={handleTabChange}
					handleAddTab={(viewType) => handleCreateDatabaseView(databaseId, viewType)}
					handleTabDropdownClick={handleTabDropdownClick}
					showEditDuplicate={false}
				/>
				<div className={s.actionButtons}>
					<div className={s.searchInput}>
						<SearchSvg className={s.searchIcon} />
						<input
							type="text"
							placeholder="Search database"
							className={s.notesDatabaseHeaderSearchInput}
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
					</div>
					{/* <button className={s.actionButton}></button> */}
					<button
						className={s.actionButton}
						onClick={() => handleInfoChange({ filterSortOpen: !info.filterSortOpen })}
					>
						<FilterIcon />
					</button>
					<button className={s.actionButton}>
						<SettingsIcon />
					</button>
				</div>
			</div>
			{info.filterSortOpen && (
				<div className={s.filterAndSortArea}>
					<SortComponent
						databaseId={databaseId}
						view={selectedDatabaseView}
						fields={fields}
						pageId={pageId}
						blockId={block?.id}
					/>
					<FilterComponent
						databaseId={databaseId}
						view={selectedDatabaseView}
						fields={fields}
						pageId={pageId}
						blockId={block?.id}
					/>
				</div>
			)}
		</div>
	);
};

export default DatabaseHeader;
