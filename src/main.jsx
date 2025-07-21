import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import ContextState from './context/ContextStates';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<HashRouter>
			<App />
		</HashRouter>
	</ContextState>,
);
