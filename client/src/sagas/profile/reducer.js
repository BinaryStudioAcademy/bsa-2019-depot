//Core
import { Map } from 'immutable';

//Types
import { types } from './types';

const initialState = Map({
    id: '',
    username: '',
    email: '',
    token: ''
});

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.FILL_PROFILE:
        return action.payload;
    default:
        return state;
    }
};
