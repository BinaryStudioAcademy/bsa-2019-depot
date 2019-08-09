import { loginRoutine, fillProfileRoutine } from '../../routines/routines';

export const login = ({ username, password, history }) =>
    loginRoutine.request({
        username,
        password,
        history
    });

export const fillProfile = ({ profile }) => {
    fillProfileRoutine.request({
        profile
    });
};
