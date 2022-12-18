import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaUser } from "react-icons/fa";
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

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <Box fontSize="xl">
        <Link href="/login" style={{ marginRight: "1em" }}>
          Login
        </Link>
        <Link href="/register">Register</Link>
      </Box>
    );
  } else {
    body = (
      <Flex>
        <Icon as={FaUser} boxSize={4} mt={2} mr={1}></Icon>
        <Box mr={2} fontSize="xl" textTransform="capitalize">
          {data.me.username}
        </Box>
        <Button
          onClick={async () => {
            await logout();
          }}
          variant="link"
          colorScheme="blackAlpha"
          isLoading={logoutFetching}
          mr={10}
          fontSize="xl"
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      p={4}
      fontWeight="medium"
      justify="space-between"
      style={{
        fontFamily: '"Rajdhani", sans-serif',
        backgroundColor: "rgba(210, 214, 214, 0.7)",
      }}
    >
      <Box px={10} fontSize="xl" textTransform="capitalize">
        <Link href="/" style={{ marginRight: "1em" }}>
          Home
        </Link>
        <Link href="/create-post" style={{ marginRight: "1em" }}>
          CreatePost
        </Link>
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
