import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'antd'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'; //devToolsEnhancer,
import {applyMiddleware, combineReducers, createStore} from 'redux'
import BaseFrame from './App';
import Child from './component/Child'
import {loginReducer} from './redux/auth/reducers'
import {popoverReducer} from './redux/ui/avatarAffix/reducers'
import {modalReducer} from './redux/ui/baseFrame/reducers'
import registerServiceWorker from './registerServiceWorker';

const middleware = [thunk];

const reducers = combineReducers({
    loginReducer,
    popoverReducer,
    modalReducer,
});

let store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));

const Ch1 = Form.create()(BaseFrame(Child));

ReactDOM.render(
    <Provider store={store}>
        <Ch1/>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();