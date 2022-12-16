import {
  Resolver,
  Field,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import dotenv from "dotenv";
dotenv.config();
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constant";
import { validateRegister } from "../../utils/validateRegister";
import { UserPasswordInput } from "../../utils/UserPasswordInput";
import { sendEmail } from "../../utils/sendEmail";
import { v4 } from "uuid";
import { dataSource } from "../appDataSource";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  //allow you to see your email of the posts you made while posts made by other authors, you won't see their email for security purpose
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    //this is the current user and its okay to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }

    //current user wants to see someone else email
    return "";
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find({});
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Password length must be greater than 2",
          },
        ],
      };
    }

    const redisKey = `${FORGET_PASSWORD_PREFIX}${token}`;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    //Note: redis is storing our user details in string, hence why i used parseInt

    let myUserId = parseInt(userId);

    const user = await User.findOne({ where: { id: myUserId } });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, newPassword);
    if (valid) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Choose a new password",
          },
        ],
      };
    }

    await User.update(
      { id: myUserId },
      { password: await argon2.hash(newPassword) }
    );

    //After password has been changed, delete the key hence the token cannot be reused
    await redis.del(redisKey);

    //log user in after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email: email } });
    if (user === null || user === undefined || !user) {
      return false;
    }

    let token = v4();

    let expireDate = 1000 * 60 * 60 * 24 * 3;

    await redis.set(
      `${FORGET_PASSWORD_PREFIX}${token}`,
      user.id,
      "EX",
      `${expireDate}`
    );
    const textMessage = `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`;
    await sendEmail(email, textMessage);
    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne({ where: { id: req.session.userId } });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);

    let user;

    try {
      //STEP 1
      // User.create({
      //   username: options.username,
      //   password: hashedPassword,
      //   email: options.email,
      // }).save();

      //SQL BUILDER - STEP 2
      const result = await dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          password: hashedPassword,
          email: options.email,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (error) {
      console.log(`error: ${error}`);
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (
      email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) === null
    ) {
      return {
        errors: [
          {
            field: "email",
            message: "Please provide a valid email",
          },
        ],
      };
    }
    const user = await User.findOne({ where: { email } });

    if (user === null || user === undefined || !user) {
      return {
        errors: [
          {
            field: "email",
            message: "user does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
