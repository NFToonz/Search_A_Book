import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql'; // Import GraphQLError from graphql package
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        // Added Code 
        throw new GraphQLError('Forbidden: Invalid or expired token', {
          extensions: { code: 'FORBIDDEN' }, // Added Code 
        });
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    // Added Code 
    throw new GraphQLError('Unauthorized: No token provided', {
      extensions: { code: 'UNAUTHORIZED' },// Added Code
    });
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
