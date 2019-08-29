import {
  authorizeUser,
  fetchCurrentUser,
  signupRoutine,
  loginGoogleRoutine,
  setUsernameRoutine
} from '../../routines/routines';

const initialState = {
  currentUser: {},
  loading: true,
  error: null,
  isAuthorized: false
};

export default (state = initialState, action) => {
  switch (action.type) {
  case authorizeUser.TRIGGER:
  case fetchCurrentUser.TRIGGER:
  case signupRoutine.TRIGGER:
  case setUsernameRoutine.TRIGGER:
  case loginGoogleRoutine.TRIGGER:
    return {
      ...state,
      loading: true,
      error: null,
      signupError: null
    };
  case authorizeUser.SUCCESS:
  case fetchCurrentUser.SUCCESS:
  case signupRoutine.SUCCESS:
  case loginGoogleRoutine.SUCCESS:
    return {
      ...state,
      currentUser: action.payload,
      isAuthorized: true
    };
  case setUsernameRoutine.SUCCESS: {
    const { currentUser } = state;
    return {
      ...state,
      currentUser: {
        ...currentUser,
        username: action.payload
      }
    };
  }
  case authorizeUser.FAILURE:
  case fetchCurrentUser.FAILURE:
  case setUsernameRoutine.FAILURE: {
    return {
      ...state,
      isAuthorized: false,
      error: action.payload
    };
  }
  case signupRoutine.FAILURE:
    return {
      ...state,
      signupError: action.payload
    };
  case authorizeUser.FULFILL:
  case fetchCurrentUser.FULFILL:
  case signupRoutine.FULFILL:
  case setUsernameRoutine.FULFILL:
  case loginGoogleRoutine.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};
