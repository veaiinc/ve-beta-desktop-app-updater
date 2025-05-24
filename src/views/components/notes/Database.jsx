import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import ObjectID from 'bson-objectid';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import s from '../../../assets/scss/notes/database.module.scss';
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { NotesRefContext } from '../../features/notesModule/NotesEditor';
import DatabaseAddModal from '../modalsV2/notes/DatabaseAddModal';
import DatabaseAddFieldModal from '../modalsV2/notes/DatabaseAddFieldModal';

const DatabaseComponent = memo(({ block, editor }) => {
	const {
		notes: {
			createDatabase,
			database,
			createDatabaseView,
			getDatabase,
			getDatabaseRows,
			rowData,
		},
	} = useContext(Context);

	const { previousBlocksRef, pageId } = useContext(NotesRefContext);

	const { databaseId, databaseViewId } = block?.props;
	const sourceBlockId = previousBlocksRef?.current?.get(block?.id)?._id;

	const currentDatabase = useMemo(() => database?.[databaseId], [database, databaseId]);
	const currentDatabaseRows = useMemo(() => rowData?.[block?.id], [rowData, block?.id]);

	const [info, setInfo] = useState({
		addRowModalOpen: false,
		addFieldModalOpen: false,
	});

	useEffect(() => {
		if (!databaseId && sourceBlockId) {
			initializeDatabase();
		}
	}, [databaseId, sourceBlockId]);

	useEffect(() => {
		if (pageId && databaseId && !currentDatabase) {
			getDatabase({ pageId, databaseId });
		}
		if (pageId && databaseId && currentDatabase && !currentDatabase?.rows) {
			getDatabaseRows(
				{
					pageId,
					input: {
						page: 1,
						limit: 10,
						databaseId: databaseId,
					},
				},
				block?.id,
			);
		}
	}, [databaseId, currentDatabase, pageId]);

	useEffect(() => {
		if (databaseId && !currentDatabaseRows) {
			getDatabaseRows({
				pageId,
				input: {
					page: 1,
					limit: 10,
					databaseId: databaseId,
				},
			});
		}
	}, [databaseId, currentDatabaseRows]);

	const initializeDatabase = async () => {
		const database = await createDatabase({
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

		let databaseView = null;

		if (database) {
			databaseView = await createDatabaseView({
				pageId: pageId,
				input: {
					blockId: sourceBlockId,
					databaseId: database?._id,
					viewConfig: [
						{
							title: 'table',
							type: 'table',
						},
					],
				},
			});
		}

		if (databaseView && databaseView) {
			editor.updateBlock(block?.id, {
				props: {
					databaseId: database?._id,
					databaseViewId: databaseView?._id,
				},
			});
		}
	};

	const handleInfoChange = useCallback((data = {}) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const fields = currentDatabase?.databaseMetadata?.fields || [];
	const databaseName = currentDatabase?.databaseMetadata?.name || 'Database';
	const rows = currentDatabaseRows?.data || [];

	return (
		<div className={s.notesDatabaseContainer}>
			<div className={s.notesDatabaseHeader}>
				<h3>{databaseName}</h3>
				<div className={s.notesDatabaseHeaderButtons}>
					<button onClick={() => handleInfoChange({ addRowModalOpen: true })}>
						Add Row
					</button>
					<button onClick={() => handleInfoChange({ addFieldModalOpen: true })}>
						Add Field
					</button>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						{fields?.map((field) => (
							<th key={field?._id}>{field?.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows?.map((row) => (
						<tr key={row?._id}>
							{fields?.map((field) => (
								<td key={field?._id}>{row?.values?.[field?._id] || ''}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<DatabaseAddModal
				isOpen={info?.addRowModalOpen}
				onClose={() => handleInfoChange({ addRowModalOpen: false })}
				blockId={block?.id}
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
