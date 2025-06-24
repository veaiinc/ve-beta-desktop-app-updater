import { Routes, Route } from 'react-router-dom';
import PageLoader from './views/components/app/PageLoader';
import useTheme from './views/hooks/useTheme';
import useWorkspaceMode from './views/hooks/useWorkspaceMode';

const App = () => {
	useTheme();
	const { loading, routes } = useWorkspaceMode();

	return loading ? (
		<PageLoader />
	) : (
		<Routes>
			{routes?.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={route.element}
					exact={route.exact}
				/>
			))}
		</Routes>
	);
};

export default App;
