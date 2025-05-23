// This is the schema for the GraphQL API
const typeDefs = `
type User {
    _id: String
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book] 
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
        input BookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token : String
        user : User 
        }

type Query {
    me : User
    }

    type Mutation {
        login( email : String!, password : String!) : Auth
        addUser(username: String!, email: String!, password: String!) : Auth
        saveBook(book: BookInput!) : User 
        removeBook(bookId : String!) : User
    }
`;
export default typeDefs;
