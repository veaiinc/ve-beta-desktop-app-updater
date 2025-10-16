import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import ContextState from './context/ContextStates';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<HashRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true
			}}
		>
			<App />
		</HashRouter>
	</ContextState>,
);
