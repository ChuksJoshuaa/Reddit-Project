import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const [{ data, fetching }] = useMeQuery();

  console.log(data);

  let body = null;

  //data is loading
  if (fetching) {
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
    body = <Box>{data.me.username}</Box>;
  }
  return (
    <Flex bg="tomato" p={4} fontWeight="bold">
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
