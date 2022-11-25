import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const [{ data, fetching }] = useMeQuery();

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
        <Button type="button" variant="link">
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
