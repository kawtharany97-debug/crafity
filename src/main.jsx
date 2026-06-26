import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This points to your new Traffic Controller
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
    <App />
</HelmetProvider>
</React.StrictMode>

);