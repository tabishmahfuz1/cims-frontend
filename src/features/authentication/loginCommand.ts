import { ThunkAction } from "main/storeTypes";
import { loggingIn, loginSucceeded, loginFailed } from "./authenticationModel";
// import { getConversationsByUserId } from "features/joinedConversations/joinedConversationModel";
import { AUTH_SERVICE } from "../../config/api-urls";

export const login = (
  email: string,
  password: string
): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    dispatch(loggingIn());

    // Show the login screen for a minimum amount of time as a splash screen
    //const timer = new Promise(resolve => setTimeout(resolve, 2000));

    // ensure that the current user exists while also populating the store
    // with their information.
    return loginAPI(email, password).then(res => {
      if (res.status === "error") {
        // Handle Authentication Error
        dispatch(loginFailed({ code: res.code, message: res.message }));
      } else
        dispatch(loginSucceeded({ userId: email, token: res.response.token }));
    });
  };
};

export const register = (
  email: string,
  password: string
): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    dispatch(loggingIn());

    // Show the login screen for a minimum amount of time as a splash screen
    //const timer = new Promise(resolve => setTimeout(resolve, 2000));

    // ensure that the current user exists while also populating the store
    // with their information.
    return registerAPI(email, password).then(res => {
      if (res.status === "error") {
        // Handle Authentication Error
        dispatch(loginFailed({ code: res.code, message: res.message }));
      } else
        dispatch(loginSucceeded({ userId: email, token: res.response.token }));
    });
  };
};

export const loginAPI = (email: string, password: string) => {
  return fetch(`${AUTH_SERVICE}/login`, {
    method: "post",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
};

export const registerAPI = (email: string, password: string) => {
  return fetch(`${AUTH_SERVICE}/register`, {
    method: "post",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
};
