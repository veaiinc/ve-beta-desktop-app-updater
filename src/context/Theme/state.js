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
			// Dispatch before API call for better UX
			dispatch({ type: Actions.UPDATE_THEME, payload: themeValue });

			const theme =
				themeValue === 'systemDefault'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light'
					: themeValue;

			document.documentElement.setAttribute('theme', theme);
			Cookies.set('theme', theme);
			localStorage.setItem('theme', theme);

			const path = '/tenant-user';
			const body = { theme: themeValue };
			const token = localStorage.getItem('usertoken');
			const type = 'auth';

			const response = await Service.fetchPut(path, body, token, type);

			return [!!response?.[0]];
		} catch (error) {
			console.error('Error updating theme:', error);
			return [false];
		}
	};

	return {
		...state,
		updateTheme,
	};
};
