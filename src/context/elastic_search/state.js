import Service from '../../services';
import { useReducer } from 'react';
import { Actions } from './actions';
import Reducer from './reducer';

export const initialState = {
	elasticSearchResults: [],
};

export const ElasticSearchState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const performElasticSearch = async (searchInput) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/search`;
			const body = { query: searchInput };
			const usertoken = localStorage.getItem('usertoken');
			const type = 'elastic_search_api';

			const response = await Service?.fetchPost(path, body, usertoken, type);
			if (response?.[0] === true) {
				const results = response?.[1]?.results;
				// Map the results as per the gallery requirements
				const formattedResults = results.map((result) => ({
					_id: result?.id,
					title: result?.title?.replace(/<\/?mark>/g, ''),
					text: result?.text,
					coverImage: null,
					imagesCount: 0,
					albumsCount: 0,
					createdAt: result?.createdAt,
					score: result?.score,
					platform: result?.platform,
					sourceType: result?.sourceType,
					fileUrl: result?.fileUrl,
					url: result?.url,
				}));
				dispatch({
					type: Actions?.GET_ELASTIC_SEARCH_RESULTS,
					payload: formattedResults,
				});
				return [true];
			}
			const error = response?.[1];
			return [false, 'An error occurred while fetching search results'];
		} catch (error) {
			console.log('error==>getElasticSearchResults', error);
			return [false, error];
		}
	};

	const resetElasticSearchState = () => {
		dispatch({
			type: Actions?.RESET_ELASTIC_SEARCH_STATE,
		});
	};

	return {
		...state,
		performElasticSearch,
		resetElasticSearchState,
	};
};
