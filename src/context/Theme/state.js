import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import Cookies from 'js-cookie';
export const initialThemeState = {
	theme: localStorage.getItem('theme') || Cookies.get('theme') || 'dark',
};

export const ThemeState = (props) => {
	const [state, dispatch] = useReducer(Reducer, initialThemeState);
	const updateTheme = (payload) => {
		dispatch({
			type: Actions.UPDATE_THEME,
			payload,
		});
		document?.documentElement?.setAttribute('theme', payload);
		Cookies?.set('theme', payload);
		localStorage?.setItem('theme', payload);
	};

	// const updatePrefernces = async (json) => {
	// 	try {
	// 		let usertoken = localStorage.getItem('usertoken');
	// 		let workspaceId = localStorage.getItem('workspaceId');
	// 		const response = await service.fetchPut(
	// 			'/' + workspaceId + API.TENANTS.preferences,
	// 			json,
	// 			usertoken,
	// 			'tenant',
	// 		);

	// 		if (response?.[0] === true) {
	// 			cookie.set('theme', json?.theme, { expires: 365 });
	// 			localStorage.setItem('theme', json?.theme);
	// 			return [true, response[1]];
	// 		} else {
	// 			return [false, response[1]];
	// 		}
	// 	} catch (error) {
	// 		console.log('error => updatePrefernces ', error);
	// 	}
	// };

	return {
		...state,
		updateTheme,
	};
};
