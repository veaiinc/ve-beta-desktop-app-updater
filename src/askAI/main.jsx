import React from 'react';
import ReactDOM from 'react-dom/client';
import AskAIApp from './AskAIApp';
import ContextState from '../context/ContextStates';

// Create root and render the ask AI app
const root = ReactDOM.createRoot(document.getElementById('ask-ai-root'));
root.render(
	<React.StrictMode>
		<ContextState>
			<AskAIApp />
		</ContextState>
	</React.StrictMode>,
);