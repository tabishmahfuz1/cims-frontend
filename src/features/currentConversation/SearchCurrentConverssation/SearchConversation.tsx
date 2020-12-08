import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getCurrentConversationId } from "../currentConversationModel";
import {
  getPresenceByConversationId,
  ConversationPresence
} from "features/memberPresence/memberPresenceModel";
// import { getViewStates } from "features/layout/Selectors";
import { Input } from "foundations/components/presentation";
import { setSearchTerm } from "features/messages/messageModel";
import { FlexRow, StyledBox } from "foundations/components/layout";
import {
  getMembersCountByConversationId,
  ConversationMembersCount
} from "features/conversationMembers/conversationMemberCountModel";

export interface ConversationOccupancyFragment {
  joinedCount: number;
  presentCount: number;
}

export const getCurrentConversationOccupancy = createSelector(
  [
    getCurrentConversationId,
    getPresenceByConversationId,
    getMembersCountByConversationId
  ],
  (
    currentConversationId: string,
    conversationPresence: ConversationPresence,
    conversationMembersCount: ConversationMembersCount
  ): ConversationOccupancyFragment => {
    const count = conversationMembersCount[currentConversationId];
    const presence = conversationPresence[currentConversationId];
    return {
      joinedCount: count || 0,
      presentCount: presence ? presence.occupancy : 0
    };
  }
);

const SearchCurrentConverssation = () => {
  // const views = useSelector(getViewStates);
  const dispatch = useDispatch();
  let timer: number;
  const onSearchBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    const term = e.target.value;
    timer = setTimeout(() => {
      dispatch(setSearchTerm(term));
    }, 500);
  };

  return (
    <FlexRow
      alignSelf="flex-start"
      // flexDirection={["column-reverse", "row"]}
      // onClick={() => {
      //   isConversationMembersLayoutVisible
      //     ? dispatch(conversationMembersViewHidden())
      //     : dispatch(conversationMembersViewDisplayed());
      // }}
    >
      <StyledBox px={[6, 10]}>
        <Input placeholder={"Type to search.."} onChange={onSearchBoxChange} />
      </StyledBox>
    </FlexRow>
  );
};

export { SearchCurrentConverssation };
