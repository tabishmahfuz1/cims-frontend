import { ThunkAction } from "main/storeTypes";
import ApolloClient from "../../graphql/room-service-client";
import GET_ROOMS from "../../graphql/operations/queries/GetRooms";
import {
  getConversations,
  getConversationsFailed,
  getConversationsSuccess
} from "./conversationModel";

export const getRooms = (): ThunkAction<Promise<void>> => {
  return (dispatch, getState, context) => {
    dispatch(getConversations());
    return ApolloClient.query({ query: GET_ROOMS }).then(res => {
      if (res.errors) {
        // Update from res.errors
        dispatch(getConversationsFailed("ERROR", "Error Occured"));
      } else {
        const rooms = res.data.rooms;
        console.log("Got Rooms", rooms);
        dispatch(getConversationsSuccess(rooms));
      }
    });
  };
};
