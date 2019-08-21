import { fetchDiffs } from '../../routines/routines';

const initialDiffsState = {
  diffs: '',
  id: null,
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
    const { diffs, id } = action.payload;
    return {
      ...state,
      diffs,
      id
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
