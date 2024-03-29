import "reflect-metadata";
import { __prod__, COOKIE_NAME } from "./constant";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
const RedisStore = connectRedis(session);
import cors from "cors";
// import cookieParser from "cookie-parser";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { dataSource } from "./appDataSource";
import { createUserLoader } from "../utils/createUserLoader";
import { createUpdootLoader } from "../utils/createUpdootLoader";

const main = async () => {
  await dataSource
    .initialize()
    .then((response) => {
      console.log(typeof response);
    })
    .catch((error) => console.log(error));

  // dataSource.runMigrations();

  const PORT = process.env.PORT || 5000;
  const secret_key = process.env.SESSION_SECRET as string;

  const app = express();

  app.set("trust proxy", __prod__);
  // app.use(cookieParser());

  const redis = new Redis(process.env.REDIS_URL as string);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      secret: secret_key,
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: __prod__,
        sameSite: __prod__ ? "none" : "lax",
        secure: __prod__,
        domain: __prod__ ? ".vercel.app" : undefined,
      },
      saveUninitialized: false,
      resave: false,
    })
  );

  app.get("/", (_, res) => {
    res.send("hello");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),

    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          "request.credentials": "include",
        },
      }),
    ],
    introspection: __prod__,
    persistedQueries: false,
    cache: "bounded",
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}....`);
  });
};

main().catch((err) => {
  console.log(err);
});
