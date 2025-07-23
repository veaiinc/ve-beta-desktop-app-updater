import { memo, useCallback, useContext, useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import Context from '../../../../context/context';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import VariableComponent from './VariableComponent';

const UpdateDatabaseRow = ({
	onBack,
	onSave,
	activeStepsData,
	addTriggerLoading,
	handleChangeClick,
	variables,
	activeEdge,
}) => {
	const {
		notes: {
			getNotesList,
			notes,
			listAvailableDatabases,
			availableDatabases,
			updateNotesState,
			getDatabase,
			getDatabaseRows,
			getDatabaseViews,
			database: databaseContext,
			rowData,
			views,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		description: '',
		pages: [],
		pagesLoading: true,
		selectedPage: null,
		selectedDatabase: null,
		databaseFields: [],
		databaseFieldsLoading: false,
		fieldValues: [],
		databaseRows: [],
		databaseRowsLoading: false,
		selectedRow: null,
		selectedViewId: null,
		databaseViews: [],
	});

	// Pre-fill form when editing an existing step
	useEffect(() => {
		if (activeStepsData) {
			// For update database nodes, the data is stored in inputBody
			const pageId = activeStepsData?.inputBody?.pageId;
			const updateDatabaseRowId = activeStepsData?.inputBody?.updateDatabaseRowId;

			updateInfo({
				title: activeStepsData?.title,
				description: activeStepsData?.description,
			});

			
		}
	}, [activeStepsData]);

	// Fetch initial list of notes
	useEffect(() => {
		getNotesList(
			{
				input: {
					limit: 100,
					page: 1,
					pageType: 'all',
					sortBy: 'updatedAt',
					sortOrder: -1,
					search: '',
				},
			},
			false,
			true,
		);
		return () => {
			updateNotesState({ notes: null, availableDatabases: null });
		};
	}, []);

	// Update local pages state from context
	useEffect(() => {
		if (notes) {
			const pages = notes.data || [];
			updateInfo({
				pages: pages,
				pagesLoading: false,
			});

			// If we have activeStepsData with a pageId, find and select the page
			if (activeStepsData?.inputBody?.pageId && pages.length > 0) {
				const page = pages.find((p) => p._id === activeStepsData.inputBody.pageId);
				if (page) {
					updateInfo({ selectedPage: page });
					listAvailableDatabases({ pageId: page._id });
				}
			}
		}
	}, [notes, activeStepsData]);

	// Update database fields and their values from context
	useEffect(() => {
		if (info.selectedDatabase?._id && databaseContext?.[info.selectedDatabase._id]) {
			const fields =
				databaseContext[info.selectedDatabase._id].databaseMetadata?.fields || [];
			const initialFieldValues = fields.map((field) => {
				const existingValue = activeStepsData?.inputBody?.[field._id] || '';
				return {
					id: field._id,
					name: field.name,
					value: existingValue,
				};
			});
			updateInfo({
				databaseFields: fields,
				fieldValues: initialFieldValues,
				databaseFieldsLoading: false,
			});
		}
	}, [databaseContext, info.selectedDatabase, activeStepsData]);

	// Handle database selection when available databases are loaded
	useEffect(() => {
		if (availableDatabases && activeStepsData?.inputBody?.pageId && !info.selectedDatabase) {
			// For update database, we need to find the database that contains the row we're updating
			// Since we don't have the databaseId stored, we'll need to find it by checking which database contains the row

			// For now, let's select the first database and let the user change it if needed
			// In a more complete solution, we'd need to fetch each database and check which one contains the row
			if (availableDatabases.length > 0) {
				const firstDatabase = availableDatabases[0];
				updateInfo({ selectedDatabase: firstDatabase });
				getDatabase({
					pageId: activeStepsData.inputBody.pageId,
					databaseId: firstDatabase._id,
				});
				fetchDatabaseViews(activeStepsData.inputBody.pageId, firstDatabase._id);
			}
		}
	}, [availableDatabases, activeStepsData, info.selectedDatabase]);

	// Update database views from context
	useEffect(() => {
		if (info.selectedDatabase?._id && views?.[info.selectedDatabase._id]) {
			const databaseViews = views[info.selectedDatabase._id] || [];
			updateInfo({
				databaseViews: databaseViews,
			});

			// Auto-select the first view if available
			if (databaseViews.length > 0 && !info.selectedViewId) {
				const firstView = databaseViews[0];
				updateInfo({ selectedViewId: firstView._id });
				fetchDatabaseRows(info.selectedPage._id, info.selectedDatabase._id, firstView._id);
			}
		} else if (info.selectedDatabase?._id && databaseContext?.[info.selectedDatabase._id]) {
			// If no views are loaded but we have database metadata, try to fetch views
			const database = databaseContext[info.selectedDatabase._id];
			if (database?.databaseMetadata?.sourceBlockId) {
				fetchDatabaseViews(info.selectedPage._id, info.selectedDatabase._id);
			}
		}
	}, [views, info.selectedDatabase, info.selectedPage, databaseContext]);

	// Handle row selection when database rows are loaded
	useEffect(() => {
		const currentDatabaseRows = getDatabaseRowsFromContext();
		if (
			activeStepsData?.inputBody?.updateDatabaseRowId &&
			currentDatabaseRows.length > 0 &&
			!info.selectedRow
		) {
			const targetRowId = activeStepsData.inputBody.updateDatabaseRowId;

			const targetRow = currentDatabaseRows.find((row) => row._id === targetRowId);
			if (targetRow) {
				updateInfo({ selectedRow: targetRow });
			}
		}
	}, [rowData, info.selectedViewId, activeStepsData, info.selectedRow]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const fetchDatabaseViews = useCallback(
		async (pageId, databaseId) => {
			try {
				// Get the source block ID from the database metadata
				const database = databaseContext?.[databaseId];
				if (database?.databaseMetadata?.sourceBlockId) {
					await getDatabaseViews(
						{ pageId, blockId: database.databaseMetadata.sourceBlockId },
						databaseId,
					);
				} else {
					console.warn('No sourceBlockId found for database:', databaseId);
				}
			} catch (error) {
				console.error('Error fetching database views:', error);
			}
		},
		[databaseContext, getDatabaseViews],
	);

	const fetchDatabaseRows = useCallback(
		async (pageId, databaseId, viewId) => {
			if (!viewId) {
				return;
			}

			updateInfo({ databaseRowsLoading: true });
			try {
				await getDatabaseRows(
					{
						pageId,
						databaseId,
						databaseViewId: viewId,
						input: {
							docLimit: 100,
							docPage: 1,
							groupLimit: 10,
							groupPage: 1,
							search: '',
						},
					},
					{
						viewId,
						filters: null,
						sortBy: null,
						groupBy: null,
						blockId: null,
					},
				);
			} catch (error) {
				console.error('Error fetching database rows:', error);
			} finally {
				updateInfo({ databaseRowsLoading: false });
			}
		},
		[getDatabaseRows, updateInfo],
	);

	const handleSelectPage = (option) => {
		const page = option.value;
		updateInfo({
			selectedPage: page,
			selectedDatabase: null,
			selectedRow: null,
			databaseFields: [],
			fieldValues: [],
			databaseRows: [],
			databaseViews: [],
			selectedViewId: null,
		});
		updateNotesState({ availableDatabases: undefined });
		listAvailableDatabases({ pageId: page._id });
	};

	const handleSelectDatabase = (option) => {
		const database = option.value;
		updateInfo({
			selectedDatabase: database,
			selectedRow: null,
			databaseFields: [],
			databaseFieldsLoading: true,
			fieldValues: [],
			databaseRows: [],
			databaseViews: [],
			selectedViewId: null,
		});
		getDatabase({ pageId: info.selectedPage._id, databaseId: database._id });
		fetchDatabaseViews(info.selectedPage._id, database._id);
	};

	const handleSelectRow = (option) => {
		const row = option.value;
		updateInfo({
			selectedRow: row,
		});
	};

	const handleFieldValueChange = (index, value) => {
		const newFieldValues = [...info.fieldValues];
		newFieldValues[index].value = value;
		updateInfo({ fieldValues: newFieldValues });
	};

	const handleSave = () => {
		if (!info.selectedDatabase) {
			message.error('Please select a database.');
			return;
		}

		if (!info.selectedRow) {
			message.error('Please select a database row to update.');
			return;
		}

		const variableRegex = /\{\{.*?\}\}/g;
		const payloadVariables = {};
		const inputBodyValues = {};

		info.fieldValues.forEach((field) => {
			if (field.id && field.value !== '') {
				inputBodyValues[field.id] = field.value;

				if (typeof field.value === 'string' && field.value.match(variableRegex)) {
					const variablePaths = field.value
						.match(variableRegex)
						.map((v) => v.slice(2, -2));
					if (variablePaths.length > 0) {
						payloadVariables[field.id] = variablePaths;
					}
				}
			}
		});

		const payload = {
			title: info.title,
			description: info.description,
			type: 'action',
			app: 'inApp',
			isEnabled: true,
			actionType: 'database',
			variables: payloadVariables,
			inputBody: {
				action: 'updateDatabaseRecord',
				pageId: info.selectedPage._id,
				updateDatabaseRowId: info.selectedRow._id,
				...inputBodyValues,
			},
		};

		if (!activeStepsData) {
			payload.previousStepId = activeEdge?.split('-')?.[0] || '';
		}

		onSave(payload);
	};

	const onChangeButtonClick = useCallback(() => {
		if (activeStepsData) {
			handleChangeClick(activeStepsData?.app);
		} else {
			onBack();
		}
	}, [handleChangeClick, activeStepsData, onBack]);

	const renderDatabaseFields = () => {
		if (info.databaseFieldsLoading) return <Spinner />;

		if (info.fieldValues.length === 0) {
			return <div className="noFieldsMessage">This database has no fields.</div>;
		}

		return info.fieldValues.map((field, index) => (
			<div className="inputWrapper" key={field.id}>
				<span className="inputLabel">{field.name}</span>
				<div className="messageLineWrapper slackMessageWrapper">
					<VariableComponent
						variables={variables?.data}
						value={field.value}
						onChange={(val) => handleFieldValueChange(index, val)}
						placeholder="Enter Value"
					/>
				</div>
			</div>
		));
	};

	// Get database rows from context
	const getDatabaseRowsFromContext = () => {
		if (!info.selectedViewId || !rowData?.[info.selectedViewId]) {
			return [];
		}

		const viewData = rowData[info.selectedViewId];
		const groupData = viewData.groupData || {};

		// Flatten all groups into a single array of rows
		const allRows = [];
		Object.values(groupData).forEach((group) => {
			if (group.docs && Array.isArray(group.docs)) {
				allRows.push(...group.docs);
			}
		});

		return allRows;
	};

	const databaseRows = getDatabaseRowsFromContext();

	// Create a meaningful label for each row
	const getRowLabel = (row) => {
		// Try to get a meaningful field value for the label
		const values = row.values || {};
		const firstFieldValue = Object.values(values)[0];

		if (firstFieldValue) {
			// If it's an object with a name property, use that
			if (typeof firstFieldValue === 'object' && firstFieldValue.name) {
				return firstFieldValue.name;
			}
			// If it's a string or number, use it directly
			if (typeof firstFieldValue === 'string' || typeof firstFieldValue === 'number') {
				return String(firstFieldValue);
			}
		}

		// Fallback to serial number or ID
		return `Row ${row.serialNumber || row._id}`;
	};

	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Update Database Row" />
			<>
				<ActionDetailsBlock
					actionLabel="Update Database Row"
					heading="Actions"
					title={info.title}
					description={info.description}
					updaterFn={updateInfo}
					onChangeButtonClick={onChangeButtonClick}
				/>
				<div className="inAppActionsInputsContainer">
					<h2 className="InputBlockHeading">Database</h2>
					<div className="inputWrapper">
						<span className="inputLabel">Note</span>
						{info.pagesLoading ? (
							<Spinner />
						) : (
							<VariableComponent
								type="dropdown"
								options={info.pages.map((p) => ({ label: p.title, value: p }))}
								value={{ label: info.selectedPage?.title || 'Select a Note' }}
								onChange={handleSelectPage}
							/>
						)}
					</div>

					{info.selectedPage && (
						<div className="inputWrapper">
							<span className="inputLabel">Database</span>
							{availableDatabases === undefined ? (
								<Spinner />
							) : (
								<VariableComponent
									type="dropdown"
									options={(availableDatabases || []).map((db) => ({
										label: db.name,
										value: db,
									}))}
									value={{
										label: info.selectedDatabase?.name || 'Select a Database',
									}}
									onChange={handleSelectDatabase}
								/>
							)}
						</div>
					)}

					{info.selectedDatabase && info.databaseViews.length > 0 && (
						<div className="inputWrapper">
							<span className="inputLabel">Database Row</span>
							{info.databaseRowsLoading ? (
								<Spinner />
							) : (
								<VariableComponent
									type="dropdown"
									options={databaseRows.map((row) => ({
										label: getRowLabel(row),
										value: row,
									}))}
									value={{
										label: info.selectedRow
											? getRowLabel(info.selectedRow)
											: 'Select a Database Row',
									}}
									onChange={handleSelectRow}
								/>
							)}
						</div>
					)}

					{info.selectedRow && (
						<>
							<hr className="inputSeparator" />
							<h2 className="InputBlockHeading">Fields to Update</h2>
							{renderDatabaseFields()}
						</>
					)}
				</div>

				<div className="triggerSaveButtonContainer">
					<div
						className="actionsSaveButton"
						style={{
							cursor: addTriggerLoading ? 'not-allowed' : 'pointer',
							padding: '12px 24px',
						}}
						onClick={addTriggerLoading ? null : handleSave}
						disabled={addTriggerLoading}
					>
						{addTriggerLoading ? 'Saving...' : 'Save'}
					</div>
				</div>
			</>
		</div>
	);
};

export default memo(UpdateDatabaseRow);
