import { signupRoutine, googleSignupRoutine } from '../../routines/routines';

const initialState = {
    loading: false,
    user: null,
    error: ''
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
        return {
            state
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
    default:
        return state;
    }
};
