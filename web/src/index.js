import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'antd'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'; //devToolsEnhancer,
import {applyMiddleware, combineReducers, createStore} from 'redux'
import BaseFrame from './App';
import {loginReducer} from './redux/auth/reducers'
import {popoverReducer} from './redux/ui/avatarAffix/reducers'
import {modalReducer} from './redux/ui/baseFrame/reducers'
import {siderReducer} from './redux/ui/frameSider/reducers'
import {orderReducer} from "./redux/order/reducers";
import {showReducer} from "./redux/show/reducers";
import {routeReducer} from "./redux/ui/reducers";
import {couponInfoReducer} from "./redux/couponInfo/reducers";
import {publicInfoReducer} from "./redux/publicInfo/reducers";
import registerServiceWorker from './registerServiceWorker';

const middleware = [thunk];

const reducers = combineReducers({
    loginReducer,
    popoverReducer,
    modalReducer,
    siderReducer,
    orderReducer,
    showReducer,
    routeReducer,
    couponInfoReducer,
    publicInfoReducer,
});

let store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));

const Ch1 = Form.create()(BaseFrame);

ReactDOM.render(
    <Provider store={store}>
        <Ch1/>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();