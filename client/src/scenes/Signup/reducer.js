import { signupRoutine } from '../../routines/routines';

const initialState = {
    loading: false,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case signupRoutine.REQUEST:
        return {
            ...state,
            loading: true
        };
    case signupRoutine.SUCCESS:
        return state;
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
