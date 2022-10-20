import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';

const trackingId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
if (trackingId !== null) {
    ReactGA.initialize(trackingId);
}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

