import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import DynamicIslandUI from './components/DynamicIslandUI';
import NotchDropUI from './components/NotchDropUI';
import NotchDropLatestUI from './components/NotchDropLatestUI';
import ContextState from '../context/ContextStates';

// Main App component that decides which UI to show
// const App = () => {
// 	const [uiMode, setUiMode] = useState('notchdrop-latest'); // 'notchdrop-latest', 'notchdrop', or 'dynamic-island'

// 	useEffect(() => {
// 		// Check URL parameters or local storage to determine UI mode
// 		const urlParams = new URLSearchParams(window.location.search);
// 		const mode =
// 			urlParams.get('mode') || localStorage.getItem('notch-ui-mode') || 'notchdrop-latest';
// 		setUiMode(mode);

// 		// Listen for mode changes from Electron
// 		if (window.electronAPI?.notchdrop) {
// 			// Could add IPC listener here for mode switching
// 		}
// 	}, []);

// 	// Render the appropriate UI based on mode
// 	switch (uiMode) {
// 		case 'dynamic-island':
// 			return ;
// 		case 'notchdrop':
// 			return <NotchDropUI />;
// 		case 'notchdrop-latest':
// 		default:
// 			return <NotchDropLatestUI />;
// 	}
// };

const root = ReactDOM.createRoot(document.getElementById('dynamic-island-root'));
root.render(
	<React.StrictMode>
		<ContextState>
			<DynamicIslandUI />
		</ContextState>
	</React.StrictMode>,
);
