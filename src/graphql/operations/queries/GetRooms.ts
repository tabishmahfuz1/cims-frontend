import { gql } from "@apollo/client";

export default gql`
  query rooms {
    rooms {
      id
      name
      code
      members
    }
  }
`;
