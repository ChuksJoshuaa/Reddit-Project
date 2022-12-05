import { Authenticated } from "../middleware/Authenticated";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { Post } from "../entities/Post";
import { dataSource } from "../appDataSource";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  description: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const qb = dataSource
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where('"createdAt < :cursor"', { cursor: new Date(parseInt(cursor)) });
    }
    return qb.getMany();
  }

  //Get post by id
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  //Create Post
  @Mutation(() => Post)
  @UseMiddleware(Authenticated)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    let authorUserId = req.session.userId;
    return Post.create({ ...input, authorId: authorUserId }).save();
  }

  //Update Post
  //always set the data types when using nullable
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }

    return post;
  }

  //Delete Post
  //It will return a boolean after specific post has been deleted
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
