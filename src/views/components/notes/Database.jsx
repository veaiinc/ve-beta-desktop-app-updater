import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import moment from 'moment';
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import s from '../../../assets/scss/notes/database.module.scss';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import Context from '../../../context/context';
import { NotesRefContext } from '../../features/notesModule/NotesEditor';
import CustomTextArea from '../globalComponents/CustomTextArea';
import DatabaseAddFieldModal from '../modalsV2/notes/DatabaseAddFieldModal';
import DatabaseAddModal from '../modalsV2/notes/DatabaseAddModal';
import CheckBox from '../tasks/listView/CheckBox';
import ChildTaskProgress from '../tasks/listView/ChildTaskProgress';
import CreatedWithAi from '../tasks/listView/CreatedWithAi';
import DateView from '../tasks/listView/DateView';
import Email from '../tasks/listView/Email';
import LinkText from '../tasks/listView/LinkText';
import MultiSelect from '../tasks/listView/MultiSelect';
import ParentTaskComponent from '../tasks/listView/ParentTaskComponent';
import Person from '../tasks/listView/Person';
import PersonMultiSelect from '../tasks/listView/PersonMultiSelect';
import Phone from '../tasks/listView/Phone';
import Priority from '../tasks/listView/Priority';
import Select from '../tasks/listView/Select';
import Status from '../tasks/listView/Status';
import TaskHeader from '../tasks/listView/TaskHeader';
import TaskId from '../tasks/listView/TaskId';
import TextField from '../tasks/listView/TextField';
import Url from '../tasks/listView/Url';
import CalendarPicker from './DatabseComponents/CalendarPicker';
import CheckBoxFilter from './DatabseComponents/CheckBoxFilter';
import DateComponent from './DatabseComponents/DateComponent';
import FilterComponent from './DatabseComponents/FilterComponent';
import StatusFilter from './DatabseComponents/StatusFilter';
import TableView from './DatabseComponents/views/TableView';
import DateFilterComponent from './DatabseComponents/DateFilterComponent';
import NumberComponent from './DatabseComponents/NumberComponent';

export const rowTypes = {
	text: TextField,
	select: Select,
	person: Person,
	multi_select: MultiSelect,
	date: DateComponent,
	serial_number: TaskId,
	status: Status,
	priority: Priority,
	email: Email,
	phone: Phone,
	url: Url,
	checkbox: CheckBox,
	parentTask: ParentTaskComponent,
	childTasks: ChildTaskProgress,
	linkText: LinkText,
	personMultiSelect: PersonMultiSelect,
	createdWithAi: CreatedWithAi,
	last_edited_time: DateComponent,
	created_time: DateComponent,
	last_edited_by: Person,
	created_by: Person,
	url: LinkText,
	email: LinkText,
	phone: LinkText,
	number: NumberComponent,
	statusFilter: StatusFilter,
	checkboxFilter: CheckBoxFilter,
	dateFilter: DateFilterComponent,
};

