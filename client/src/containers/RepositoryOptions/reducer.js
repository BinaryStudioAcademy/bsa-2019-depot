import { fetchRepoSettings } from '../../routines/routines';

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
  case fetchRepoSettings.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchRepoSettings.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};
