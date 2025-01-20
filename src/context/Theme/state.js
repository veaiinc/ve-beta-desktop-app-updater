import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import Cookies from 'js-cookie';
console.log(localStorage.getItem('theme'));
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

	return {
		...state,
		updateTheme,
	};
};
