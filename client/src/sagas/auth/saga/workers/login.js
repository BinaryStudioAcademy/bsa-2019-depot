//Core
import { put, call, apply } from 'redux-saga/effects';

// Instruments
import { authActions } from '../../../auth/actions';
import { profileActions } from '../../../profile/actions';
import * as authService from '../../../../services/authService';

export function* login({ payload }) {
    try {
        const response = yield call(authService.login, payload);
        const profile = yield apply(response, response.json);

        // if (response.status !== 200) {
        //     throw new Error(response.message);
        // }

        yield apply(localStorage, localStorage.setItem, ['token', profile.token]);

        yield put(profileActions.fillProfile(profile.user));
        yield put(authActions.authorize());
    } catch (error) {
    // throw new Error(error + ' login worker');
        yield put(authActions.loginFailure, error);
    }
}
