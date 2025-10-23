import React from 'react';
import ReactDOM from 'react-dom/client';
import AskAIApp from './AskAIApp';
import ContextState from '../context/ContextStates';
import { HashRouter } from 'react-router-dom';
import '../assets/scss/globalColorsAndTheme.scss';

// Create root and render the ask AI app
const root = ReactDOM.createRoot(document.getElementById('ask-ai-root'));
root.render(
	<React.StrictMode>
		<ContextState>
			<HashRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true
				}}
			>
				<AskAIApp />
			</HashRouter>
		</ContextState>
	</React.StrictMode>,
);
