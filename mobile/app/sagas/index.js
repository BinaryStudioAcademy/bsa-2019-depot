import { all } from 'redux-saga/effects';
import profileSagas from '../views/AuthViews/sagas';

export default function* rootSaga() {
  yield all([profileSagas()]);
}
