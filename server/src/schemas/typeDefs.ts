const typeDefs = `
// This is the schema for the GraphQL API
type User {
    id: String
    username: String
    email: String
    password: String
    bookCount: number
    savedBooks: [Book] // array of Book type
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token : String
        user : User // reference to User type
        }

type Query {
    user(id: String, username: String) : User
    }

    type Mutation {
        login( email : String!, password : String!) :n Auth
        addUser(username: String!, email: String!, password: String!) : Auth'
        saveBook(book: BookInput!) : User // Uses BookInput as input type
        removerBook(bookId : String!) : User
    }
`
