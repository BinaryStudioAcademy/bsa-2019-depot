import { takeEvery, put, all, call } from 'redux-saga/effects';
import { createOrg } from '../../routines/routines';
import * as orgService from '../../services/orgService';

function* createOrganization({ payload }) {
  try {
    yield put(createOrg.request());

    const response = yield call(orgService.create, payload);

    if (response.status) {
      yield put(createOrg.success(response.profile.username));
    } else {
      yield put(createOrg.failure(response.error));
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
