//Register user mutations
export const REGISTER_MUT = `
    mutation Register($username: String!, $password: String!){
        register(options: {username: $username, password: $password}){
            errors {
                field
                message
            }
            user {
                id
                username
            }
        }
    }
`;

export const LogoutDocument = `
    mutation Logout {
  logout
}
`;
