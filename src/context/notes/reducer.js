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
	ADD_DATABASE_ROWS: (state, action) => ({
		...state,
		rowData: { ...state.rowData, ...action?.payload },
	}),
	UPDATE_DATABASE_ROWS: (state, action) => {
		const { viewId, rowId, updatedRow } = action.payload;

		const currentBlockData = state?.rowData?.[viewId] || {};
		const currentRows = currentBlockData.data || [];

		const updatedRows = currentRows.map((row) =>
			row._id === rowId
				? {
						...(row || {}),
						...(updatedRow || {}),
						values: {
							...(row?.values || {}),
							...(updatedRow?.values || {}),
						},
				  }
				: row,
		);

		return {
			...state,
			rowData: {
				...state.rowData,
				[viewId]: {
					...currentBlockData,
					data: updatedRows,
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
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
