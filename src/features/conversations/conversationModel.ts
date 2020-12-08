import { AppState } from "main/storeTypes";
import { createSelector } from "reselect";
import { AppActions } from "main/AppActions";

export type Conversation = {
  id: string;
  name: string;
  code: string;
  members: Array<string>;
};

export const GET_CONVERSATIONS = "GET_CONVERSATIONS";
export const GET_CONVERSATIONS_SUCCESS = "GET_CONVERSATIONS_SUCCESS";
export const GET_CONVERSATIONS_FAILED = "GET_CONVERSATIONS_FAILED";

export interface getConversationsAction {
  type: typeof GET_CONVERSATIONS;
}

export interface getConversationsSuccessAction {
  type: typeof GET_CONVERSATIONS_SUCCESS;
  conversations: Array<Conversation>;
}

export type getConversationsFailedActionPayload = {
  code: string;
  message?: string;
};

export interface getConversationsFailedAction {
  type: typeof GET_CONVERSATIONS_FAILED;
  error: getConversationsFailedActionPayload;
}

export const getConversations = (): getConversationsAction => ({
  type: GET_CONVERSATIONS
});

export const getConversationsSuccess = (
  conversations: Array<Conversation>
): getConversationsSuccessAction => ({
  type: GET_CONVERSATIONS_SUCCESS,
  conversations
});

export const getConversationsFailed = (
  code: string,
  message: string
): getConversationsFailedAction => ({
  type: GET_CONVERSATIONS_FAILED,
  error: {
    code,
    message
  }
});

/**
 * Describes a way to lookup a conversation from a conversationId
 */
export type ConversationsIndexedById = { [id: string]: Conversation };

export interface ConversationState {
  isLoading: boolean;
  conversations: ConversationsIndexedById;
  hasFailed: boolean;
  code?: string;
  message?: string;
}

const initialState: ConversationState = {
  isLoading: false,
  hasFailed: false,
  conversations: {}
};

/**
 * create a reducer which holds all known conversation objects in a normalized form
 */
const conversationStateReducer = (
  state: ConversationState = initialState,
  action: AppActions
): ConversationState => {
  switch (action.type) {
    case GET_CONVERSATIONS: {
      return {
        ...state,
        isLoading: true,
        hasFailed: false
      };
    }

    case GET_CONVERSATIONS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        conversations: action.conversations.reduce((acc, curr) => {
          return {
            ...acc,
            [(curr as Conversation).id]: curr
          };
        }, {})
      };
    }

    case GET_CONVERSATIONS_FAILED: {
      return {
        ...state,
        hasFailed: true,
        isLoading: false,
        code: action.error.code,
        message: action.error.message
      };
    }

    default: {
      return state;
    }
  }
};
// const conversationStateReducer = combineReducers({
//   conversations: createChannelDataReducer<Conversation>(),
//   allConversations: createChannelsListReducer<{}>()
// });
export { conversationStateReducer };

/**
 * Slice selectors are used internally to access the state of the reducer
 */
const getConversationsSlice = (state: AppState) => state.conversations;
const getChannelsSlice = (state: AppState) => state.conversations.conversations;
const getAllChannelsSlice = (state: AppState) => state.conversations;

/**
 * Returns an index which can be used to find conversation objects
 */
export const getConversationsById = createSelector(
  [getConversationsSlice],
  (conversations): ConversationsIndexedById => {
    return conversations.conversations;
  }
);

/**
 * Returns an array of all channels
 */
export const getAllConversations = createSelector(
  [getChannelsSlice, getAllChannelsSlice],
  (channels, allChannels) => {
    return Object.keys(allChannels.conversations).map(
      k => allChannels.conversations[k]
    );
  }
);
