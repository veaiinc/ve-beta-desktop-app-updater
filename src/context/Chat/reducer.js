const actionHandlers = {
    GET_USERS_FROM_META_SUCCESS: (state, action) => ({
        ...state,
        [action.variableSelection]: action.payload,
    }),
    GET_USERS_ALL_CONVERSATIONS_SUCCESS: (state, action) => ({
        ...state,
        [action.variableSelection]: action.payload,
    }),
    GET_PAGEINFO_DATA_SUCCESS: (state, action) => ({
        ...state,
        pageInfoData: action.payload,
    }),
    GET_PAGEINFO_CHAT_FILTERS_COUNT_SUCCESS: (state, action) => ({
        ...state,
        chatFiltersCount: action.payload,
    }),
};

const Reducer = (state, action) => {
    const handler = actionHandlers[action.type];
    return handler ? handler(state, action) : state;
};

export default Reducer;
