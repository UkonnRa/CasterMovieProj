import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; //devToolsEnhancer,
import { applyMiddleware, combineReducers, createStore } from 'redux';
import BaseFrame from './App';
import { loginReducer } from './redux/auth/reducers';
import { siderReducer } from './redux/ui/frameSider/reducers';
import { orderReducer } from './redux/order/reducers';
import { showReducer } from './redux/show/reducers';
import { routeReducer } from './redux/ui/reducers';
import { couponInfoReducer } from './redux/couponInfo/reducers';
import { publicInfoReducer } from './redux/publicInfo/reducers';
import { theaterReducer } from './redux/theater/reducers';
import entryFormReducer from './redux/entry/reducers';
import registerServiceWorker from './registerServiceWorker';

const middleware = [thunk];

const reducers = combineReducers({
    loginReducer,
    siderReducer,
    orderReducer,
    showReducer,
    routeReducer,
    couponInfoReducer,
    publicInfoReducer,
    theaterReducer,
    entryFormReducer
});

let store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render(
    <Provider store={store}>
        <BaseFrame />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();