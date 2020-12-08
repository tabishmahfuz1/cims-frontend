import { AppState } from "main/storeTypes";
import { createSelector } from "reselect";
import { createChannelMembersCountReducer } from "pubnub-redux";

export interface ConversationMembersCount {
  [conversationId: string]: number;
}

const getMembersCountByConversationIdSlice = (state: AppState) =>
  Object.keys(state.conversations.conversations).reduce(
    (acc, k) => ({
      ...acc,
      [k]: state.conversations.conversations[k].members.length
    }),
    {}
  );

export const getMembersCountByConversationId = createSelector(
  [getMembersCountByConversationIdSlice],
  (users: ConversationMembersCount) => {
    return users;
  }
);

const ConversationMembersCountStateReducer = createChannelMembersCountReducer();

export { ConversationMembersCountStateReducer };
