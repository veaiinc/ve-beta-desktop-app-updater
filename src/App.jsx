import { Routes, Route } from 'react-router-dom';
import useWorkspaceMode from './hooks/useWorkspaceMode';
import CustomToast from './views/components/globalComponents/CustomToast';

const App = () => {
	const { routes } = useWorkspaceMode();

	return (
		<>
			<CustomToast />
			<Routes>
				{routes?.map((route) => (
					<Route key={route.path} path={route.path} element={route.element} />
				))}
			</Routes>
		</>
	);
};

export default App;
