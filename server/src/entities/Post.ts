import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  _id!: string;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
}
