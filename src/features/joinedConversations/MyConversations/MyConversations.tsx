import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getCurrentConversationId } from "features/currentConversation/currentConversationModel";
import { getConversationsByUserId } from "../joinedConversationModel";
import { MembershipHash } from "../joinedConversationModel";
import {
  ConversationsIndexedById,
  getConversationsById,
  getAllConversations
} from "features/conversations/conversationModel";
import { focusOnConversation } from "features/currentConversation/currentConversationModel";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
import { ConversationItem } from "../ConversationItem";
import {
  Heading,
  HeadingVariants,
  Icon,
  Icons
} from "foundations/components/presentation";
import { ScrollView, FlexRow } from "foundations/components/layout";
import { leaveConversation } from "../leaveConversationCommand";
import {
  currentConversationViewDisplayed,
  joinConversationViewDisplayed,
  menuViewHidden
} from "features/layout/LayoutActions";

import { getRooms } from "../../conversations/conversationCommads";

export interface ConversationFragment {
  id: string;
  name: string;
}

export const getJoinedConversations = createSelector(
  [getAllConversations, getLoggedInUserId],
  (
    conversations: Array<ConversationFragment>,
    userId: string
  ): ConversationFragment[] => {
    console.log("[My Conversations] Conversations", conversations);
    return conversations;
  }
);

const MyConversations = () => {
  const currentUserId = useSelector(getLoggedInUserId);
  const conversationsById = useSelector(getConversationsById);
  const conversations: ConversationFragment[] = useSelector(
    getJoinedConversations
  );
  const currentConversationId: string = useSelector(getCurrentConversationId);
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(joinConversationViewDisplayed());
  };

  useEffect(() => {
    // console.log("Emitting GET_CONVERSATIONS");
    dispatch(getRooms());
  }, []);

  if (conversationsById === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FlexRow justifyContent="space-between" mx={6} marginBottom={1}>
        <Heading variant={HeadingVariants.INVERSE}>Conversations</Heading>
        <Icon
          icon={Icons.Add}
          color={"onPrimary"}
          onClick={openOverlay}
          title="Join Room"
          clickable
        />
      </FlexRow>

      <ScrollView>
        {conversations.map(conversation => (
          <ConversationItem
            id={conversation.id}
            name={conversation.name}
            onLeave={() => {
              // Dispatch event to emit leave request to API
              dispatch(leaveConversation(currentUserId, conversation.id));
            }}
            selected={conversation.id === currentConversationId}
            key={conversation.id}
            unreadMessageCount={0}
            onClick={() => {
              dispatch(focusOnConversation(conversation.id));
              dispatch(currentConversationViewDisplayed());
              dispatch(menuViewHidden());
            }}
          ></ConversationItem>
        ))}
      </ScrollView>
    </>
  );
};

export { MyConversations };
