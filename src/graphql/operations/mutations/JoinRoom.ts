import { gql } from "@apollo/client";

export default gql`
  mutation joinRoom($code: String!) {
    joinRoom(roomCode: $code) {
      id
    }
  }
`;
