import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

import { Post } from "../entities/Post";
import { MyContext } from "../types";
// import {sleep} from "../../utils/sleep"

@Resolver()
export class PostResolver {
  //Get all posts
  @Query(() => [Post])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    //to slow the fetching of posts by 3 seconds
    // await sleep(3000);
    return em.find(Post, {});
  }

  //Get post by id
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  //Create Post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title } as Post);
    await em.persistAndFlush(post);
    return post;
  }

  //Update Post
  //always set the data types when using nullable
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  //Delete Post
  //It will return a boolean after specific post has been deleted
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,

    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
