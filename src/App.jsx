import { Routes, Route } from 'react-router-dom';
import useTheme from './views/hooks/useTheme';
import useWorkspaceMode from './views/hooks/useWorkspaceMode';

const App = () => {
	useTheme();
	const { routes } = useWorkspaceMode();

	return (
		<Routes>
			{routes?.map((route) => (
				<Route key={route.path} path={route.path} element={route.element} />
			))}
		</Routes>
	);
};

export default App;
