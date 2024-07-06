const actionHandlers = {
	GET_TENANTS_LIST: (state, action) => ({
		...state,
		tenantsUserList: action.payload,
	}),
};
const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
