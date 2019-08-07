import { signupRoutine, googleSignupRoutine } from '../../routines/routines';

export const signup = ({ user, history }) =>
    signupRoutine.request({
        user,
        history
    });

export const googleSignup = () => googleSignupRoutine.request({});
