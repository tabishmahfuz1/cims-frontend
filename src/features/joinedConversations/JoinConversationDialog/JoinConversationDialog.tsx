import React, { useCallback, useState } from "react";
import { getViewStates } from "features/layout/Selectors";
import { useSelector, useDispatch } from "react-redux";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
// import {
//   ConversationDescription,
//   ConversationDescriptionFragment
// } from "../ConversationDescription";
// import {
//   getConversationsByUserId,
//   MembershipHash
// } from "../joinedConversationModel";
import {
  Heading,
  HeadingSizes,
  Icon,
  Icons,
  Label,
  Input,
  LabelVariants,
  InputVariants,
  ButtonVariants,
  Button
} from "foundations/components/presentation";
import { Modal, FlexRow, StyledBox } from "foundations/components/layout";
// import { createSelector } from "reselect";
// import {
//   getAllConversations,
//   Conversation
// } from "features/conversations/conversationModel";
import {
  joinConversation,
  createConversation
} from "../joinConversationCommand";
import { joinConversationViewHidden } from "features/layout/LayoutActions";

/**
 * Present list to the user of conversations that they could join, but have not.
 * Allow the user to select the conversation to join or back out.
 *
 * TODO: This renders unconditionally as display:none so it will fetch the
 * list of conversations to join when the UI is rendered even if the user has not
 * opened the dialog.
 */
const JoinConversationDialog = () => {
  const views = useSelector(getViewStates);
  const currentUserId = useSelector(getLoggedInUserId);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const onJoinClick = () => {
    if (code) {
      dispatch(joinConversation(code));
    }
  };

  const onCreateClick = () => {
    if (name) {
      dispatch(createConversation(name));
    }
  };

  return (
    <Modal open={views.JoinConversation}>
      <FlexRow
        justifyContent="space-between"
        px={[3, 0]}
        paddingBottom={0}
        paddingTop={0}
      >
        <Heading size={HeadingSizes.BIG}>Join a Room</Heading>
        <Icon
          onClick={() => {
            dispatch(joinConversationViewHidden());
          }}
          color={"normalText"}
          icon={Icons.Cross}
          title="Close"
          clickable
        />
      </FlexRow>

      <StyledBox paddingTop="6" paddingBottom="1">
        <Label variant={LabelVariants.DARK}>Room Code</Label>
      </StyledBox>
      <Input
        value={code}
        onChange={e => setCode(e.target.value)}
        variant={InputVariants.DARK}
      />
      <StyledBox marginTop="4">
        <Button variant={ButtonVariants.PRIMARY} onClick={onJoinClick}>
          {false ? "Joining" : "Join"}
        </Button>
      </StyledBox>

      <FlexRow
        justifyContent="space-between"
        // px={[3, 0]}
        marginTop={5}
        paddingBottom={0}
        paddingTop={20}
      >
        <Heading size={HeadingSizes.BIG}>Or create one!</Heading>
      </FlexRow>

      <StyledBox paddingTop="6" paddingBottom="1">
        <Label variant={LabelVariants.DARK}>Room Name</Label>
      </StyledBox>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        variant={InputVariants.DARK}
      />
      <StyledBox marginTop="4">
        <Button variant={ButtonVariants.PRIMARY} onClick={onCreateClick}>
          {false ? "Creating.." : "Create"}
        </Button>
      </StyledBox>
    </Modal>
  );
};

export { JoinConversationDialog };
