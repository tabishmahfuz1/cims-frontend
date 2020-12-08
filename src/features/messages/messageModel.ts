import { AppActions } from "main/AppActions";
import { AppState } from "main/storeTypes";
import { createSelector } from "reselect";
// import {
//   createMessageReducer,
//   Message as PubNubMessageEnvelope,
// } from "pubnub-redux";
import { AppMessage } from "sharedTypes/messageModel";
import { MessageType, AttachmentType } from "sharedTypes/messageModel";
export { MessageType, AttachmentType };
export type {
  AppMessage,
  TextMessage,
  GiphyMessage
} from "sharedTypes/messageModel";

// export type MessageEnvelope = Required<
//   Pick<PubNubMessageEnvelope, "channel" | "message" | "timetoken">
// > & {
//   message: AppMessage;
// };

export type MessageEnvelope = {
  channel: string;
  timetoken: number;
  labels: string[];
  message: AppMessage;
};

export const GET_MESSAGES = "GET_MESSAGES";
export const GET_MESSAGES_SUCCESS = "GET_MESSAGES_SUCCESS";
export const GET_MESSAGES_FAILED = "GET_MESSAGES_FAILED";
export const SET_SEARCH_TERM = "SET_SEARCH_TERM";

export interface setSearchTermAction {
  type: typeof SET_SEARCH_TERM;
  term: string;
}

export interface getMessagesAction {
  type: typeof GET_MESSAGES;
  conversationId: string;
}

export type RoomServicePost = {
  id: string;
  type: string;
  attachments: [
    {
      id: string;
      fileId: string;
      name: string;
    }
  ];
  text: string;
  labels: string[];
  createdBy: string;
  createdAt: number;
};

export type getMessagesSuccessPayload = {
  posts: RoomServicePost[];
  conversationId: string;
};

export interface getMessagesSuccessAction {
  type: typeof GET_MESSAGES_SUCCESS;
  payload: getMessagesSuccessPayload;
}

export type getMessagesFailedPayload = {
  code: string;
  message: string;
};

export interface getMessagesFailedAction {
  type: typeof GET_MESSAGES_FAILED;
  payload: getMessagesFailedPayload;
}

export const setSearchTerm = (term: string): setSearchTermAction => ({
  type: SET_SEARCH_TERM,
  term
});

export const getMessages = (conversationId: string): getMessagesAction => ({
  type: GET_MESSAGES,
  conversationId
});

export const getMessagesSuccess = (
  conversationId: string,
  posts: RoomServicePost[]
): getMessagesSuccessAction => ({
  type: GET_MESSAGES_SUCCESS,
  payload: {
    posts,
    conversationId
  }
});

export const getMessagesFailed = (
  code: string,
  message: string
): getMessagesFailedAction => ({
  type: GET_MESSAGES_FAILED,
  payload: {
    code,
    message
  }
});

export type MessagesIndexByConversationId = {
  [conversationId: string]: Array<MessageEnvelope>;
};

export interface MessageState {
  isLoading: boolean;
  hasFailed: boolean;
  searchTerm?: string;
  messages: MessagesIndexByConversationId;
}

const initialState: MessageState = {
  isLoading: false,
  hasFailed: false,
  messages: {}
};

/**
 * create a reducer which holds all known messsage envelope objects in a normalized form
 */
// export const MessageStateReducer = createMessageReducer<MessageEnvelope>();
export const MessageStateReducer = (
  state: MessageState = initialState,
  action: AppActions
): MessageState => {
  switch (action.type) {
    case SET_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.term
      };
    }
    case GET_MESSAGES: {
      return {
        ...state,
        isLoading: true,
        hasFailed: false
      };
    }
    case GET_MESSAGES_SUCCESS: {
      console.log(
        "[MessageReducer] Got messages for",
        action.payload.conversationId
      );
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.posts.map(p => ({
            channel: action.payload.conversationId,
            timetoken: p.createdAt,
            labels: p.labels,
            message: {
              type: MessageType.Text,
              text: p.text,
              senderId: p.createdBy,
              attachments: p.attachments.map(a => ({
                file: {
                  fileId: a.fileId,
                  name: a.name
                },
                type: AttachmentType.Document
              }))
            }
          }))
        }
      };
    }

    case GET_MESSAGES_FAILED: {
      return {
        ...state,
        isLoading: false,
        hasFailed: true
      };
    }

    default: {
      return state;
    }
  }
};

/**
 * THis Slice selector is used internally to access the state of the reducer,
 * primarily as the base selector function for creating other selectors.
 */
const getMessagesSlice = (state: AppState) => state.messages;

export const getSearchTerm = createSelector([getMessagesSlice], messages => {
  return messages.searchTerm;
});

/**
 * Returns an index which can be used to find user objects
 */
export const getMessagesById = createSelector([getMessagesSlice], messages => {
  console.log("[MessageSelector]::getMessagesById", messages);
  return messages.messages;
});
