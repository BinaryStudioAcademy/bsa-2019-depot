import { createRepository, checkRepoName } from '../../routines/routines';

export const statusOptions = {
    createAllowed: 'CREATE_ALLOWED',
    createDisallowed: 'CREATE_DISALLOWED',
    creating: 'CREATING',
    created: 'CREATED'
};

export const checkNameOptions = {
    checking: 'CHECKING',
    error: 'ERROR',
    checked: 'CHECKED'
};

const initialState = {
    status: statusOptions.createDisallowed
};

export default (state = initialState, action) => {
    switch (action.type) {
    case createRepository.TRIGGER:
        return {
            ...state,
            status: statusOptions.creating
        };

    case createRepository.FULFILL:
        return {
            status: statusOptions.createDisallowed
        };

    case checkRepoName.TRIGGER:
        return {
            ...state,
            isValid: checkNameOptions.checking
        };

    case checkRepoName.SUCCESS:
        const { payload: { exists } } = action;
        const isValid = exists ? checkNameOptions.error : checkNameOptions.checked;
        const status = isValid ? statusOptions.createAllowed : statusOptions.createDisallowed;

        return {
            ...state,
            isValid,
            status
        };

    default:
        return state;
    }
};
