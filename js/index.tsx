import ReactDOM from 'react-dom';
import React from 'react';
import { App } from './app';
import "../css/app.css";

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App/>);