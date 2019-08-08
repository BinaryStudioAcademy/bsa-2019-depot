import { signupRoutine, googleSignupRoutine, setUsernameRoutine } from '../../routines/routines';

export const signup = ({ user, history }) =>
    signupRoutine.request({
        user,
        history
    });

export const googleSignup = () => googleSignupRoutine.request({});
export const setUsername = ({ username, history }) => setUsernameRoutine.request({ username, history });