const DatabaseComponent = memo(({ block, editor }) => {
	const {
		notes: {
			createDatabase,
			database,
			createDatabaseView,
			getDatabase,
			getDatabaseRows,
			rowData,
			updateDatabase,
			listAvailableDatabases,
			availableDatabases,
			views,
			getDatabaseViews,
			deleteDatabaseView,
		},
	} = useContext(Context);

	const { previousBlocksRef, pageId } = useContext(NotesRefContext);
	const timeoutRef = useRef(null);
	const isInitialMount = useRef(true);
	const lastFetchParams = useRef(null);

	const { databaseId } = block?.props;
	const sourceBlockId = previousBlocksRef?.current?.get(block?.id)?._id;

	const [info, setInfo] = useState({
		addRowModalOpen: false,
		addFieldModalOpen: false,
		databaseName: 'Database',
		newDatabase: null,
		selectedDatabaseId: false,
		databaseListLoading: false,
		selectedViewId: null,
	});

	const currentDatabase = useMemo(() => database?.[databaseId], [database, databaseId]);
	const currentDatabaseViews = useMemo(() => views?.[block?.id], [views, block?.id]);

	const currentDatabaseRows = useMemo(
		() => rowData?.[info?.selectedViewId],
		[rowData, info?.selectedViewId],
	);

	const selectedDatabaseView = useMemo(() => {
		if (!currentDatabaseViews?.length) return null;

		// If no selectedViewId, return first view
		if (!info?.selectedViewId) {
			return currentDatabaseViews[0];
		}

		// Find the selected view
		return (
			currentDatabaseViews.find((view) => view?._id === info?.selectedViewId) ||
			currentDatabaseViews[0]
		);
	}, [currentDatabaseViews, info?.selectedViewId]);

	// Optimized fetch function with duplicate call prevention
	const fetchDatabaseRows = useCallback(
		(viewId, filters = null) => {
			if (!databaseId || !pageId || !viewId) return;

			// Create a unique key for this fetch request
			const fetchKey = JSON.stringify({
				databaseId,
				pageId,
				viewId,
				filters: filters || selectedDatabaseView?.filterBy,
			});

			// Prevent duplicate calls
			if (lastFetchParams.current === fetchKey) {
				return;
			}

			lastFetchParams.current = fetchKey;

			getDatabaseRows(
				{
					pageId,
					databaseId,
					databaseViewId: viewId,
					input: {
						page: 1,
						limit: 50,
					},
				},
				viewId,
			);
		},
		[databaseId, pageId, getDatabaseRows, selectedDatabaseView?.filterBy],
	);

	// Initialize view selection effect
	useEffect(() => {
		if (!currentDatabaseViews?.length || info?.selectedViewId) return;

		const firstView = currentDatabaseViews[0];
		if (firstView?._id) {
			setInfo((prev) => ({
				...prev,
				selectedViewId: firstView._id,
			}));
		}
	}, [currentDatabaseViews, info?.selectedViewId]);

	// Fetch rows when view or filters change
	useEffect(() => {
		if (!info?.selectedViewId || !selectedDatabaseView) return;

		// Skip initial mount to prevent immediate fetch
		if (isInitialMount.current) {
			isInitialMount.current = false;
			// But still fetch data on initial mount if we don't have any
			if (!currentDatabaseRows?.data) {
				fetchDatabaseRows(info.selectedViewId);
			}
			return;
		}

		// Always fetch when filters change or when we don't have data
		fetchDatabaseRows(info.selectedViewId);
	}, [
		info?.selectedViewId,
		selectedDatabaseView?.filterBy,
		fetchDatabaseRows,
		currentDatabaseRows?.data,
	]);

	// Handle database import list loading
	useEffect(() => {
		if (info?.newDatabase === false && !info?.databaseListLoading) {
			setInfo((prev) => ({ ...prev, databaseListLoading: true }));
			getAllAvailableDatabases();
		}
	}, [info?.newDatabase]);

	// Load database data
	useEffect(() => {
		if (!pageId || !databaseId) return;

		if (!currentDatabase) {
			getDatabase({ pageId, databaseId });
		} else if (
			currentDatabase?.databaseMetadata?.name &&
			info?.databaseName === 'Database' // Only update if it's the default name
		) {
			setInfo((prev) => ({
				...prev,
				databaseName: currentDatabase.databaseMetadata.name,
			}));
		}
	}, [databaseId, currentDatabase, pageId, getDatabase]);

	// Load database views
	useEffect(() => {
		if (databaseId && sourceBlockId && !currentDatabaseViews) {
			getDatabaseViews({ pageId, blockId: sourceBlockId }, block?.id);
		}
	}, [databaseId, sourceBlockId, currentDatabaseViews, getDatabaseViews, pageId, block?.id]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const initializeDatabase = useCallback(
		async (selectedDatabaseId = null) => {
			try {
				let databaseResult = null;

				if (selectedDatabaseId) {
					databaseResult = await getDatabase({ pageId, databaseId: selectedDatabaseId });
				} else {
					databaseResult = await createDatabase({
						pageId,
						input: {
							name: 'Database',
							fields: [
								{
									name: 'Name',
									type: 'text',
								},
							],
							sourceBlockId,
						},
					});
				}

				if (databaseResult) {
					const databaseView = await handleCreateDatabaseView(databaseResult._id);

					if (databaseView) {
						editor.updateBlock(block?.id, {
							props: {
								databaseId: databaseResult._id,
							},
						});
					}
				}
			} catch (error) {
				console.error('Error initializing database:', error);
			}
		},
		[pageId, sourceBlockId, getDatabase, createDatabase, editor, block?.id],
	);

	const handleCreateDatabaseView = useCallback(
		async (targetDatabaseId) => {
			try {
				const order = (currentDatabaseViews?.length ?? 0) + 1;
				const databaseView = await createDatabaseView(
					{
						pageId,
						input: {
							blockId: sourceBlockId,
							databaseId: targetDatabaseId,
							label: 'Table',
							type: 'table',
							order,
						},
					},
					block?.id,
				);

				return databaseView;
			} catch (error) {
				console.error('Error creating database view:', error);
				return null;
			}
		},
		[currentDatabaseViews?.length, pageId, sourceBlockId, createDatabaseView, block?.id],
	);

	const handleDebouncedDatabaseNameUpdate = useCallback(
		(newName) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				const trimmedName = newName?.trim();
				if (!trimmedName || trimmedName === currentDatabase?.databaseMetadata?.name) {
					return;
				}

				if (databaseId && pageId) {
					updateDatabase({
						pageId,
						updateDatabaseId: databaseId,
						input: {
							name: trimmedName,
						},
					});
				}
			}, 800);
		},
		[databaseId, pageId, currentDatabase?.databaseMetadata?.name, updateDatabase],
	);

	const handleInfoChange = useCallback(
		(data = {}) => {
			setInfo((prev) => {
				const newState = { ...prev, ...data };

				// If databaseName is being updated, trigger the debounced update
				if (data.databaseName !== undefined) {
					handleDebouncedDatabaseNameUpdate(data.databaseName);
				}

				// Handle view change and fetch rows if needed
				if (data.selectedViewId && data.selectedViewId !== prev.selectedViewId) {
					// Reset fetch params when view changes
					lastFetchParams.current = null;
				}

				return newState;
			});
		},
		[handleDebouncedDatabaseNameUpdate],
	);

	const getAllAvailableDatabases = useCallback(async () => {
		try {
			await listAvailableDatabases({ pageId });
		} catch (error) {
			console.error('Error fetching available databases:', error);
		} finally {
			setInfo((prev) => ({ ...prev, databaseListLoading: false }));
		}
	}, [pageId, listAvailableDatabases]);

	const handleDeleteDatabaseView = useCallback(
		async (viewId) => {
			if (!currentDatabaseViews?.length) return;

			try {
				const deletedViewIndex = currentDatabaseViews.findIndex(
					(view) => view?._id === viewId,
				);

				if (deletedViewIndex === -1) return;

				// Determine new selected view
				let newSelectedViewId = null;
				if (currentDatabaseViews.length > 1) {
					if (deletedViewIndex === 0) {
						newSelectedViewId = currentDatabaseViews[1]?._id;
					} else {
						newSelectedViewId = currentDatabaseViews[deletedViewIndex - 1]?._id;
					}
				}

				await deleteDatabaseView({ pageId, deleteDatabaseViewId: viewId }, block?.id);

				if (newSelectedViewId) {
					handleInfoChange({ selectedViewId: newSelectedViewId });
				}
			} catch (error) {
				console.error('Error deleting database view:', error);
			}
		},
		[pageId, deleteDatabaseView, block?.id, currentDatabaseViews, handleInfoChange],
	);

	const handleTabDropdownClick = useCallback(
		(data) => {
			if (data?.value === 'delete' && data?.tabId) {
				handleDeleteDatabaseView(data.tabId);
			}
		},
		[handleDeleteDatabaseView],
	);

	// Memoized derived values
	const fields = useMemo(
		() => currentDatabase?.databaseMetadata?.fields || [],
		[currentDatabase],
	);
	const rows = useMemo(() => currentDatabaseRows?.data || [], [currentDatabaseRows]);
	const columns = useMemo(
		() =>
			fields.map((field) => ({
				...field,
				width: 180,
			})),
		[fields],
	);
	const allDatabases = useMemo(() => availableDatabases || [], [availableDatabases]);

	return (
		<div className={s.notesDatabaseContainer}>
			{!databaseId ? (
				<div className={s.notesDatabaseInitial}>
					{info?.newDatabase === null && (
						<div className={s.intialBtnContainer}>
							<button onClick={() => initializeDatabase()}>Create Database</button>
							<button onClick={() => handleInfoChange({ newDatabase: false })}>
								Import Database
							</button>
						</div>
					)}
					{info?.newDatabase === false && (
						<div className={s.showDatabaseContainer}>
							<div className={s.showDatabaseContainerHeader}>
								<div className={s.showDatabaseContainerHeaderTitle}>
									Select Database
								</div>
							</div>
							<div className={s.showDatabaseContainerBody}>
								{info?.databaseListLoading ? (
									<div>Loading databases...</div>
								) : (
									allDatabases.map((database) => (
										<div
											className={s.showDatabaseContainerBodyItem}
											key={database?._id}
											onClick={() => initializeDatabase(database?._id)}
										>
											{database?.name}
										</div>
									))
								)}
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<div className={s.notesDatabaseHeader}>
						<div className={s.databaseTopContainer}>
							<TaskHeader
								tabArray={currentDatabaseViews}
								activeTab={info?.selectedViewId}
								handleTabChange={(view) =>
									handleInfoChange({ selectedViewId: view?._id })
								}
								handleAddTab={() => handleCreateDatabaseView(databaseId)}
								handleTabDropdownClick={handleTabDropdownClick}
							/>
							<div className={s.notesDatabaseHeaderButtons}>
								{/* <button >
									Filter button goes here
								</button> */}
								<button onClick={() => handleInfoChange({ addRowModalOpen: true })}>
									Add Row
								</button>
								<button
									onClick={() => handleInfoChange({ addFieldModalOpen: true })}
								>
									Add Field
								</button>
							</div>
						</div>
						<div className={s.notesDatabaseHeaderTitleContainer}>
							<CustomTextArea
								value={info?.databaseName}
								onChange={(e) => handleInfoChange({ databaseName: e.target.value })}
								className={s.notesDatabaseHeaderTitle}
							/>
						</div>
						<FilterComponent
							databaseId={databaseId}
							view={selectedDatabaseView}
							fields={fields}
							pageId={pageId}
							blockId={block?.id}
						/>
					</div>
					<TableView
						data={rows}
						columns={columns}
						databaseId={databaseId}
						pageId={pageId}
						viewId={info?.selectedViewId}
					/>
					{currentDatabaseRows?.hasNextPage && (
						<button className={s.loadMoreButton} onClick={() => {}}>
							Load More
						</button>
					)}

					<DatabaseAddModal
						isOpen={info?.addRowModalOpen}
						onClose={() => handleInfoChange({ addRowModalOpen: false })}
						viewId={info?.selectedViewId}
						pageId={pageId}
						databaseId={databaseId}
						fields={fields}
					/>
					<DatabaseAddFieldModal
						isOpen={info?.addFieldModalOpen}
						onClose={() => handleInfoChange({ addFieldModalOpen: false })}
						databaseId={databaseId}
						pageId={pageId}
					/>
				</>
			)}
		</div>
	);
});

export default DatabaseComponent;

export const Database = createReactBlockSpec(
	{
		type: 'database',
		propSchema: {
			textAlignment: defaultProps.textAlignment,
			textColor: defaultProps.textColor,
			backgroundColor: defaultProps.backgroundColor,
			databaseId: {
				default: null,
			},
			databaseViewId: {
				default: null,
			},
		},
		content: 'none',
		isSelectable: false,
	},
	{
		render: DatabaseComponent,
	},
);

export const insertDatabase = (editor, pageId) => ({
	title: 'Database',
	subtext: 'Database for storing your data',
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: 'database',
		});
	},
	aliases: ['database', 'table', 'data', 'store'],
	group: 'Advanced',
	icon: <TableViewIcon />,
});
