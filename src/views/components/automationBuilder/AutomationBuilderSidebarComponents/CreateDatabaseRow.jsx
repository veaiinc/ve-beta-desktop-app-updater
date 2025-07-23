import { memo, useCallback, useContext, useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import Context from '../../../../context/context';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import VariableComponent from './VariableComponent';

const CreateDatabaseRow = ({
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
		fieldValues: [],
	});

	// Pre-fill form when editing an existing step
	useEffect(() => {
		if (activeStepsData) {
			// For create database nodes, the data is stored in inputBody
			const pageId = activeStepsData?.inputBody?.pageId;
			const databaseId = activeStepsData?.inputBody?.databaseId;

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

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const handleSelectPage = (option) => {
		const page = option.value;
		updateInfo({
			selectedPage: page,
			selectedDatabase: null,
			databaseFields: [],
			fieldValues: [],
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
			fieldValues: [],
		});
		getDatabase({ pageId: info.selectedPage._id, databaseId: database._id });
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
				action: 'createDatabaseRecord',
				pageId: info.selectedPage._id,
				databaseId: info.selectedDatabase._id,
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

	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Create Database Row" />
			<>
				<ActionDetailsBlock
					actionLabel="Create Database Row"
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
					{info.selectedDatabase && (
						<>
							<hr className="inputSeparator" />
							<h2 className="InputBlockHeading">Fields</h2>
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
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
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

export default memo(CreateDatabaseRow);
