import { focusOnConversationAction } from "features/currentConversation/currentConversationModel";
import {
  MessageDraftUpdatedAction,
  MessageDraftDiscardedAction
} from "features/joinedConversations/DraftsModel";
import {
  logingInAction,
  loginSucceededAction,
  loginFailedAction,
  logoutAction
} from "features/authentication/authenticationModel";
import {
  getConversationsAction,
  getConversationsSuccessAction,
  getConversationsFailedAction
} from "features/conversations/conversationModel";
import {
  getMessagesAction,
  getMessagesFailedAction,
  getMessagesSuccessAction,
  setSearchTermAction
} from "features/messages/messageModel";
import {
  menuViewDisplayedAction,
  currentConversationViewDisplayedAction,
  conversationMembersViewDisplayedAction,
  joinConversationViewDisplayedAction,
  menuViewHiddenAction,
  currentConversationViewHiddenAction,
  conversationMembersViewHiddenAction,
  joinConversationViewHiddenAction
} from "features/layout/LayoutActions";
import { SignalReceivedAction } from "pubnub-redux/dist/features/signal/SignalActions";
import {
  TypingIndicatorEnvelope,
  RemoveTypingIndicatorAction,
  RemoveTypingIndicatorAllAction
} from "features/typingIndicator/typingIndicatorModel";
import { MessageReceivedAction } from "pubnub-redux/dist/features/message/MessageActions";
import { MessageEnvelope } from "features/messages/messageModel";

/**
 * AppActions is the union of all basic actions in this application.
 *
 * It is used to describe the actions that can be received by a reducer
 * and is helpful for type inference of action payload types when writing
 * switch style reducers.
 *
 * Thunks and other dispatchable objects that will not end up being received by
 * reducers directly should not be added to this union.
 */
export type AppActions =
  | focusOnConversationAction
  | logingInAction
  | loginFailedAction
  | logoutAction
  | getConversationsAction
  | getConversationsSuccessAction
  | getConversationsFailedAction
  | getMessagesAction
  | getMessagesFailedAction
  | getMessagesSuccessAction
  | setSearchTermAction
  | loginSucceededAction
  | MessageDraftUpdatedAction
  | MessageDraftDiscardedAction
  | menuViewDisplayedAction
  | currentConversationViewDisplayedAction
  | conversationMembersViewDisplayedAction
  | joinConversationViewDisplayedAction
  | menuViewHiddenAction
  | currentConversationViewHiddenAction
  | conversationMembersViewHiddenAction
  | joinConversationViewHiddenAction
  | SignalReceivedAction<TypingIndicatorEnvelope>
  | MessageReceivedAction<MessageEnvelope>
  | RemoveTypingIndicatorAction
  | RemoveTypingIndicatorAllAction;
