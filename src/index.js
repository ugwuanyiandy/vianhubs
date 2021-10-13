import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './assets/css/App.css';
import App from './App';
import {Provider} from 'react-redux';
import Endpoint from "./utils/endpoint";
import store from "./redux/store";
import {validateCart} from "./utils/cart";
import {handleAxiosError, setReduxState} from "./utils/helpers";
import {stateKeys} from "./redux/actions";

//Setup endpoint configurations
Endpoint.init();

//Load defaults
validateCart()
// load Services
Endpoint.getShopServices()
    .then(xhr => setReduxState(xhr.data.data, stateKeys.SERVICES))
    .catch(e => handleAxiosError(e));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

