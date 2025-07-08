// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';
import { Suspense } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<BrowserRouter>
			<Suspense fallback={<p>loading</p>}>
				<App />
			</Suspense>
		</BrowserRouter>
	</ContextState>,
);