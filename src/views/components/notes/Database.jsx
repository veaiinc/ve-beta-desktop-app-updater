import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import ObjectID from 'bson-objectid';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import '../../../assets/scss/notes/database.scss';
import { memo, useContext, useEffect } from 'react';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { NotesRefContext } from '../../features/notesModule/NotesEditor';

const DatabaseComponent = memo(({ block, editor }) => {
	const {
		notes: { createDatabase, database, createDatabaseView },
	} = useContext(Context);

	const { previousBlocksRef, pageId } = useContext(NotesRefContext);

	const { databaseId, databaseViewId } = block?.props;
	const sourceBlockId = previousBlocksRef?.current?.get(block?.id)?._id;

	useEffect(() => {
		if (!databaseId && sourceBlockId) {
			initializeDatabase();
		}
	}, [databaseId, sourceBlockId]);

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

	return <div className="notes-database-container"></div>;
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
