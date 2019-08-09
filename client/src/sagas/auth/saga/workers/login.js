//Core
import { put, apply } from 'redux-saga/effects';

// Instruments
import { authActions } from '../../../auth/actions';
import { profileActions } from '../../../profile/actions';
import * as authService from '../../../../services/authService';

export function* login({ payload }) {
    try {
        const response = yield apply(authService, authService.login, [payload]);
        const profile = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        yield apply(localStorage, localStorage.setItem, ['token', profile.token]);

        yield put(profileActions.fillProfile(profile.user));
        yield put(authActions.authenticate());
    } catch (error) {
        throw new Error(error + ' login worker');
    }
}