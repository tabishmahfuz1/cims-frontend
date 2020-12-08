import React, { useEffect, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getViewStates } from "features/layout/Selectors";
// import { UsersIndexedById, getUsersById } from "features/users/userModel";
// import {
//   getUsersByConversationId,
//   MembershipHash
// } from "../conversationMemberModel";
import {
  ConversationsIndexedById,
  getConversationsById
} from "../../conversations/conversationModel";
// import {
//   getPresenceByConversationId,
//   ConversationPresence
// } from "features/memberPresence/memberPresenceModel";
import { MemberDescription, UserFragment } from "../MemberDescription";
import { getCurrentConversationId } from "features/currentConversation/currentConversationModel";

import { Heading, Icon, Icons } from "foundations/components/presentation";
import { Avatar } from "foundations/components/chat";
import {
  ScrollView,
  Drawer,
  StyledBox,
  FlexRow
} from "foundations/components/layout";
import { usePubNub } from "pubnub-react";
import { conversationMembersViewHidden } from "features/layout/LayoutActions";
import { ThemeContext } from "styled-components";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
import { getUniqueColor } from "foundations/utilities";
import { getCurrentConversationDescription } from "features/currentConversation/Header";

export const getCurrentConversationMembers = createSelector(
  [
    // getUsersById,
    getCurrentConversationId,
    getConversationsById
    // getPresenceByConversationId
  ],
  (
    // users: UsersIndexedById,
    conversationId: string,
    conversations: ConversationsIndexedById
    // conversationMemberships: MembershipHash,
    // conversationPresence: ConversationPresence
  ): UserFragment[] => {
    return conversations[conversationId]
      ? conversations[conversationId].members.map(m => ({
          id: m
        }))
      : [];
  }
);

const ConversationMembers = () => {
  const userId = useSelector(getLoggedInUserId);
  const members: UserFragment[] = useSelector(getCurrentConversationMembers);
  const currentConversationId = useSelector(getCurrentConversationId);
  const dispatch = useDispatch();
  const pubnub = usePubNub();
  const views = useSelector(getViewStates);
  const theme = useContext(ThemeContext);
  const conversation = useSelector(getCurrentConversationDescription);
  const conversationColor = getUniqueColor(
    conversation.name,
    (theme.colors.avatars as unknown) as string[]
  );

  // update hereNow when the conversationId changes
  // useEffect(() => {
  //   // dispatch(
  //   //   // fetchHereNow({
  //   //   //   channels: [currentConversationId]
  //   //   // })
  //   // );
  // }, [currentConversationId, dispatch]);

  return (
    <Drawer open={views.ConversationMembers} edge="right" wide>
      <StyledBox position="absolute" right="0" padding="6">
        <Icon
          onClick={() => {
            dispatch(conversationMembersViewHidden());
          }}
          icon={Icons.Cross}
          color="normalText"
          title="Close members list"
          clickable
        />
      </StyledBox>

      <FlexRow padding="6">
        <Avatar bg={conversationColor}>#</Avatar>
        <StyledBox paddingLeft="6">
          <Heading>{conversation.name}</Heading>
        </StyledBox>
      </FlexRow>

      <StyledBox px="6" py="1">
        <Heading>Members</Heading>
      </StyledBox>

      <ScrollView>
        {members.map(user => (
          <MemberDescription
            user={user}
            key={user.id}
            you={user.id === userId}
          />
        ))}
      </ScrollView>
    </Drawer>
  );
};

export { ConversationMembers };
