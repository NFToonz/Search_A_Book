// Johnny's code - Uses the functionality in the user-controller.ts as a guide.
import { getSingleUser, createUser, login, saveBook, deleteBook } from '../controllers/user-controller.js';

// Define interfaces for resolver arguments and context - Improves type safety/clarity
interface UserArgs {
  id?: string;
  username?: string;
  bookId?: string;
  book?: any;
}

interface Context {
  user?: { _id: string };
}

const resolvers = {
  Query: {
    // Fetch a single user by ID or username
    user: async (_parent: any, args: UserArgs, context: Context) => {
      const { id, username } = args;
      const req = { params: { id, username }, user: context.user };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      return await getSingleUser(req, res);
    },
  },
  Mutation: {
    // Create a new user
    createUser: async (_parent: any, args: UserArgs) => {
      const req = { body: args };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      return await createUser(req, res);
    },
    // Login a user
    login: async (_parent: any, args: UserArgs) => {
      const req = { body: args };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      return await login(req, res);
    },
    // Save a book to the user's savedBooks
    saveBook: async (_parent: any, args: UserArgs, context: Context) => {
      const req = { body: args.book, user: context.user };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      return await saveBook(req, res);
    },
    // Remove a book from the user's savedBooks
    deleteBook: async (_parent: any, args: UserArgs, context: Context) => {
      const req = { params: { bookId: args.bookId }, user: context.user };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      return await deleteBook(req, res);
    },
  },
};

export default resolvers;