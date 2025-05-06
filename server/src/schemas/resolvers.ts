// Johnny's code - Uses the functionality in the user-controller.ts as a guide.
// import { getSingleUser, createUser, login, saveBook, deleteBook } from '../controllers/user-controller.js';
import { signToken } from '../services/auth.js';
import { User } from '../models/index.js';
import { UserDocument } from '../models/User.js';
import { BookDocument } from '../models/Book.js';

// Define interfaces for resolver arguments and context - Improves type safety/clarity
interface UserArgs {
  username: string;
  email: string;
  password: string;
  savedbook?: BookDocument; // Optional for saveBook
  
}

interface Context {
  user?: { _id: string };
}

// Define the resolvers for the GraphQL API
// functions that run based the type definitions
const resolvers = {
  Query: {
    // Fetch a single user by ID or username
    me: async (_parent: any, args: UserArgs): Promise<{ token: string; user: UserDocument }> => {
      const foundUser = await User.findOne({ username: args.username });
      if (!foundUser) {
        throw new Error('Cannot find a user with this username!');
      }
      const token = signToken(foundUser.username, foundUser.email, foundUser._id);
      return { token, user: foundUser };
    },
  },

  // Fetch all users
  
Mutation: {
  // Create a new user
  addUser: async (_parent: any, args: UserArgs): Promise<{ token: string; user: UserDocument }> => {
    const user = await User.create(args);
    const token = signToken(user.username, user.email, user._id);
    return { token, user };
  },
  // Login a user
  login: async (_parent: any, args: UserArgs): Promise<{ token: string; user: UserDocument }> => {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error('Incorrect Email/Password');
    }
    const correctPw = await user.isCorrectPassword(args.password);
    if (!correctPw) {
      throw new Error('Incorrect Email/Password');
    }
    const token = signToken(user.username, user.email, user._id);
    return { token, user };
  },
  // Save a book to the user's savedBooks
  saveBook: async (_parent: any, args: UserArgs, context: Context): Promise<{ token: string; user: UserDocument }> => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user?._id },
        { $addToSet: { savedBooks: args.savedbook } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error('User not found');
      }
      const token = signToken(updatedUser.username, updatedUser.email, updatedUser._id);
      return { token, user: updatedUser };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to save book');
    }
  },
  // Remove a book from the user's savedBooks
  removeBook: async (_parent: any, args: UserArgs, context: Context): Promise<{ token: string; user: UserDocument }> => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user?._id },
        { $pull: { savedBooks: { bookId: args.savedbook } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error('User not found');
      }
      const token = signToken(updatedUser.username, updatedUser.email, updatedUser._id);
      return { token, user: updatedUser };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to remove book');
    }
  },
},
}
export default resolvers;