import { put, apply } from 'redux-saga/effects';

import { forgotActions } from '../../../Forgot/actions';
import * as userService from '../../../../services/userService';

export function* forgotPassword({ payload }) {
  try {
    const response = yield apply(userService, userService.forgot, [payload]);
    if (response.status !== 200) {
      yield put(forgotActions.emailNotExist(response.message));
      return;
    }

    yield put(forgotActions.emailSend(response.message));
  } catch (error) {
    throw new Error(error + ' forgotPassword worker');
  }
}
