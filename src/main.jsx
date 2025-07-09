import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';
import ErrorBoundary from './views/components/globalComponents/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ErrorBoundary>
		<ContextState>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ContextState>
	</ErrorBoundary>,
);
