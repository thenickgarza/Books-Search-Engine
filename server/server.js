const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// Adds the apollo server
const { ApolloServer } = require('apollo-server-express');
// Adds the middleware t
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build/index.html')));
}

// app.use(routes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });

});
