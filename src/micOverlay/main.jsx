import React from 'react';
import ReactDOM from 'react-dom/client';
import MicOverlay from './MicOverlay';
import '../assets/scss/globalColorsAndTheme.scss';

// Create root and render the ask AI app
const root = ReactDOM.createRoot(document.getElementById('mic-root'));
root.render(
	<React.StrictMode>
		<MicOverlay />
	</React.StrictMode>,
);
