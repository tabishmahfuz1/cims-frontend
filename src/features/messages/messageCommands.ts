import { ThunkAction } from "main/storeTypes";
import ApolloClient from "../../graphql/room-service-client";
import GET_POSTS from "../../graphql/operations/queries/GetPosts";
import {
  getMessages,
  getMessagesSuccess,
  getMessagesFailed,
  getSearchTerm
} from "./messageModel";
import { conversationId as defaultConversationId } from "config/defaultConversation.json";

export const getConversationMessages = (
  conversationId: string
): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    console.log("Requesting Messages for", conversationId);
    dispatch(getMessages(conversationId));
    const term = getSearchTerm(getState());
    const labels = term ? term.split(" ") : undefined;
    return ApolloClient.query({
      query: GET_POSTS,
      variables: {
        inp: {
          room:
            defaultConversationId == conversationId
              ? undefined
              : conversationId,
          labels
        }
      }
    }).then(res => {
      if (res.errors) {
        // Update from res.errors
        dispatch(getMessagesFailed("ERROR", "Error Occured"));
      } else {
        const posts = res.data.posts;
        console.log("[MessageCommand] Got Messages", conversationId, posts);
        dispatch(getMessagesSuccess(conversationId, posts));
      }
    });
  };
};
