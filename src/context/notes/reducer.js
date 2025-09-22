import {
	applyFilter,
	handleUpdateInGroup,
	handleAddInGroup,
	handleDeleteInGroup,
	handleDragAndDropInGroup,
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
		const {
			viewId,
			rowId,
			updatedRowData,
			groupId,
			blockId,
			databaseId,
			reorderContext,
			isOptimisticUpdate = false,
		} = action.payload;

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

		// If reorderContext is provided, use drag and drop logic
		if (reorderContext) {
			const { updatedGroupData, updatedGroups } = handleDragAndDropInGroup({
				groupData,
				updatedRowData,
				groupId,
				rowId,
				groupBy,
				config: view?.groupBy?.config,
				fieldType,
				defaultGroups: view?.groupBy?.defaultGroups,
				statusOptions,
				...reorderContext,
			});

			if (updatedGroups) {
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
		}

		// Otherwise, use the original update logic
		const { updatedGroupData, updatedGroups, updatedRow } = handleUpdateInGroup({
			groupData,
			updatedRowData,
			groupId,
			rowId,
			groupBy,
			config: view?.groupBy?.config,
			fieldType,
			defaultGroups: view?.groupBy?.defaultGroups,
			statusOptions,
		});
		if (updatedGroups) {
			view = {
				...view,
				groupBy: {
					...view?.groupBy,
					defaultGroups: updatedGroups,
				},
			};
		}

		if (state.databaseSidebar.stack?.at(-1)?.rowData?._id === rowId) {
			state.databaseSidebar.stack.at(-1).rowData = updatedRow;
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
	ADD_MORE_DATA_IN_GROUP: (state, action) => {
		const { viewId, groupId, data } = action.payload;
		const currentBlockData = state?.rowData?.[viewId] || {};
		const { groupData } = currentBlockData || {};

		// Get the current group data
		const currentGroup = groupData?.[groupId];

		if (!currentGroup || !data) {
			return state;
		}

		// Create a map of existing doc IDs for quick duplicate checking
		const existingDocIds = new Set(currentGroup.docs?.map((doc) => doc._id) || []);

		// Filter out duplicates from the new data
		const newDocs = data.docs?.filter((doc) => !existingDocIds.has(doc._id)) || [];

		// Merge the docs arrays
		const mergedDocs = [...(currentGroup.docs || []), ...newDocs];

		// Update the group data with merged docs and new pagination info
		const updatedGroup = {
			...currentGroup,
			docs: mergedDocs,
			currentPage: data.currentPage,
			hasNextPage: data.hasNextPage,
			hasPrevPage: data.hasPrevPage,
			limit: data.limit,
			nextPage: data.nextPage,
			prevPage: data.prevPage,
			totalDocs: data.totalDocs,
			totalPages: data.totalPages,
		};

		// Update the groupData with the merged group
		const updatedGroupData = {
			...groupData,
			[groupId]: updatedGroup,
		};

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
	SYNC_OPTIMISTIC_UPDATE: (state, action) => {
		const { viewId, rowId, updatedRow, groupId, blockId, databaseId } = action.payload;

		const currentBlockData = state?.rowData?.[viewId] || {};
		const { groupData } = currentBlockData || {};

		// Update the row data in all groups without reordering
		const updatedGroupData = {};
		for (const group in groupData) {
			const updatedDocs = groupData[group]?.docs?.map((row) => {
				if (row?._id === rowId) {
					return {
						...row,
						...updatedRow,
						values: {
							...row?.values,
							...(updatedRow?.values || {}),
						},
					};
				}
				return row;
			});
			updatedGroupData[group] = {
				...groupData[group],
				docs: updatedDocs,
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
		};
	},
	REVERT_OPTIMISTIC_UPDATE: (state, action) => {
		const { viewId, rowId, groupId, blockId, databaseId, reorderContext } = action.payload;

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

		// Revert the reordering by doing the opposite operation
		const reverseReorderContext = {
			...reorderContext,
			sourceGroupId: reorderContext.destinationGroupId,
			destinationGroupId: reorderContext.sourceGroupId,
			sourceIndex: reorderContext.destinationIndex,
			destinationIndex: reorderContext.sourceIndex,
		};

		const { updatedGroupData, updatedGroups } = handleDragAndDropInGroup({
			groupData,
			updatedRowData: null,
			groupId,
			rowId,
			groupBy,
			config: view?.groupBy?.config,
			fieldType,
			defaultGroups: view?.groupBy?.defaultGroups,
			statusOptions,
			...reverseReorderContext,
		});

		if (updatedGroups) {
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
	GET_MEET_TRANSCRIPT_HISTORY_SUCCESS: (state, action) => ({
		...state,
		transcriptHistory: action?.payload,
	}),
	GET_AI_LIVE_INTELLIGENCE_HISTORY_SUCCESS: (state, action) => ({
		...state,
		aiLiveIntelligenceHistory: action?.payload,
	}),
	GET_EXISTING_BOTS_SUCCESS: (state, action) => ({
		...state,
		existingBots: action?.payload,
	}),
	GET_MEET_SUMMARY_SUCCESS: (state, action) => ({
		...state,
		meetSummary: action?.payload,
	}),
	UPDATE_STATE_VALUES_SUCCESS: (state, action) => ({ ...state, ...action.payload }),
	CREATE_MEET_BOT_SUCCESS: (state, action) => ({
		...state,
		createBotInfo: action?.payload?.createBotInfo,
	}),
	UPDATE_MEETING: (state, action) => ({
		...state,
		createBotInfo: { ...state?.createBotInfo, ...action?.payload },
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
