import { loginRoutine, fillProfileRoutine, setUsernameRoutine } from '../../routines/routines';

const initialState = {
    loading: false,
    isAuthorized: false,
    error: null,
    profile: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case loginRoutine.REQUEST: {
        return {
            ...state,
            loading: true,
            error: null
        };
    }
    case loginRoutine.SUCCESS:
        return {
            ...state,
            isAuthorized: true
        };
    case loginRoutine.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case loginRoutine.FULFILL:
        return {
            ...state,
            loading: false
        };

    case fillProfileRoutine.REQUEST: {
        const { profile } = action.payload;
        return {
            ...state,
            profile
        };
    }

    case setUsernameRoutine.REQUEST:
        return {
            ...state,
            loading: true
        };
    case setUsernameRoutine.SUCCESS:
        const { profile } = state;
        const { username } = action.payload;
        return {
            ...state,
            profile: {
                ...profile,
                username,
                usernameExists: true
            }
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
