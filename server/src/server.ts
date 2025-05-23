import express from 'express';
// import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';

// Johnny's Added Code
import { ApolloServer } from '@apollo/server'; // import ApolloServerExpress from '@apollo/server/express4';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
//Study Group added code
import type {Request , Response} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// const filePath = path.join(__dirname, 'public', 'index.html');
// console.log(filePath); // Logs the resolved file path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'example.txt');
console.log(filePath); // Logs the resolved file path
//Study Group added code
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
    app.use(express.static('../client/dist'));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile('../client/dist/index.html');
    });
  }
  // if (process.env.NODE_ENV === 'production') {
  //   app.use(express.static(path.join(__dirname, '../client/build')));
  //   app.get('*', (_req, res) => {
  //     res.sendFile(path.join(__dirname, '../client/build/index.html'));
  //   });
  // }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

startApolloServer();
