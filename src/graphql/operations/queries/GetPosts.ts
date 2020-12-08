import { gql } from "@apollo/client";

export default gql`
  query posts($inp: PostFilterInput!) {
    posts(inp: $inp) {
      id
      attachments {
        id
        fileId
        name
      }
      text
      labels
      createdBy
      createdAt
    }
  }
`;
