import { takeEvery, put, call, all, apply } from 'redux-saga/effects';
import * as authService from '../../services/authService';

import storageHelper from '../../helpers/storageHelper';

import {
  authorizeUser,
  fetchCurrentUser,
  signupRoutine,
  loginGoogleRoutine,
  setUsernameRoutine
} from '../../routines/routines';

function* authorizationRequest({ payload }) {
  try {
    yield put(authorizeUser.request());
    const response = yield call(authService.login, payload);
    yield apply(storageHelper, storageHelper.set, ['token', response.token]);
    delete response.user.password;
    yield put(authorizeUser.success(response.user));
  } catch (error) {
    yield put(authorizeUser.failure(error.message));
  } finally {
    yield put(authorizeUser.fulfill());
  }
}

function* watchAuthorizationRequest() {
  yield takeEvery(authorizeUser.TRIGGER, authorizationRequest);
}

function* currentUserRequest() {
  try {
    yield put(fetchCurrentUser.request());

    if (storageHelper.get('token')) {
      const response = yield call(authService.getCurrentUser);

      yield put(fetchCurrentUser.success(response));
    }
  } catch (error) {
    yield put(fetchCurrentUser.failure(error.message));
  } finally {
    yield put(fetchCurrentUser.fulfill());
  }
}

function* watchCurrentUserRequest() {
  yield takeEvery(fetchCurrentUser.TRIGGER, currentUserRequest);
}

function* loginGoogle({ payload }) {
  try {
    yield put(loginGoogleRoutine.request());
    const user = yield call(authService.googleSignup, payload);
    yield apply(storageHelper, storageHelper.set, ['token', user.token]);
    delete user.password;
    yield put(loginGoogleRoutine.success(user));
  } catch (error) {
    yield put(loginGoogleRoutine.failure(error.message));
  } finally {
    yield put(fetchCurrentUser.fulfill());
  }
}

function* watchLoginGoogleRequest() {
  yield takeEvery(loginGoogleRoutine.TRIGGER, loginGoogle);
}

function* signup({ payload: { user } }) {
  try {
    yield put(signupRoutine.request());
    const response = yield call(authService.signup, user);
    const { token } = response;

    yield apply(storageHelper, storageHelper.set, ['token', token]);
    yield put(signupRoutine.success(response.user));
  } catch (error) {
    yield put(signupRoutine.failure(error.message));
  } finally {
    yield put(signupRoutine.fulfill());
  }
}

function* watchSignupRequest() {
  yield takeEvery(signupRoutine.TRIGGER, signup);
}

function* setUsername({ payload: { username, user } }) {
  try {
    yield put(setUsernameRoutine.request());
    const response = yield call(authService.setUsername, username, user);
    const { status } = response;
    if (status) {
      yield put(setUsernameRoutine.success(username));
    } else {
      yield put(setUsernameRoutine.failure(response.errorMessage));
    }
  } catch (error) {
    yield put(setUsernameRoutine.failure(error.message));
  } finally {
    yield put(setUsernameRoutine.fulfill());
  }
}

function* watchSetUsernameRequest() {
  yield takeEvery(setUsernameRoutine.TRIGGER, setUsername);
}

export default function* profileSagas() {
  yield all([
    watchAuthorizationRequest(),
    watchCurrentUserRequest(),
    watchSignupRequest(),
    watchLoginGoogleRequest(),
    watchSetUsernameRequest()
  ]);
}
