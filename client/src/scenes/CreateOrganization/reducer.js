import { createOrg } from '../../routines/routines';

const initialState = {
  company: null,
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case createOrg.TRIGGER:
    return { ...state, company: null, loading: true, error: null };
  case createOrg.SUCCESS:
    return { ...state, company: action.payload };
  case createOrg.FAILURE:
    return { ...state, error: action.payload };
  case createOrg.FULFILL:
    return { ...state, loading: false };
  default:
    return state;
  }
};
