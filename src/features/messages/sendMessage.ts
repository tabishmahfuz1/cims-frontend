import { ThunkAction } from "main/storeTypes";
import { getCurrentConversationId } from "features/currentConversation/currentConversationModel";
import { DraftTextMessage } from "./draft";
import RoomServiceClient from "graphql/room-service-client";
import CREATE_POST from "graphql/operations/mutations/CreatePost";
import GET_POSTS from "graphql/operations/queries/GetPosts";
import { getConversationMessages } from "features/messages/messageCommands";
// import { sendMessage as sendPubnubMessage } from "pubnub-redux";

/**
 * Send a message to the current conversation
 *
 * This command does not handle failure and leaves the error to the caller
 */
export const sendMessage = (message: DraftTextMessage): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    // console.log("[SEND_MESSAGE] Got Msg", message)
    const post = {
      room: getCurrentConversationId(state),
      type: "Default",
      attachments: message.attachments,
      text: message.text,
      labels: message.labels
    };

    // console.log("[SEND_MESSAGE] To send", post);

    RoomServiceClient.mutate({
      mutation: CREATE_POST,
      variables: { post },
      refetchQueries: [
        {
          query: GET_POSTS,
          variables: { inp: { room: post.room } }
        }
      ],
      awaitRefetchQueries: true
    }).then(r => {
      if (r.errors) {
      } else {
        console.log("[SendMessageCommand]::Dispatching GetMessages");
        dispatch(getConversationMessages(post.room));
      }
    });
  };
};
