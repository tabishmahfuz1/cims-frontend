import React, { useState, useContext } from "react";
import { useDispatch } from "main/useDispatch";
import image from "./background.png";
import logo from "./logo.svg";
import { login, register } from "../loginCommand";
import {
  isLoggingIn,
  loginHasFailed,
  loginErrorMessage
} from "../authenticationModel";
import { isUserLoggedIn } from "features/authentication/authenticationModel";
import { useSelector } from "react-redux";
// import KnownIds from "config/knownUserIds.json";
import screenshot from "./screenshot.png";
// import { getUsersById } from "features/users/userModel";
import { ThemeContext } from "styled-components";
import { FlexRow, FlexColumn, StyledBox } from "foundations/components/layout";
import {
  Label,
  LabelVariants,
  Heading,
  HeadingSizes,
  HeadingVariants,
  Button,
  ButtonVariants,
  Input,
  InputVariants
} from "foundations/components/presentation";

const Login = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(isLoggingIn);
  const loggedIn = useSelector(isUserLoggedIn);
  const hasFailed = useSelector(loginHasFailed);
  const errorMsg = useSelector(loginErrorMessage);
  const theme = useContext(ThemeContext);
  // show the username in the email field
  // const usersById = useSelector(getUsersById);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  // const user = usersById[userId];

  const onLoginClick = () => {
    if (loggingIn || loggedIn || userId === "" || password === "") {
      return;
    }
    // const randomUserId = KnownIds[Math.floor(Math.random() * KnownIds.length)];
    // setUserId(randomUserId);

    dispatch(login(userId, password));
  };

  const onRegisterClick = () => {
    if (loggingIn || loggedIn || userId === "" || password === "") {
      return;
    }
    // const randomUserId = KnownIds[Math.floor(Math.random() * KnownIds.length)];
    // setUserId(randomUserId);

    dispatch(register(userId, password));
  };

  // if (!loggedIn && !loggingIn) {
  //   onLoginClick();
  // }

  const renderForm = () => (
    <FlexColumn>
      <StyledBox
        height="30px"
        backgroundImage={`url(${logo})`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
      />
      <StyledBox paddingTop="6" paddingBottom="1">
        <Label variant={LabelVariants.DARK}>Email</Label>
      </StyledBox>
      <Input
        onChange={e => setUserId(e.target.value)}
        type="email"
        value={userId}
        variant={InputVariants.DARK}
      />
      <StyledBox paddingTop="6" paddingBottom="1">
        <Label variant={LabelVariants.DARK}>Password</Label>
      </StyledBox>
      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        variant={InputVariants.DARK}
      />

      {hasFailed && (
        <StyledBox paddingTop="6" paddingBottom="1">
          <p style={{ color: "red" }}>{errorMsg}</p>
        </StyledBox>
      )}

      <StyledBox marginTop="8">
        <Button variant={ButtonVariants.PRIMARY} onClick={onLoginClick}>
          {loggingIn ? "Connecting" : "Log In"}
        </Button>
      </StyledBox>
      <StyledBox marginTop="4">
        <h3 style={{ textAlign: "center" }}>Or</h3>
      </StyledBox>
      <StyledBox marginTop="4">
        <Button variant={ButtonVariants.PRIMARY} onClick={onRegisterClick}>
          {loggingIn ? "Connecting" : "Register"}
        </Button>
      </StyledBox>
    </FlexColumn>
  );

  return (
    <FlexColumn
      py={[0, "10vh"]}
      px={[0, "15%"]}
      height="100%"
      backgroundImage={`url(${image})`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <FlexRow alignItems="stretch" flexGrow={1}>
        <FlexColumn
          justifyContent="flex-end"
          display={["none", "none", "flex"]}
          background={theme.backgrounds.login}
          borderTopLeftRadius="strong"
          borderBottomLeftRadius="strong"
          maxWidth="360px"
        >
          <StyledBox px="8" py="2">
            <Heading
              size={HeadingSizes.HUGE}
              variant={HeadingVariants.INVERSE}
              textAlign="center"
            >
              {theme.custom.tagLine}
            </Heading>
          </StyledBox>
          <FlexRow justifyContent="center">
            <img alt="pubnub chat screenshot" src={screenshot} />
          </FlexRow>
        </FlexColumn>

        <FlexRow
          bg="backgrounds.content"
          flexGrow={1}
          justifyContent="center"
          borderRadius={["square", "strong", "strong"]}
          borderTopLeftRadius={["square", "strong", "square"]}
          borderBottomLeftRadius={["square", "strong", "square"]}
        >
          {renderForm()}
        </FlexRow>
      </FlexRow>
    </FlexColumn>
  );
};

export { Login };
