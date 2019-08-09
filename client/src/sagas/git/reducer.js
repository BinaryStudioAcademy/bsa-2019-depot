//Types
import { types } from './types';

const initialState = {
    repositoriesNames: []
};

export const repositoriesReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.FILL_REPOSITORIES:
        return {
            ...state,
            repositoriesNames: [...action.payload]
        };
    default:
        return state;
    }
};
