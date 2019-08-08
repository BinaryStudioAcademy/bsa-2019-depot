//Core
import { put, apply } from 'redux-saga/effects';

// Instruments
import { forgotActions } from '../../../Forgot/actions';
import * as userService from '../../../../services/userService';

export function* forgotPassword({ payload }) {
    try {
        const response = yield apply(userService, userService.forgot, [payload]);
        if (response.failure) {
            yield put(forgotActions.emailNotExist(response.failure));
            return;
        }

        yield put(forgotActions.emailSend(response.success));
    } catch (error) {
        throw new Error(error + ' forgotPassword worker');
    }
}
