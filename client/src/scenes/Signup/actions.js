import { signupRoutine } from '../../routines/routines';

export const signup = ({ user, history }) =>
    signupRoutine.request({
        user,
        history
    });
