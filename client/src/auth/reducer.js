import { AUTHENTICATE_SUCCESS } from './actionTypes';

const initialState = {
    isAuthenticated: false,
    user: null
};

export default function(state = initialState, action) {
    switch (action.type) {
    case AUTHENTICATE_SUCCESS: {
        return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    default:
        return state;
    }
}
