import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { useEffect } from 'react';

function App() {
	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		document.getElementsByTagName('html')[0].classList.add('theme-dark');
	}, []);

	return (
		<>
			<Routes>
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route?.path}
						element={route?.component}
						exact={route?.exact}
					/>
				))}
			</Routes>
		</>
	);
}

export default App;
