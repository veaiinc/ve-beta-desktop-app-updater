import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import Context from './context/context';
import CustomToast from './views/components/globalComponents/CustomToast';
import useWorkspaceMode from './views/hooks/useWorkspaceMode';
import Spinner from './views/components/loaders/Spinner';

const App = () => {
	const { pathname } = useLocation();
	const { loading, routes } = useWorkspaceMode();

	const {
		themeInfo: { theme },
	} = useContext(Context);

	const getThemePreference = () => {
		if (pathname.startsWith('builder')) {
			return 'light';
		}
		if (pathname === '/') {
			return 'dark';
		}
		return theme || localStorage?.getItem('theme') || Cookies.get('theme') || 'dark';
	};

	const themePreference = getThemePreference();

	let themeAttribute = themePreference;
	if (themePreference === 'systemDefault') {
		themeAttribute = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}

	useEffect(() => {
		const htmlElement = document.documentElement;
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			htmlElement.classList.add('macos');
		} else {
			htmlElement.classList.add('otheros');
		}
		if (pathname.startsWith('/builder')) {
			htmlElement.removeAttribute('theme');
		} else {
			htmlElement.setAttribute('theme', themeAttribute);
		}
	}, [theme]);

	return loading ? (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner width={32} height={32} />
		</div>
	) : (
		<>
			<Routes>
				{routes?.map((route, index) => (
					<Route
						key={index}
						path={route?.path}
						element={route?.element}
						exact={route?.exact}
					/>
				))}
			</Routes>
			<CustomToast />
		</>
	);
};

export default App;
