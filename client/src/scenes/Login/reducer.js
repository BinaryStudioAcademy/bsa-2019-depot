import { loginRoutine, fillProfileRoutine } from '../../routines/routines';

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

    default:
        return state;
    }
};
