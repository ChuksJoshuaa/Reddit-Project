import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../types";

export const Authenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not unathenticated");
  }

  return next();
};
