import { fetchDiffs } from '../../routines/routines';

const initialDiffsState = {
  diffs: '',
  loading: false,
  error: null
};

export const diffsData = (state = initialDiffsState, action) => {
  switch (action.type) {
    case fetchDiffs.TRIGGER:
      return {
        ...state,
        loading: true
      };
    case fetchDiffs.SUCCESS:
      return {
        ...state,
        diffs: action.payload.diffs
      };
    case fetchDiffs.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchDiffs.FULFILL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
