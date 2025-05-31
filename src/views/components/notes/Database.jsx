import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import ObjectID from 'bson-objectid';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import s from '../../../assets/scss/notes/database.module.scss';
import { memo, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { NotesRefContext } from '../../features/notesModule/NotesEditor';
import DatabaseAddModal from '../modalsV2/notes/DatabaseAddModal';
import DatabaseAddFieldModal from '../modalsV2/notes/DatabaseAddFieldModal';
import { Tooltip } from 'antd';
import HeaderEditDropdown from '../dropDown/notes/database/HeaderEditDropdown';
import DatabaseSidebar from '../modalsV2/notes/DatabaseSidebar';
import TableView from './DatabseComponents/views/TableView';
import TextField from '../tasks/listView/TextField';
import Select from '../tasks/listView/Select';
import Person from '../tasks/listView/Person';
import MultiSelect from '../tasks/listView/MultiSelect';
import DateView from '../tasks/listView/DateView';
import TaskId from '../tasks/listView/TaskId';
import Status from '../tasks/listView/Status';
import Priority from '../tasks/listView/Priority';
import Email from '../tasks/listView/Email';
import Phone from '../tasks/listView/Phone';
import Url from '../tasks/listView/Url';
import CheckBox from '../tasks/listView/CheckBox';
import ParentTaskComponent from '../tasks/listView/ParentTaskComponent';
import ChildTaskProgress from '../tasks/listView/ChildTaskProgress';
import LinkText from '../tasks/listView/LinkText';
import PersonMultiSelect from '../tasks/listView/PersonMultiSelect';
import CreatedWithAi from '../tasks/listView/CreatedWithAi';
import CustomTextArea from '../globalComponents/CustomTextArea';

export const rowTypes = {
	text: TextField,
	select: Select,
	person: Person,
	multi_select: MultiSelect,
	date: DateView,
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
	last_edited_time: DateView,
	created_time: DateView,
	last_edited_by: Person,
	created_by: Person,
	url: LinkText,
	email: LinkText,
	phone: LinkText,
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
			updateDatabaseSidebar,
			updateDatabase,
			listAvailableDatabases,
			availableDatabases,
			views,
			getDatabaseViews,
		},
	} = useContext(Context);

	const { previousBlocksRef, pageId } = useContext(NotesRefContext);
	const timeoutRef = useRef(null);

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
	const currentDatabaseRows = useMemo(
		() => rowData?.[info?.selectedViewId],
		[rowData, info?.selectedViewId],
	);
	const currentDatabaseViews = useMemo(() => views?.[block?.id], [views, block?.id]);

	const selectedDatabaseView = useMemo(() => {
		return currentDatabaseViews?.find((view) => view?._id === info?.selectedViewId);
	}, [currentDatabaseViews, info?.selectedViewId]);

	useEffect(() => {
		if (currentDatabaseViews?.length > 0 && !info?.selectedViewId) {
			const firstViewId = currentDatabaseViews[0]?._id;

			// Set the view and fetch data in one go
			setInfo((prev) => ({
				...prev,
				selectedViewId: firstViewId,
			}));

			// Fetch data immediately with the first view ID
			if (databaseId && pageId) {
				getDatabaseRows(
					{
						pageId,
						input: {
							page: 1,
							limit: 50,
							databaseId: databaseId,
						},
					},
					firstViewId,
				);
			}
		}
	}, [currentDatabaseViews, databaseId, pageId, getDatabaseRows]);

	useEffect(() => {
		if (info?.newDatabase === false) {
			setInfo({
				...info,
				databaseListLoading: true,
			});

			getAllAvailableDatabases();
		}
	}, [info?.newDatabase]);

	useEffect(() => {
		if (pageId && databaseId && !currentDatabase) {
			getDatabase({ pageId, databaseId });
		} else {
			setInfo({
				...info,
				databaseName: currentDatabase?.databaseMetadata?.name || 'Database',
			});
		}
	}, [databaseId, currentDatabase, pageId]);

	useEffect(() => {
		// Only fetch when selectedViewId changes and we have all required data
		const hasRequiredData = info?.selectedViewId && databaseId && pageId;

		if (hasRequiredData) {
			// Only fetch if we don't have data for this specific view
			const viewData = currentDatabaseRows?.data;
			if (!viewData) {
				getDatabaseRows(
					{
						pageId,
						input: {
							page: 1,
							limit: 50,
							databaseId: databaseId,
						},
					},
					info?.selectedViewId,
				);
			}
		}
	}, [info?.selectedViewId, pageId, databaseId, getDatabaseRows, currentDatabaseRows]);

	useEffect(() => {
		if (databaseId && !currentDatabaseViews) {
			getDatabaseViews({ pageId, blockId: sourceBlockId }, block?.id);
		}
	}, [databaseId, currentDatabaseViews]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const initializeDatabase = async (databaseId = null) => {
		let database = null;

		if (databaseId) {
			database = await getDatabase({ pageId, databaseId });
		} else {
			database = await createDatabase({
				pageId: pageId,
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

		let databaseView = null;

		if (database) {
			databaseView = await handleCreateDatabaseView(database?._id);
		}

		if (databaseView) {
			editor.updateBlock(block?.id, {
				props: {
					databaseId: database?._id,
				},
			});
		}
	};

	const handleCreateDatabaseView = async (databaseId) => {
		const order = (currentDatabaseViews?.length ?? 0) + 1;
		const databaseView = await createDatabaseView(
			{
				pageId: pageId,
				input: {
					blockId: sourceBlockId,
					databaseId,
					title: 'Table',
					type: 'table',
					order,
				},
			},
			block?.id,
		);

		return databaseView;
	};

	const handleDebouncedDatabaseNameUpdate = useCallback(
		(newName) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				// Don't make API call if the name is empty or unchanged
				if (!newName?.trim() || newName === currentDatabase?.databaseMetadata?.name) {
					return;
				}

				if (databaseId) {
					updateDatabase({
						pageId,
						updateDatabaseId: databaseId,
						input: {
							name: newName,
						},
					});
				}
			}, 800);
		},
		[databaseId, pageId, currentDatabase?.databaseMetadata?.name, updateDatabase],
	);

	const handleInfoChange = useCallback(
		(data = {}) => {
			setInfo((prev) => ({ ...prev, ...data }));
			if (data.databaseName !== undefined) {
				handleDebouncedDatabaseNameUpdate(data.databaseName);
			}
		},
		[handleDebouncedDatabaseNameUpdate],
	);

	const getAllAvailableDatabases = useCallback(async () => {
		await listAvailableDatabases({ pageId });
		setInfo((prev) => ({ ...prev, databaseListLoading: false }));
	}, [pageId, info?.databaseListLoading, listAvailableDatabases]);

	const fields = currentDatabase?.databaseMetadata?.fields || [];
	const rows = currentDatabaseRows?.data || [];

	const columns = useMemo(() => {
		return fields.map((field) => ({
			...field,
			width: 180,
		}));
	}, [fields]);

	const allDatabases = useMemo(() => {
		return availableDatabases || [];
	}, [availableDatabases]);

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
								{allDatabases?.map((database) => (
									<div
										className={s.showDatabaseContainerBodyItem}
										key={database?._id}
										onClick={() => initializeDatabase(database?._id)}
									>
										{database?.name}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<div className={s.notesDatabaseHeader}>
						<div className={s.databaseTopContainer}>
							<div className={s.viewsContainer}>
								{currentDatabaseViews?.map((view) => (
									<div
										key={view._id}
										className={`${s.viewWrapper} ${
											info?.selectedViewId === view?._id ? s.active : ''
										}`}
										onClick={() =>
											handleInfoChange({ selectedViewId: view?._id })
										}
									>
										<div className={s.viewIcon}>{/* <TableViewIcon /> */}</div>
										<div className={s.viewLabel}>{view?.title}</div>
									</div>
								))}
								<button onClick={() => handleCreateDatabaseView(databaseId)}>
									+
								</button>
							</div>
							<div className={s.notesDatabaseHeaderButtons}>
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
					</div>
					<TableView
						data={rows}
						columns={columns}
						databaseId={databaseId}
						pageId={pageId}
						viewId={info?.selectedViewId}
					/>
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

					{/* <DatabaseSidebar
						databaseId={databaseId}
						pageId={pageId}
						databaseName={info?.databaseName}
						fields={fields}
					/> */}
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
