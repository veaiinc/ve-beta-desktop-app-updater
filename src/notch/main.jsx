import React from 'react';
import ReactDOM from 'react-dom/client';
import DynamicIslandUI from './components/DynamicIslandUI';
import ContextState from '../context/ContextStates';

// Create root and render the dynamic island app
const root = ReactDOM.createRoot(document.getElementById('dynamic-island-root'));
root.render(
	<React.StrictMode>
		<ContextState>
			<DynamicIslandUI />
		</ContextState>
	</React.StrictMode>,
);
