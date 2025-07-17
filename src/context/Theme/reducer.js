const actionHandlers = {
	UPDATE_THEME: (state, action) => ({
		...state,
		theme: action.payload,
	}),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
