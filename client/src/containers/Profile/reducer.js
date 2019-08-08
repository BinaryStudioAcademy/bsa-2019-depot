import { fetchCurrentUser } from '../../routines/routines';

const initialState = {
    currentUser: {},
    loading: false,
    error: null,
    isAuthorized: false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case fetchCurrentUser.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchCurrentUser.SUCCESS:
        return {
            ...state,
            currentUser: action.payload,
            isAuthorized: true
        };
    case fetchCurrentUser.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchCurrentUser.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
