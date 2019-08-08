import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/index';
import rootSaga from './sagas/index';

import { createLogger } from 'redux-logger'; //TODO need to remove

const logger = createLogger({
    duration: true,
    collapsed: true,
    colors: {
        title: () => '#139BFE',
        prevstate: () => '#1C5FAF',
        action: () => '#149945',
        nextState: () => '#A47104',
        error: () => '#FF0005'
    }
}); //TODO need to remove

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

///

const middlewares = [sagaMiddleware, logger];
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));
/////TODO need to remove

//export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);
