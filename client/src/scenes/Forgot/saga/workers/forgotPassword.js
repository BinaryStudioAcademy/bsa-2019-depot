//Core
import { put, apply } from 'redux-saga/effects';

// Instruments
import { forgotActions } from '../../../Forgot/actions';
import * as userService from '../../../../services/userService';

export function* forgotPassword({ payload }) {
    try {
    //console.log('payload', payload);
        const response = yield apply(userService, userService.forgot, [payload]);
        // const profile = yield apply(response, response.json);

        if (response.status !== 200) {
            yield put(forgotActions.emailNotExist());
            throw new Error(response.message);
        }

        yield put(forgotActions.emailSend());
    } catch (error) {
        throw new Error(error + ' forgotPassword worker');
    }
}
