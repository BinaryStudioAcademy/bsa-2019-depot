import { authorizeUser, fetchCurrentUser, signupRoutine } from '../../routines/routines';

const initialState = {
    currentUser: {},
    loading: false,
    error: null,
    isAuthorized: false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case authorizeUser.TRIGGER:
    case fetchCurrentUser.TRIGGER:
    case signupRoutine.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case authorizeUser.SUCCESS:
    case fetchCurrentUser.SUCCESS:
    case signupRoutine.SUCCESS:
        return {
            ...state,
            currentUser: action.payload,
            isAuthorized: true
        };
    case authorizeUser.FAILURE:
    case fetchCurrentUser.FAILURE:
    case signupRoutine.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case authorizeUser.FULFILL:
    case fetchCurrentUser.FULFILL:
    case signupRoutine.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
