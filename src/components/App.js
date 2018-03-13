import React, {Component} from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from '../reducers';

import SignIn from './SignIn';

export default class App extends Component {
  render(){
    const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
    const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
  }
}