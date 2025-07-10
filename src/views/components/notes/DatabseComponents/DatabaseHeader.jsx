import s from '../../../../assets/scss/notes/databaseComponents/databaseHeader.module.scss';
import CustomTextArea from '../../globalComponents/CustomTextArea';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SettingsIcon } from '../../../../assets/svg/tasks/newSort.svg';
import FilterComponent from './FilterComponent';
import SortComponent from './SortComponent';
import { memo, useCallback, useState } from 'react';
import TaskHeader from '../../tasks/listView/TaskHeader';
import ViewOptions from '../../dropDown/notes/database/ViewOptions';

const DatabaseHeader = ({
	databaseId,
	selectedDatabaseView,
	fields,
	pageId,
	block,
	currentDatabaseViews,
	handleTabChange,
	handleCreateDatabaseView,
	handleSearchChange,
	searchQuery,
	selectedViewId,
	openAddModal,
	databaseName,
	onDatabaseNameChange,
	handleDeleteDatabaseView,
}) => {
	const [info, setInfo] = useState({
		filterSortOpen: false,
	});

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, filterSortOpen: !prev.filterSortOpen }));
	};

	const handleTabDropdownClick = useCallback(
		(data) => {
			if (data?.value === 'delete' && data?.tabId) {
				handleDeleteDatabaseView(data.tabId);
			}
		},
		[handleDeleteDatabaseView],
	);

	return (
		<div className={s.databaseHeader}>
			<div className={s.titleArea}>
				<CustomTextArea
					value={databaseName}
					onChange={(e) => onDatabaseNameChange(e.target.value)}
					className={s.title}
				/>
			</div>
			<div className={s.viewsArea}>
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
					<ViewOptions
						fields={fields}
						view={selectedDatabaseView}
						databaseId={databaseId}
						blockId={block?.id}
						pageId={pageId}
						handleDeleteDatabaseView={handleDeleteDatabaseView}
						isLastView={currentDatabaseViews?.length === 1}
						databaseName={databaseName}
					>
						<button className={s.actionButton}>
							<SettingsIcon />
						</button>
					</ViewOptions>
					<button className={s.actionButton} onClick={openAddModal}>
						New
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

export default memo(DatabaseHeader);
