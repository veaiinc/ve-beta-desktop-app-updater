import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ContextState>,
);
