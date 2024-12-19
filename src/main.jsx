import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import { StateProvider } from './context/StateProvider.jsx';
import { initialState } from './context/initialState.js';
import { reducer } from './context/reducer.js';

createRoot(document.getElementById('root')).render(
  <StateProvider initialState={initialState} reducer={reducer} >
    <Router>
      <App />
    </Router>
  </StateProvider>
)
