import React from 'react';
import ReactDOM from 'react-dom/client';
import AreYouThereApp from './AreYouThereApp';
import './areYouThere.scss';

const root = ReactDOM.createRoot(document.getElementById('are-you-there-root'));
root.render(
	<React.StrictMode>
		<AreYouThereApp />
	</React.StrictMode>,
);
