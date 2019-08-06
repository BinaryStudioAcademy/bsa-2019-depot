import { AUTHENTICATE_SUCCESS } from './actionTypes';

const initialState = {
    isAuthenticated: false
};

export default function(state = initialState, action) {
    switch (action.type) {
    case AUTHENTICATE_SUCCESS: {
        return { ...state, isAuthenticated: true };
    }

    default:
        return state;
    }
}
