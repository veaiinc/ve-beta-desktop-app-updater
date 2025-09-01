import { useCallback, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import Context from '../context/context';

const useTheme = () => {
	const { pathname } = useLocation();
	const {
		themeInfo: { theme },
	} = useContext(Context);

	useEffect(() => {
		const themePreference = getThemePreference();
		let themeAttribute = themePreference;

		if (themePreference === 'systemDefault') {
			themeAttribute = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		}

		const htmlElement = document.documentElement;

		if (pathname.startsWith('/builder')) {
			htmlElement.removeAttribute('theme');
		} else {
			htmlElement.setAttribute('theme', themeAttribute);
		}

		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			htmlElement.classList.add('macos');
		} else {
			htmlElement.classList.add('otheros');
		}
	}, [pathname, theme]);

	const getThemePreference = useCallback(() => {
		if (pathname.startsWith('/builder')) return 'light';
		return theme || localStorage?.getItem('theme') || Cookies.get('theme') || 'light';
	}, [pathname, theme]);

	return theme;
};

export default useTheme;
