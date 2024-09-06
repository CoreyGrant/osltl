import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import {store} from './store/store';

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<Provider store={store}><App/></Provider>);