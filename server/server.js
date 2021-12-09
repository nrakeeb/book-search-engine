const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");
// ​const { authMiddleware } = require("./utils/auth");

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: authMiddleware,
  });


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
​
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
​
await server.start();
​
server.applyMiddleware({ app });
​
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(
      `use graphQl at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});
}
​
startApolloServer();
