// This file contains the GraphQL queries used in the application
// and the corresponding TypeScript types for the queries and mutations.
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// This file contains the GraphQL queries used in the application
// and the corresponding TypeScript types for the queries and mutations.
// The queries and mutations are used to interact with the GraphQL API
// and perform operations such as logging in, adding a user, saving a book,
// and removing a book from the user's saved books.
// The queries and mutations are defined using the gql template literal