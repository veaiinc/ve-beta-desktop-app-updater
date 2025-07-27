import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/databaseFilter.scss';
import ActionDetailsBlock from './ActionDetailsBlock';
import VariableComponent from './VariableComponent';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';

const databaseConditionsList = [
	{
		label: 'Is equal to',
		value: 'isequalto',
		needValue: true,
	},
	{
		label: 'Is not equal to',
		value: 'isnotequalto',
		needValue: true,
	},
	{
		label: 'Contains',
		value: 'contains',
		needValue: true,
	},
	{
		label: 'Does not contain',
		value: 'doesnotcontain',
		needValue: true,
	},
	{
		label: 'Is empty',
		value: 'isempty',
	},
	{
		label: 'Is not empty',
		value: 'isnotempty',
	},
	{
		label: 'Greater than',
		value: 'greaterthan',
		needValue: true,
	},
	{
		label: 'Less than',
		value: 'lessthan',
		needValue: true,
	},
];

const DatabaseFilter = ({
	variables,
	onSave,
	isLoading,
	hasNextNode,
	onBack,
	activeStepsData = null,
}) => {
	const {
		notes: {
			getNotesList,
			notes,
			listAvailableDatabases,
			availableDatabases,
			updateNotesState,
			getDatabase,
			database: databaseContext,
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
		limit: 10,
		filters: [
			{
				field: '',
				operator: '',
				value: '',
			},
		],
		moveToYes: true,
	});

	// Pre-fill form when editing an existing step
	useEffect(() => {
		if (activeStepsData) {
			updateInfo({
				title: activeStepsData?.title || '',
				description: activeStepsData?.description || '',
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

	// Update database fields from context
	useEffect(() => {
		if (info.selectedDatabase?._id && databaseContext?.[info.selectedDatabase._id]) {
			const fields =
				databaseContext[info.selectedDatabase._id].databaseMetadata?.fields || [];
			updateInfo({
				databaseFields: fields,
				databaseFieldsLoading: false,
			});
		}
	}, [databaseContext, info.selectedDatabase]);

	// Handle database selection when available databases are loaded
	useEffect(() => {
		if (availableDatabases && activeStepsData?.inputBody?.pageId && !info.selectedDatabase) {
			const databaseId = activeStepsData.inputBody.databaseId;

			if (databaseId) {
				const targetDatabase = availableDatabases.find((db) => db._id === databaseId);
				if (targetDatabase) {
					updateInfo({ selectedDatabase: targetDatabase });
					getDatabase({
						pageId: activeStepsData.inputBody.pageId,
						databaseId: targetDatabase._id,
					});
				}
			} else {
				// If no databaseId stored, select the first database
				if (availableDatabases.length > 0) {
					const firstDatabase = availableDatabases[0];
					updateInfo({ selectedDatabase: firstDatabase });
					getDatabase({
						pageId: activeStepsData.inputBody.pageId,
						databaseId: firstDatabase._id,
					});
				}
			}
		}
	}, [availableDatabases, activeStepsData, info.selectedDatabase]);

	// Extract filters from activeStepsData when editing
	useEffect(() => {
		if (activeStepsData?.inputBody) {
			const inputBody = activeStepsData.inputBody;
			const filters = [];

			// Extract filters from inputBody
			Object.keys(inputBody).forEach((key) => {
				if (key.startsWith('filter')) {
					filters.push({
						field: inputBody[key]?.field || '',
						operator: inputBody[key]?.operator || '',
						value: inputBody[key]?.value || '',
					});
				}
			});

			if (filters.length > 0) {
				updateInfo({
					limit: inputBody?.limit || 10,
					filters: filters,
				});
			}
		}
	}, [activeStepsData]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const handleSelectPage = (option) => {
		const page = option.value;
		updateInfo({
			selectedPage: page,
			selectedDatabase: null,
			databaseFields: [],
			filters: [{ field: '', operator: '', value: '' }],
		});
		updateNotesState({ availableDatabases: undefined });
		listAvailableDatabases({ pageId: page._id });
	};

	const handleSelectDatabase = (option) => {
		const database = option.value;
		updateInfo({
			selectedDatabase: database,
			databaseFields: [],
			databaseFieldsLoading: true,
		});
		getDatabase({ pageId: info.selectedPage._id, databaseId: database._id });
	};

	const updateFilter = useCallback(
		(index, data) => {
			const newFilters = [...info.filters];
			newFilters[index] = { ...newFilters[index], ...data };
			setInfo((prev) => ({ ...prev, filters: newFilters }));
		},
		[info.filters],
	);

	const addFilter = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			filters: [...prev.filters, { field: '', operator: '', value: '' }],
		}));
	}, []);

	const removeFilter = useCallback(
		(index) => {
			if (info.filters.length > 1) {
				const newFilters = [...info.filters];
				newFilters.splice(index, 1);
				setInfo((prev) => ({ ...prev, filters: newFilters }));
			}
		},
		[info.filters],
	);

	const handleSave = useCallback(() => {
		if (!info.title?.trim()) {
			message.error('Title is required');
			return;
		}

		if (!info.description?.trim()) {
			message.error('Description is required');
			return;
		}

		if (!info.selectedPage) {
			message.error('Please select a page');
			return;
		}

		if (!info.selectedDatabase) {
			message.error('Please select a database');
			return;
		}

		// Validate filters
		const hasInvalidFilter = info.filters.some((filter) => {
			const selectedCondition = databaseConditionsList.find(
				(c) => c.value === filter.operator,
			);
			const isValueRequired = selectedCondition?.needValue;
			return !filter.field || !filter.operator || (isValueRequired && !filter.value);
		});

		if (hasInvalidFilter) {
			message.error('Please fill all required filter fields');
			return;
		}

		// Build variables object
		const variables = {};

		// Build inputBody with exact structure
		const inputBody = {
			action: 'findDatabaseRecord',
			pageId: info.selectedPage._id,
			databaseId: info.selectedDatabase._id,
			limit: info.limit,
		};

		// Process filters and add to both variables and inputBody
		info.filters.forEach((filter, index) => {
			const filterKey = `filter${index + 1}`;

			// Add to inputBody
			inputBody[filterKey] = {
				field: filter.field.trim(),
				operator: filter.operator,
				value: filter.value.trim(),
			};

			// Check if value contains variables and add to variables object
			const variableRegex = /^\{\{.*\}\}$/;
			if (variableRegex.test(filter.value)) {
				variables[filterKey] = { value: [filter.value.slice(2, -2)] };
			}
		});

		// Create the exact payload structure you want
		const payload = {
			title: info.title.trim(),
			description: info.description.trim(),
			type: 'action',
			app: 'inApp',
			isEnabled: true,
			actionType: 'database',
			variables,
			inputBody,
		};

		// Add moveTo only for new steps (not when editing)
		if (!activeStepsData) {
			payload.moveTo = info.moveToYes ? 'yes' : 'no';
		}

		onSave(payload);
	}, [info, onSave, activeStepsData]);

	return (
		<>
			<ActionDetailsBlock
				actionLabel="Database Filter"
				heading="Database Filter Condition"
				title={info.title}
				description={info.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
				showChangeButton={activeStepsData ? false : true}
			/>

			<div className="databaseFilterInputContainer">
				<h3 className="databaseFilterInputHeading">Database Configuration</h3>

				<div className="databaseFilterInputField">
					<span className="databaseFilterInputLabel">Note</span>
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
					<div className="databaseFilterInputField">
						<span className="databaseFilterInputLabel">Database</span>
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

				<div className="databaseFilterInputField">
					<span className="databaseFilterInputLabel">Limit</span>
					<div className="databaseFilterLimitContainer">
						<input
							type="number"
							className="databaseFilterInputValue"
							placeholder="Enter limit (default: 10)"
							value={info.limit}
							onChange={(e) => updateInfo({ limit: parseInt(e.target.value) || 10 })}
							min="1"
							max="100"
						/>
						<div className="databaseFilterLimitArrows">
							<button
								type="button"
								className="databaseFilterLimitArrow databaseFilterLimitArrowUp"
								onClick={() => updateInfo({ limit: Math.min(100, info.limit + 1) })}
								title="Increase limit"
							>
								▲
							</button>
							<button
								type="button"
								className="databaseFilterLimitArrow databaseFilterLimitArrowDown"
								onClick={() => updateInfo({ limit: Math.max(1, info.limit - 1) })}
								title="Decrease limit"
							>
								▼
							</button>
						</div>
					</div>
				</div>

				<h3 className="databaseFilterInputHeading">Filters</h3>

				{info.filters.map((filter, index) => (
					<div key={index} className="databaseFilterFilterContainer">
						<div className="databaseFilterFilterHeader">
							<span className="databaseFilterFilterTitle">Filter {index + 1}</span>
							{info.filters.length > 1 && (
								<button
									className="databaseFilterRemoveFilterButton"
									onClick={() => removeFilter(index)}
								>
									Remove
								</button>
							)}
						</div>

						<div className="databaseFilterInputField">
							<span className="databaseFilterInputLabel">Field</span>
							{info.databaseFieldsLoading ? (
								<Spinner />
							) : (
								<VariableComponent
									type="dropdown"
									options={info.databaseFields.map((field) => ({
										label: field.name,
										value: field._id,
									}))}
									value={{
										label:
											info.databaseFields.find((f) => f._id === filter.field)
												?.name || 'Select a Field',
									}}
									onChange={(option) =>
										updateFilter(index, { field: option.value })
									}
								/>
							)}
						</div>

						<div className="databaseFilterInputField">
							<span className="databaseFilterInputLabel">Condition</span>
							<select
								className="databaseFilterInputValue"
								value={filter.operator}
								onChange={(e) => updateFilter(index, { operator: e.target.value })}
							>
								<option value="">Select condition</option>
								{databaseConditionsList.map((condition) => (
									<option key={condition.value} value={condition.value}>
										{condition.label}
									</option>
								))}
							</select>
						</div>

						{databaseConditionsList.find((c) => c.value === filter.operator)
							?.needValue && (
							<div className="databaseFilterInputField">
								<span className="databaseFilterInputLabel">Value</span>
								<VariableComponent
									value={filter.value}
									onChange={(value) => updateFilter(index, { value })}
									variables={variables?.data}
								/>
							</div>
						)}
					</div>
				))}

				<button className="databaseFilterAddFilterButton" onClick={addFilter}>
					Add Filter
				</button>

				{hasNextNode && (
					<div className="databaseFilterInputField">
						<span className="databaseFilterInputLabel">
							Where should the existing steps go?
						</span>
						<div className="databaseFilterCheckboxContainer">
							<label htmlFor="toYes">
								<input
									type="checkbox"
									id="toYes"
									checked={info.moveToYes}
									onChange={(e) => updateInfo({ moveToYes: e.target.checked })}
								/>
								To Yes (Records Found)
							</label>
							<label htmlFor="toNo">
								<input
									type="checkbox"
									id="toNo"
									checked={!info.moveToYes}
									onChange={(e) => updateInfo({ moveToYes: !e.target.checked })}
								/>
								To No (No Records Found)
							</label>
						</div>
					</div>
				)}
			</div>

			<button className="databaseFilterSaveButton" onClick={handleSave} disabled={isLoading}>
				{isLoading ? 'Saving...' : 'Save'}
			</button>
		</>
	);
};

export default memo(DatabaseFilter);
