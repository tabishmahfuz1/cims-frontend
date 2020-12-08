import { gql } from "@apollo/client";

export default gql`
  mutation createRoom($inp: CreateRoomInput!) {
    createRoom(inp: $inp) {
      id
    }
  }
`;
