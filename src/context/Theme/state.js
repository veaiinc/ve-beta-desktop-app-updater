import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import Cookies from 'js-cookie';
import Service from '../../services/';

export const initialThemeState = {
	theme: localStorage.getItem('theme') || Cookies.get('theme') || 'systemDefault',
};

export const ThemeState = () => {
	const [state, dispatch] = useReducer(Reducer, initialThemeState);

	const updateTheme = async (themeValue) => {
		try {
			// dispatching before API call for better user experience
			dispatch({
				type: Actions?.UPDATE_THEME,
				payload: themeValue,
			});
			document?.documentElement?.setAttribute('theme', themeValue);
			Cookies?.set('theme', themeValue);
			localStorage?.setItem('theme', themeValue);

			const path = '/tenant-user';
			const body = {
				theme: themeValue,
			};
			const token = localStorage?.getItem('usertoken');
			const type = 'auth';

			const response = await Service?.fetchPut(path, body, token, type);
			const success = response?.[0];
			if (success) {
				return [true];
			}
			return [false];
		} catch (error) {
			console.error('Error updating theme:', error);
		}
	};

	return {
		...state,
		updateTheme,
	};
};
