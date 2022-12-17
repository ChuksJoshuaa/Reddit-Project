export interface authorTypes {
  id: number;
  username: string;
  email: string;
}

export interface itemProps {
  id: number;
  title: string;
  points: number;
  descriptionSnippet: string;
  createdAt: string;
  updatedAt: string;
  author: authorTypes;
}

export interface postTypes {
  posts: itemProps[];
}

export interface postsDataTypes {
  posts: postTypes;
}

export interface itemSingleProps {
  item: itemProps;
}
