import React from 'react';
import ReactDOM from 'react-dom/client';
import OverlayApp from './OverlayApp';

// Create root and render the overlay app
const root = ReactDOM.createRoot(document.getElementById('overlay-root'));
root.render(
	<React.StrictMode>
		<OverlayApp />
	</React.StrictMode>
);