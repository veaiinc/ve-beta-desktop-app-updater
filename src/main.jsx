import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';
import { Suspense } from 'react';
import PageLoader from './views/features/app/PageLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<BrowserRouter>
			<Suspense fallback={<PageLoader />}>
				<App />
			</Suspense>
		</BrowserRouter>
	</ContextState>,
);
