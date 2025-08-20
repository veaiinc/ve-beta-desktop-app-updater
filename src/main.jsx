import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';
import ErrorBoundary from './views/components/errorBoundary/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<ContextState>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</ContextState>
	</BrowserRouter>,
);
