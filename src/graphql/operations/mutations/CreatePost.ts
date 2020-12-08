import { gql } from "@apollo/client";

export default gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
      attachments {
        fileId
      }
      createdBy
    }
  }
`;
