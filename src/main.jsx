import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextState from './context/ContextStates';
import './assets/fonts/Inter/inter.css';
import './assets/fonts/Manrope/manrope.css';
import './assets/fonts/HelveticaNeue/helvetica.css';
import './assets/fonts/PlayfairDisplay/playfairdisplay.css';
// import './assets/fonts/TNY_Adobe_Caslon_Pro_Regular/calson.css';
import './assets/scss/global.scss';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ContextState>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ContextState>,
);
