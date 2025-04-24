import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';

// Johnny's Added Code
import { ApolloServer } from '@apollo/server'; // import ApolloServerExpress from '@apollo/server/express4';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authenticateToken,
    })
  );

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

// app.get('*', (_req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });
// }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

startApolloServer();
