import { fetchRepoSettings } from '../../routines/routines';
import { postRepoSettings } from '../../routines/routines';

const initialSettingsState = {
    settings: {
        isPublic: true,
        name: '',
        owner: ''
    },
    loading: false,
    error: null
};

export const repoSettingsData = (state = initialSettingsState, action) => {
    switch (action.type) {
    case fetchRepoSettings.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchRepoSettings.SUCCESS:
        return {
            ...state,
            settings: { ...action.payload }
        };
    case postRepoSettings.SUCCESS:
        return {
            ...state,
            settings: action.payload
        };
    case fetchRepoSettings.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchRepoSettings.POST:
        return {
            ...state,
            settings: action.payload
        };
    case fetchRepoSettings.FULFILL:
        return {
            ...state,
            loading: false
        };
    case postRepoSettings.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
