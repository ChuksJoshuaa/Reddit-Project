import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FaAlignJustify, FaUser } from "react-icons/fa";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { openSidebar } from "../redux/features/posts/postSlice";
import { useAppDispatch } from "../redux/hooks";
import { getUser } from "../utils/getLocalStorage";
import { imageUrl } from "../utils/image";
import { isServer } from "../utils/isServer";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();

  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  const checkUser = Object.keys(getUser()).length;
  const userName = getUser()?.userName;

  //isServer is used for server side rendering. In urql we use pause while for apollo/client we use skip
  const { data, loading } = useMeQuery({
    skip: isServer() as boolean,
  });

  let body = null;

  if (loading) {
  } else if (!data?.me && checkUser === 0) {
    body = (
      <Box fontSize="xl" mt={1} pr={5}>
        <Button colorScheme="teal" size="md" textTransform="lowercase" mr={2}>
          <Link href="/login">Login</Link>
        </Button>
        <Button colorScheme="teal" size="md" textTransform="lowercase">
          <Link href="/register">Register</Link>
        </Button>
      </Box>
    );
  } else {
    body = (
      <Flex alignItems="center" mt={1} pr={5}>
        <Icon as={FaUser} boxSize={4} mr={1}></Icon>
        <Box mr={2} fontSize="xl" textTransform="capitalize">
          {userName}
        </Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
            localStorage.clear();
          }}
          isLoading={logoutFetching}
          fontSize="xl"
          colorScheme="red"
          textTransform="lowercase"
          size="md"
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Box
      style={{
        fontFamily: '"Rajdhani", sans-serif',
        backgroundColor: "rgba(210, 214, 214, 0.7)",
      }}
    >
      <Flex
        pt={2}
        pb={2}
        maxW="950px"
        mx="auto"
        fontWeight="medium"
        justify="space-between"
      >
        <Flex
          className="navbar-component"
          justify="space-between"
          alignItems="center"
        >
          <Box fontSize="2xl">
            <img src={imageUrl} alt="image-icon" className="image-component" />
          </Box>
          <Box fontSize="2xl" textTransform="capitalize" fontWeight="bold">
            <Link href="/" style={{ marginRight: "1em" }}>
              Reddit
            </Link>
          </Box>
        </Flex>
        <Box ml={"auto"} className="hide-nav">
          {body}
        </Box>
        <Box
          ml={"auto"}
          className="show-nav"
          onClick={() => dispatch(openSidebar(true))}
        >
          <Icon as={FaAlignJustify} boxSize={7} mr={2} mt={3}></Icon>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
