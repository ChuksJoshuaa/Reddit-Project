import { InputType, Field } from "type-graphql";

//We use it for argument. i.e @Arg

@InputType()
export class UserPasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
