import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMutation } from "urql";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
// import { isServer } from "../utils/isServer";
import { LogoutDocument } from "../mutations/userMutations";

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);
  // const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const [{ data, fetching }] = useMeQuery({
    // pause: isServer(),
  });

  console.log(data);

  let body = null;

  //data is loading
  if (fetching) {
    //user not logged in
  }

  //user not logged in
  else if (!data?.me) {
    body = (
      <>
        <Link href="/login" style={{ marginRight: "1em" }}>
          Login
        </Link>
        <Link href="/register">Register</Link>
      </>
    );
  }

  //user is logged in
  else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
          }}
          variant="link"
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tan" p={4} fontWeight="bold">
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
