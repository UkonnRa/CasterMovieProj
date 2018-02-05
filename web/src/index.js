import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd'
import frame from './App';
import Child from './component/Child'
import registerServiceWorker from './registerServiceWorker';

const Ch1 = Form.create()(frame(Child))

ReactDOM.render( < Ch1 / > , document.getElementById('root'));
registerServiceWorker();