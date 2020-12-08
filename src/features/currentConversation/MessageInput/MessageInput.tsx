import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
import { getMessageDrafts } from "features/joinedConversations/DraftsModel";
import { updateMessageDraft } from "features/joinedConversations/updateMessageDraftCommand";
import { discardMessageDraft } from "features/joinedConversations/discardMessageDraftCommand";
import { sendMessage } from "features/messages/sendMessage";
// import { sendTypingIndicator } from "features/typingIndicator/sendTypingIndicator";
import { MessageType } from "features/messages/messageModel";
import { DraftTextMessage } from "features/messages/draft";
import { MessageEditor } from "features/messages/MessageEditor";
import { getCurrentConversationId } from "../currentConversationModel";
import {
  TYPING_INDICATOR_DURATION_SECONDS,
  TypingIndicatorType
} from "features/typingIndicator/typingIndicatorModel";
import { StyledBox } from "foundations/components/layout";

const typingIndicators: {
  [conversationId: string]: boolean;
} = {};

const getConversationMessageDraft = createSelector(
  [getMessageDrafts, getCurrentConversationId],
  (drafts, conversationId): DraftTextMessage | undefined => {
    return drafts[conversationId];
  }
);

/**
 * Allow editing and sending messages
 */
export const MessageInput = () => {
  const conversationId: string = useSelector(getCurrentConversationId);
  const userId: string = useSelector(getLoggedInUserId);
  const storedDraft: DraftTextMessage | undefined = useSelector(
    getConversationMessageDraft
  );
  const defaultDraft: DraftTextMessage = {
    type: MessageType.Text,
    senderId: userId,
    text: ""
  };
  const message: DraftTextMessage = storedDraft ? storedDraft : defaultDraft;
  const dispatch = useDispatch();

  /* const notifyTyping = () => {
    if (!typingIndicators[conversationId]) {
      typingIndicators[conversationId] = true;
      dispatch(sendTypingIndicator(TypingIndicatorType.ShowTypingIndicator));

      // allow sending additional typing indicators 1 seconds before display duration ends
      setTimeout(() => {
        typingIndicators[conversationId] = false;
      }, (TYPING_INDICATOR_DURATION_SECONDS - 1) * 1000);
    }
  };

  const notifyStopTyping = () => {
    if (typingIndicators[conversationId]) {
      typingIndicators[conversationId] = false;
      dispatch(sendTypingIndicator(TypingIndicatorType.HideTypingIndicator));
    }
  }; */

  const send = (appMessage: DraftTextMessage) => {
    dispatch(sendMessage(appMessage));
    dispatch(discardMessageDraft(conversationId));
    typingIndicators[conversationId] = false;
  };

  const update = (appMessage: DraftTextMessage) => {
    dispatch(updateMessageDraft(conversationId, appMessage));

    /* if ("text" in appMessage) {
      if (appMessage.text.length > 0) {
        notifyTyping();
      } else {
        notifyStopTyping();
      }
    } */
  };

  return (
    <StyledBox mx="6" marginBottom="3">
      <MessageEditor
        message={message}
        sendDraft={send}
        updateDraft={update}
      ></MessageEditor>
    </StyledBox>
  );
};
