import React from "react";

import { Wrapper } from "./style";
import { Login } from "features/authentication/Login/Login";
import { ChatUI } from "features/chat/Chat";
import { isUserLoggedIn } from "features/authentication/authenticationModel";
import { useSelector } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/room-service-client";
// import { FlexColumn } from "foundations/components/layout";

/* const ErrorBannerComponent = (
  <FlexColumn
    bg="error"
    color="onPrimary"
    padding="3"
    justifyContent="center"
    alignItems="center"
  >
    <p>Please run</p>
    <pre>npm setup</pre>
  </FlexColumn>
); */

const renderAppComponent = () => (
  <ApolloProvider client={client}>
    <ChatUI />
  </ApolloProvider>
);

export const ApplicationRouter = () => {
  const loggedIn = useSelector(isUserLoggedIn);
  const view = loggedIn ? renderAppComponent() : <Login />;
  return <Wrapper>{view}</Wrapper>;
};
