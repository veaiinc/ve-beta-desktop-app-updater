import { memo, useContext, useEffect, useMemo } from 'react';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import s from '../../../../assets/scss/notes/modals/databaseSidebar.module.scss';
import { rowTypes } from '../../notes/Database';
import DatabaseIcon from '../../notes/DatabseComponents/DatabaseIcon';

const DatabaseSidebar = ({ pageId }) => {
	const {
		notes: {
			databaseSidebar,
			updateDatabaseSidebar,
			deleteDatabaseRow,
			updateDatabaseRow,
			database,
		},
	} = useContext(Context);

	const sideBarOpen = databaseSidebar?.open;
	const {
		rowData = {},
		viewId = '',
		databaseId = '',
		groupId = null,
		blockId = '',
	} = databaseSidebar?.stack?.at(-1) || {};
	const currentDatabase = useMemo(() => database?.[databaseId], [database, databaseId]);

	const renderRowData = (field, value) => {
		let type = field?.type;

		const rowMetadataMapper = {
			serial_number: rowData?.serialNumber,
			created_by: [rowData?.createdBy],
			created_time: {
				startDate: rowData?.createdAt,
				endDate: rowData?.createdAt,
				isEndDateEnabled: false,
			},
			last_edited_by: [rowData?.updatedBy],
			last_edited_time: {
				startDate: rowData?.updatedAt,
				endDate: rowData?.updatedAt,
				isEndDateEnabled: false,
			},
		};

		// Get value from metadata mapper if it's a metadata field
		const metadataValue = rowMetadataMapper?.[field?.type];
		const finalValue = metadataValue || value;

		const Component = rowTypes?.[type] || null;
		if (!Component) return finalValue;

		const options = field?.type === 'status' ? field?.config?.status : field?.config?.options;

		return (
			<Component
				value={finalValue}
				title={field?.name}
				onOptionClick={(value) => handleUpdateRow(rowData?._id, field._id, value)}
				onChange={(value) => handleUpdateRow(rowData?._id, field._id, value)}
				showLabel={true}
				defaultLabel={'Not selected'}
				options={options}
				multiSelect={true}
				parseValue={field?.config?.parseValue}
				disabled={field?.isReadOnly}
				timestamp={field?.isReadOnly}
				takeFullspace={true}
				className={field?.type === 'date' ? 'database-date-picker' : ''}
				prefix={field?.config?.prefix}
				labelField={'label'}
			/>
		);
	};

	const handleUpdateRow = (rowId, key, value) => {
		const payload = {
			updateDatabaseRowId: rowId,
			input: {
				values: { [key]: value },
			},
			pageId,
		};
		updateDatabaseRow(payload, { viewId, databaseId, groupId, blockId });
	};

	const handleDeleteRow = () => {
		deleteDatabaseRow(
			{
				deleteDatabaseRowId: rowData?._id,
				pageId,
			},
			{
				viewId,
				databaseId,
				groupId,
				blockId,
			},
		);
		updateDatabaseSidebar({ open: false });
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
					<div className={s.notesDatabaseSidebarHeaderTitle}>
						{currentDatabase?.databaseMetadata?.name}
					</div>
					<button onClick={handleDeleteRow} className={s.deleteButton}>
						Delete
					</button>
				</div>
				<div className={s.notesDatabaseSidebarContent}>
					{currentDatabase?.databaseMetadata?.fields?.map((field) => (
						<div className={s.notesDatabaseSidebarField} key={field?._id}>
							<div className={s.notesDatabaseSidebarFieldLabel}>
								<DatabaseIcon type={field?.type} /> {field.name}
							</div>
							<div className={s.notesDatabaseSidebarFieldValue}>
								{renderRowData(field, rowData?.values?.[field._id])}
							</div>
						</div>
					))}
				</div>
				<div className={s.notesDatabaseSidebarFooter}>{/* <h3>Footer</h3> */}</div>
			</div>
		</Drawer>
	);
};

export default memo(DatabaseSidebar);
