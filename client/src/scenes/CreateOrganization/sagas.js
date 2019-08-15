import { takeEvery, put, all, call } from 'redux-saga/effects';
import { createOrg } from '../../routines/routines';

const mock = payload => {
  alert(JSON.stringify(payload, null, 2));
  return { status: true, username: 'facebook' };
};

function* createOrganization({ payload }) {
  try {
    yield put(createOrg.request());

    // const response = yield call(userService.updateSettings, payload);
    const response = yield call(mock, payload);
    const { username: company } = response;
    if (response.status) {
      yield put(createOrg.success(company));
    } else {
      yield put(createOrg.failure(response.error.message));
    }
  } catch (error) {
    yield put(createOrg.failure(error.message));
  } finally {
    yield put(createOrg.fulfill());
  }
}

function* watchCreateOrganization() {
  yield takeEvery(createOrg.TRIGGER, createOrganization);
}

export default function* createOrganizationSagas() {
  yield all([watchCreateOrganization()]);
}
