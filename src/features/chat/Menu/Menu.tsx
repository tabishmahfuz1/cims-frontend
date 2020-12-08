import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getViewStates } from "features/layout/Selectors";
import { MyConversations } from "features/joinedConversations/MyConversations/MyConversations";
import { ThemeContext } from "styled-components";
import { useMediaQuery } from "foundations/hooks/useMediaQuery";
// import { MyUserDetails } from "features/currentUser/MyUserDetails";
import { getUniqueColor, getInitials } from "foundations/utilities";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
import { menuViewHidden } from "features/layout/LayoutActions";
import { Avatar, AvatarVariants } from "foundations/components/chat";
import {
  Icon,
  Icons,
  Heading,
  HeadingVariants
} from "foundations/components/presentation";
import {
  Drawer,
  StyledBox,
  FlexRow,
  FlexColumn
} from "foundations/components/layout";

const Menu = () => {
  const views = useSelector(getViewStates);
  const userId = useSelector(getLoggedInUserId);
  const theme = useContext(ThemeContext);
  const isMedium = useMediaQuery(theme.mediaQueries.medium);
  const dispatch = useDispatch();

  return (
    <Drawer
      open={views.Menu || isMedium}
      background={theme.backgrounds.primary}
    >
      <StyledBox
        position="absolute"
        right="0"
        padding="6"
        display={["block", "none"]}
      >
        <Icon
          onClick={() => dispatch(menuViewHidden())}
          icon={Icons.Cross}
          title="Close conversations"
          color={theme.colors.onPrimary}
          clickable
        />
      </StyledBox>

      <StyledBox padding={6}>
        <FlexRow>
          {/* <Icon icon={Icons.Logo} title="CIMS" /> */}
          <Avatar
            variant={AvatarVariants.ROUND}
            bg={getUniqueColor(
              userId,
              (theme.colors.avatars as any) as string[]
            )}
          >
            {getInitials(userId)}
          </Avatar>
          <StyledBox paddingLeft={4}>
            <FlexColumn minHeight={1}>
              <Heading variant={HeadingVariants.INVERSE}>
                {/* {theme.custom.companyName} */}
                {userId.split("@")[0]}
              </Heading>
              {/* <MyUserDetails /> */}
            </FlexColumn>
          </StyledBox>
        </FlexRow>
      </StyledBox>

      <MyConversations />
    </Drawer>
  );
};

export { Menu };
