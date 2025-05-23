import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import ObjectID from 'bson-objectid';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import '../../../assets/scss/notes/database.scss';
import { memo, useContext, useEffect } from 'react';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';

const DatabaseComponent = memo(({ block, editor }) => {
	const { noteId: pageId } = useParams();
	const {
		notes: { createDatabase, database },
	} = useContext(Context);

	const { databaseId, databaseViewId } = block?.props;

	console.log('database==>', database);

	useEffect(() => {
		if (!databaseId) {
			createDatabase({
				pageId: pageId,
				input: {
					name: 'Database',
					fields: [
						{
							name: 'Name',
							type: 'text',
						},
					],
					sourceBlockId: block?.id,
				},
			});
		}
	}, [databaseId]);

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
