import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // HttpLink,
  ApolloLink
} from "@apollo/client";
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
import { setContext } from "@apollo/link-context";
import { onError } from "@apollo/link-error";
import { createUploadLink } from "apollo-upload-client";
// import { ApolloLink } from 'apollo-link';
import { ROOM_SERVICE } from "../config/api-urls";
import { logout } from "../features/authentication/authenticationModel";
import { store } from "../main/App";

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  console.log({ graphQLErrors, networkError });
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      if (extensions && extensions.code === "UNAUTHENTICATED") {
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // if (response && response.errors) response.errors = null;
        store.dispatch(logout());
        // Find a way to dispatch the logout event here
        // logout();
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      return null;
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);

  // console.log(`Service URL: ${ROOM_SERVICE}`);
});

const cache = new InMemoryCache();
console.log("srch lin", ROOM_SERVICE);
// const httpLink = new HttpLink({
//     uri: `${ROOM_SERVICE}/graphql`
//     // uri: `/backend/graphql`
// });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // console.log(auth.apiToken)
  const token = localStorage.getItem("token");
  console.log("using Token", token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const fileUploadLink = createUploadLink({
  uri: `${ROOM_SERVICE}/graphql`
});

// console.log("Graphql Client Called")

export default new ApolloClient({
  cache,
  link: ApolloLink.from([
    errorLink,
    // httpLink,
    authLink.concat(fileUploadLink)
  ])
});
