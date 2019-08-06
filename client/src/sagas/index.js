import { call, all } from 'redux-saga/effects';

//Watchers

import { watchAuth } from '../sagas/auth/saga/watchers';

export default function* rootSaga() {
    yield all([call(watchAuth)]);
}
