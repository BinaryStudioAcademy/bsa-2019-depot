import { all } from 'redux-saga/effects';

// import sagasA from '../containers/ContainerA/sagasA'

export default function* rootSaga() {
    yield all([
    /*
        sagasA(),
        sagasB(),
        ...
      */
    ]);
}
