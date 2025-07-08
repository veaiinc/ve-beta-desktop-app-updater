import { Routes, Route } from 'react-router-dom';
import useWorkspaceMode from './hooks/useWorkspaceMode';

const App = () => {
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
