# Reddit Full Stack Typescript Application

<img src="https://res.cloudinary.com/chuksmbanaso/image/upload/v1671505260/media/Screenshot_297_yrmsqk.png" title="icon" alt="icon">
## GraphQL Queries & Mutations

## Queries

### Get all posts

```
query Posts($limit: Int!, $cursor: String) {
  posts(cursor: $cursor, limit: $limit) {
    hasMore
    posts {
      id
      title
      points
      descriptionSnippet
      createdAt
      updatedAt
      voteStatus
      author {
        id
        username
        email
      }
    }
  }
}

```

### Get a single post

```
query Post($id: Int!) {
  post(id: $id) {
    id
    title
    description
    authorId
    points
    createdAt
    updatedAt
  }
}

```

### Get user

```
query Me {
  me {
    id
    username
  }
}

```

##Mutations

### Create a new post

```
mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    title
    description
    authorId
    points
    createdAt
    updatedAt
  }
}

```

### Update a post

```
mutation UpdatePost(
  $id: Int!
  $authorId: Int!
  $title: String!
  $description: String!
) {
  updatePost(
    id: $id
    authorId: $authorId
    title: $title
    description: $description
  ) {
    id
    title
    description
    descriptionSnippet
  }
}

```

### Delete Post

```
mutation DeletePost($id: Int!, $authorId: Int!) {
  deletePost(id: $id, authorId: $authorId)
}

```

### Login

```

mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    user{
      id
      username
      email
      createdAt
    }
  }
}


```

### Register

```
mutation Register($email: String!, $username: String!, $password: String!) {
  register(
    options: { email: $email, username: $username, password: $password }
  ) {
     errors {
      field
      message
    }
    user{
      id
      username
      email
    }
  }
}


```

### Logout

```
mutation Logout {
  logout
}

```

### vote

```
mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}

```

### Forgot Password

```
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}

```

### Change Password

```
mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
     errors {
      field
      message
    }
    user{
      id
      username
      email
    }
  }
}

```
