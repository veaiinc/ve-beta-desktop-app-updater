import {
	applyFilter,
	handleUpdateInGroup,
	handleAddInGroup,
	handleDeleteInGroup,
} from '../../helpers/databaseHelpers';
import { intialState } from './state';
const actionHandlers = {
	GET_NOTES_SUCCESS: (state, action) => ({ ...state, notes: action?.payload }),
	GET_MORE_NOTES_SUCCESS: (state, action) => ({
		...state,
		moreNotes: action?.payload,
	}),
	GET_NOTES_PAGE_DATA_SUCCESS: (state, action) => ({ ...state, notesPageData: action?.payload }),
	GET_NOTES_ACCESS_SUCCESS: (state, action) => ({ ...state, notesAccess: action?.payload }),
	SET_GLOBAL_ACCESS: (state, action) => ({ ...state, globalAccess: action?.payload }),
	SET_BLOCKS: (state, action) => ({ ...state, blocks: action?.payload }),
	UPDATE_NOTES_STATE: (state, action) => ({ ...state, ...action?.payload }),
	UPDATE_DATABASE: (state, action) => ({
		...state,
		database: { ...state.database, ...action?.payload },
	}),
	REMOVE_DATABASE: (state, action) => {
		const { [action?.payload?.databaseId]: _, ...newDatabase } = state.database;
		return { ...state, database: newDatabase };
	},
	SET_BLOCK_MAPPER: (state, action) => ({ ...state, blockMapper: action?.payload }),
	UPDATE_DATABASE_VIEWS: (state, action) => ({
		...state,
		views: { ...state.views, ...action?.payload },
	}),
	SET_DATABASE_ROWS: (state, action) => ({
		...state,
		rowData: { ...state.rowData, ...action?.payload },
	}),
	ADD_DATABASE_ROW: (state, action) => {
		const { viewId, newRowData, blockId, databaseId } = action.payload;
		const currentBlockData = state?.rowData?.[viewId] || {};
		const { groupData, groupBy, fieldType } = currentBlockData || {};
		const view = state?.views?.[blockId] || [];
		let currentView = view?.find((item) => item?._id === viewId);

		const { updatedGroupData, updatedGroups } = handleAddInGroup({
			groupData,
			newRowData,
			groupBy,
			config: currentView?.groupBy?.config,
			fieldType,
			defaultGroups: currentView?.groupBy?.defaultGroups,
		});

		let statusOptions = null;
		if (fieldType === 'status') {
			const fieldId = groupBy?.fieldId;
			const updatedField = state?.database?.[databaseId]?.databaseMetadata?.fields?.find(
				(item) => item?._id === fieldId,
			);
			statusOptions = updatedField?.config?.status;
		}

		if (updatedGroups) {
			currentView = {
				...currentView,
				groupBy: {
					...currentView?.groupBy,
					defaultGroups: updatedGroups,
				},
			};
		}

		return {
			...state,
			rowData: {
				...state.rowData,
				[viewId]: {
					...currentBlockData,
					groupData: updatedGroupData,
				},
			},
			views: {
				...state.views,
				[blockId]: state?.views?.[blockId]?.map((item) =>
					item?._id === viewId ? currentView : item,
				),
			},
		};
	},
	DELETE_DATABASE_ROWS: (state, action) => {
		const { viewId, rowId, groupId, blockId, databaseId } = action.payload;

		const currentBlockData = state?.rowData?.[viewId] || {};
		const { groupData, groupBy, fieldType } = currentBlockData || {};
		const view = state?.views?.[blockId]?.find((item) => item?._id === viewId);

		let statusOptions = null;
		if (fieldType === 'status') {
			const fieldId = groupBy?.fieldId;
			const updatedField = state?.database?.[databaseId]?.databaseMetadata?.fields?.find(
				(item) => item?._id === fieldId,
			);
			statusOptions = updatedField?.config?.status;
		}

		const updatedGroupData = handleDeleteInGroup({
			groupData,
			rowId,
			groupBy,
			groupId,
			fieldType,
			config: view?.groupBy?.config,
		});
		return {
			...state,
			rowData: {
				...state.rowData,
				[viewId]: {
					...currentBlockData,
					groupData: updatedGroupData,
				},
			},
		};
	},
	UPDATE_DATABASE_ROWS: (state, action) => {
		const { viewId, rowId, updatedRow, groupId, blockId, databaseId } = action.payload;

		const currentBlockData = state?.rowData?.[viewId] || {};
		const { groupData, groupBy, fieldType } = currentBlockData || {};

		let view = (state?.views?.[blockId] || []).find((item) => item?._id === viewId);

		let statusOptions = null;
		if (fieldType === 'status') {
			const fieldId = groupBy?.fieldId;
			const updatedField = state?.database?.[databaseId]?.databaseMetadata?.fields?.find(
				(item) => item?._id === fieldId,
			);
			statusOptions = updatedField?.config?.status;
		}

		const { updatedGroupData, updatedGroups } = handleUpdateInGroup({
			groupData,
			updatedRowData: updatedRow,
			groupId,
			rowId,
			groupBy,
			config: view?.groupBy?.config,
			fieldType,
			defaultGroups: view?.groupBy?.defaultGroups,
			statusOptions,
		});
		if (updatedGroups) {
			console.log('updatedGroups', updatedGroups);
			view = {
				...view,
				groupBy: {
					...view?.groupBy,
					defaultGroups: updatedGroups,
				},
			};
		}

		return {
			...state,
			rowData: {
				...state.rowData,
				[viewId]: {
					...currentBlockData,
					groupData: updatedGroupData,
				},
			},
			views: {
				...state.views,
				[blockId]: state?.views?.[blockId]?.map((item) =>
					item?._id === viewId ? view : item,
				),
			},
		};
	},
	UPDATE_DATABASE_SIDEBAR: (state, action) => ({
		...state,
		databaseSidebar: { ...state.databaseSidebar, ...action?.payload },
	}),
	SET_AVAILABLE_DATABASES: (state, action) => ({
		...state,
		availableDatabases: action?.payload,
	}),
	UPDATE_RELATED_VIEWS: (state, action) => {
		const { updatedRow, viewId, databaseId, rowId, actionType = 'update' } = action.payload;

		const affectedViews = Object.values(state?.views)
			.flat()
			.filter((item) => item.databaseId === databaseId);

		if (!affectedViews.length) return state;

		const updatedRowData = {
			...state?.rowData?.[viewId]?.data?.find((row) => row._id === rowId),
		};

		for (const view of affectedViews) {
			const rowData = state?.rowData?.[view._id];
			const filterBy = view?.filterBy;

			if (!rowData) continue;

			const rowIndex = rowData.data?.findIndex((row) => row._id === rowId);

			// Handle different action types
			switch (actionType) {
				case 'add':
					// Add new row to the data array
					if (view?._id !== viewId) {
						updatedRowData[view._id] = {
							...rowData,
							data: [...rowData.data, updatedRow],
						};
					}
					break;

				case 'delete':
					// Remove row from the data array if it exists
					if (rowIndex !== -1) {
						updatedRowData[view._id] = {
							...rowData,
							data: [
								...rowData.data.slice(0, rowIndex),
								...rowData.data.slice(rowIndex + 1),
							],
						};
					}
					break;

				case 'update':
				default:
					// Update existing row if it exists
					const updatedData = Object.entries(updatedRow?.values)?.[0];

					const includesInFilter = filterBy?.some(
						(item) => item?.fieldId === updatedData?.[0],
					);
					let include = true;
					if (includesInFilter) {
						const updatedField = state.database?.[
							databaseId
						]?.databaseMetadata?.fields?.find((item) => item?._id === updatedData?.[0]);
						const statusOptions =
							updatedField?.type === 'status' ? updatedField?.config?.status : null;
						include = applyFilter(filterBy, updatedRowData, statusOptions);
					}

					if (rowIndex !== -1) {
						if (include) {
							updatedRowData[view._id] = {
								...rowData,
								data: [
									...rowData.data.slice(0, rowIndex),
									{
										...updatedRowData,
									},
									...rowData.data.slice(rowIndex + 1),
								],
							};
						} else {
							updatedRowData[view._id] = {
								...rowData,
								data: [
									...rowData.data.slice(0, rowIndex),
									...rowData.data.slice(rowIndex + 1),
								],
							};
						}
					} else if (include) {
						updatedRowData[view._id] = {
							...rowData,
							data: [...rowData.data, updatedRowData],
						};
					}
					break;
			}
		}

		if (!Object.keys(updatedRowData).length) return state;

		return {
			...state,
			rowData: {
				...state.rowData,
				...updatedRowData,
			},
		};
	},
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
