import { createSelector } from "reselect";
import invariant from "invariant";
import { AppState } from "main/storeTypes";
import { AppActions } from "main/AppActions";

export const LOGGING_IN = "LOGGIN_IN";
export const LOGOUT = "LOGOUT";
export const LOGIN_SUCCEEDED = "LOGIN_SUCCEEDED";
export const LOGIN_FAILED = "LOGIN_FAILED";

export interface logingInAction {
  type: typeof LOGGING_IN;
}

export interface logoutAction {
  type: typeof LOGOUT;
}

export const loggingIn = (): logingInAction => ({
  type: LOGGING_IN
});

export const logout = (): logoutAction => ({
  type: LOGOUT
});

type loginSucceededPayloadType = {
  userId?: string;
  token: string;
};

type loginFailedPayloadType = {
  code?: string;
  message: string;
};

export interface loginSucceededAction {
  type: typeof LOGIN_SUCCEEDED;
  payload: loginSucceededPayloadType;
}

export interface loginFailedAction {
  type: typeof LOGIN_FAILED;
  payload: loginFailedPayloadType;
}

export const loginFailed = (
  error: loginFailedPayloadType
): loginFailedAction => ({
  type: LOGIN_FAILED,
  payload: error
});

export const loginSucceeded = (
  loginSucceededPayload: loginSucceededPayloadType
): loginSucceededAction => ({
  type: LOGIN_SUCCEEDED,
  payload: loginSucceededPayload
});

export interface AuthenticationState {
  isLoggingIn: boolean;
  userId?: string;
  token?: string;
  hasFailed: boolean;
  code?: string;
  message?: string;
}

const initialState: AuthenticationState = {
  isLoggingIn: false,
  hasFailed: false,
  userId: localStorage.getItem("userId") || undefined,
  token: localStorage.getItem("token") || undefined
};

const AuthenticationStateReducer = (
  state: AuthenticationState = initialState,
  action: AppActions
): AuthenticationState => {
  switch (action.type) {
    case LOGGING_IN: {
      return { ...state, isLoggingIn: true, hasFailed: false };
    }
    case LOGIN_SUCCEEDED: {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId || "");
      return {
        ...state,
        isLoggingIn: false,
        hasFailed: false,
        userId: action.payload.userId,
        token: action.payload.token
      };
    }
    case LOGIN_FAILED: {
      return {
        ...state,
        isLoggingIn: false,
        code: action.payload.code,
        message: action.payload.message,
        hasFailed: true
      };
    }
    case LOGOUT: {
      console.log("[LOGOUT] Removing Auth Info");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      return {
        ...state,
        userId: undefined,
        token: undefined
      };
    }
    default:
      return state;
  }
};

const getAuthenticationStateSlice = (state: AppState) => state.authentication;

export const getLoggedInUserId = createSelector(
  [getAuthenticationStateSlice],
  (authenticationState: AuthenticationState): string => {
    invariant(
      authenticationState.userId !== undefined,
      "getLoggedInUserId should not be used in components of the application that are rendered while there is no logged in user"
    );
    return authenticationState.userId;
  }
);

export const isUserLoggedIn = createSelector(
  getAuthenticationStateSlice,
  (authenticationState: AuthenticationState): boolean => {
    return !!authenticationState.userId;
  }
);

export const isLoggingIn = createSelector(
  getAuthenticationStateSlice,
  (authenticationState: AuthenticationState): boolean => {
    return authenticationState.isLoggingIn;
  }
);

export const loginHasFailed = createSelector(
  getAuthenticationStateSlice,
  (authenticationState: AuthenticationState): boolean => {
    return authenticationState.hasFailed;
  }
);

export const loginErrorMessage = createSelector(
  getAuthenticationStateSlice,
  (authenticationState: AuthenticationState): string => {
    return authenticationState.message || "";
  }
);

export { AuthenticationStateReducer };
