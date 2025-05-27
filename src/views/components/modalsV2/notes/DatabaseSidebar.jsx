import { memo, useContext } from 'react';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import s from '../../../../assets/scss/notes/modals/databaseSidebar.module.scss';
import { rowTypes } from '../../notes/Database';
const DatabaseSidebar = ({ databaseId, pageId, databaseName, fields }) => {
	const {
		notes: { databaseSidebar, updateDatabaseSidebar },
	} = useContext(Context);

	const sideBarOpen = databaseSidebar?.open;
	const rowData = databaseSidebar?.stack?.at(-1);

	const renderRowData = (field, value) => {
		let type = field?.type;

		const Component = rowTypes?.[type] || null;
		return Component ? (
			<Component
				value={value}
				disabled={field?.isReadOnly}
				timestamp={field?.isReadOnly}
				showLabel={true}
			/>
		) : null;
	};

	return (
		<Drawer
			onClose={() => updateDatabaseSidebar({ open: false })}
			width={'fit-content'}
			open={sideBarOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px', overflow: 'hidden' }}
			className={s.databaseSidebarDrawer}
			destroyOnClose={true}
			maskClassName={s.databaseSidebarMask}
		>
			<div className={s.notesDatabaseSidebar}>
				<div className={s.notesDatabaseSidebarHeader}>
					<div className={s.notesDatabaseSidebarHeaderTitle}>{databaseName}</div>
				</div>
				<div className={s.notesDatabaseSidebarContent}>
					{fields.map((field) => (
						<div className={s.notesDatabaseSidebarField}>
							<div className={s.notesDatabaseSidebarFieldLabel}>{field.name}</div>
							{renderRowData(field, rowData?.[field._id])}
						</div>
					))}
				</div>
				<div className={s.notesDatabaseSidebarFooter}>
					<h3>Footer</h3>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(DatabaseSidebar);
