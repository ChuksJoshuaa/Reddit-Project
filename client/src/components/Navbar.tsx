import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaUser } from "react-icons/fa";
import { useMutation } from "urql";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { LogoutDocument } from "../mutations/userMutations";
import { isServer } from "../utils/isServer";

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);
  // const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const [{ data, fetching }] = useMeQuery({
    pause: isServer() as any,
  });

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <Box fontSize="xl" mt={1}>
        <Link href="/login" style={{ marginRight: "1em" }}>
          Login
        </Link>
        <Link href="/register">Register</Link>
      </Box>
    );
  } else {
    body = (
      <Flex alignItems="center" justify="space-between" mt={1}>
        <Icon as={FaUser} boxSize={4} mr={1}></Icon>
        <Box mr={2} fontSize="xl" textTransform="capitalize">
          {data.me.username}
        </Box>
        <Button
          onClick={async () => {
            await logout();
          }}
          variant="link"
          className="logout"
          colorScheme="blackAlpha"
          isLoading={logoutFetching}
          fontSize="xl"
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      p={2}
      fontWeight="medium"
      justify="space-between"
      style={{
        fontFamily: '"Rajdhani", sans-serif',
        backgroundColor: "rgba(210, 214, 214, 0.7)",
      }}
    >
      <Flex
        className="navbar-component"
        justify="space-between"
        alignItems="center"
      >
        <Box fontSize="2xl" textTransform="capitalize" color="red">
          <Link href="/" style={{ marginRight: "1em" }}>
            Reddit
          </Link>
        </Box>
        <Box fontSize="xl" textTransform="lowercase">
          <Link href="/create-post" style={{ marginRight: "1em" }}>
            CreatePost
          </Link>
        </Box>
      </Flex>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
