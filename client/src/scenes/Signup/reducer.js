import { signupRoutine, googleSignupRoutine, setUsernameRoutine } from '../../routines/routines';

const initialState = {
    loading: false,
    user: null,
    error: '',
    shouldSetUsername: true
};

export default (state = initialState, action) => {
    switch (action.type) {
    case googleSignupRoutine.REQUEST: {
        return {
            state,
            loading: true
        };
    }
    case googleSignupRoutine.SUCCESS:
        const { usernameExists } = action.payload;
        return {
            ...state,
            shouldSetUsername: !usernameExists
        };
    case googleSignupRoutine.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case googleSignupRoutine.FULFILL:
        return {
            ...state,
            loading: false
        };

    case signupRoutine.REQUEST:
        return {
            ...state,
            loading: true
        };
    case signupRoutine.SUCCESS:
        return {
            ...state,
            user: action.payload
        };
    case signupRoutine.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case signupRoutine.FULFILL:
        return {
            ...state,
            loading: false
        };

    case setUsernameRoutine.REQUEST:
        return {
            ...state,
            loading: true
        };
    case setUsernameRoutine.SUCCESS:
        return {
            ...state,
            user: action.payload,
            shouldSetUsername: false
        };
    case setUsernameRoutine.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case setUsernameRoutine.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
