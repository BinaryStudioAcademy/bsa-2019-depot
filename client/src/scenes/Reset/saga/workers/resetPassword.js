import { put, apply } from 'redux-saga/effects';
import { resetActions } from '../../../Reset/actions';
import * as userService from '../../../../services/userService';

export function* resetPassword({ payload }) {
    try {
        const response = yield apply(userService, userService.reset, [payload]);
        if (response.failure) {
            yield put(resetActions.passwordNotReset(response.failure));
            return;
        }

        yield put(resetActions.passwordReset(response.success));
    } catch (error) {
        throw new Error(error + ' forgotPassword worker');
    }
}
