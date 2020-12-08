import { ThunkAction } from "main/storeTypes";
import ApolloClient from "../../graphql/room-service-client";
import JOIN_ROOM from "graphql/operations/mutations/JoinRoom";
import GET_ROOMS from "graphql/operations/queries/GetRooms";
import CREATE_ROOM from "graphql/operations/mutations/CreateRoom";
import { focusOnConversation } from "features/currentConversation/currentConversationModel";
import { getRooms } from "../conversations/conversationCommads";
import {
  currentConversationViewDisplayed,
  joinConversationViewDisplayed,
  joinConversationViewHidden,
  menuViewHidden
} from "features/layout/LayoutActions";
/**
 * Join a conversation.
 * The membership in the conversation will be stored.
 * The channel for the converstation will be subscribed to to receive messages.
 * The new conversation will be made the selected conversation
 */
export const joinConversation = (code: string): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    return ApolloClient.mutate({
      mutation: JOIN_ROOM,
      variables: { code },
      refetchQueries: [
        {
          query: GET_ROOMS
          // variables:
        }
      ],
      awaitRefetchQueries: true
    }).then(res => {
      if (res.errors?.length) {
        // handle errors here
      } else {
        dispatch(getRooms()).then(() => {
          console.log("Joined Room", res.data.joinRoom);
          dispatch(focusOnConversation(res.data.joinRoom?.id));
          dispatch(joinConversationViewHidden());
        });
      }
    });
  };
};

export const createConversation = (
  name: string
): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    return ApolloClient.mutate({
      mutation: CREATE_ROOM,
      variables: { inp: { name } },
      refetchQueries: [
        {
          query: GET_ROOMS
          // variables:
        }
      ],
      awaitRefetchQueries: true
    }).then(res => {
      if (res.errors?.length) {
        // handle errors here
      } else {
        dispatch(getRooms()).then(() => {
          console.log("Created Room", res.data.createRoom);
          dispatch(focusOnConversation(res.data.createRoom?.id));
          dispatch(currentConversationViewDisplayed());
          dispatch(joinConversationViewHidden());
        });
      }
    });
  };
};
