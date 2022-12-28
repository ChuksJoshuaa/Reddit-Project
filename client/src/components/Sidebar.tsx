import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { openSidebar } from "../redux/features/posts/postSlice";
import { imageUrl } from "../utils/image";
import { useAppDispatch } from "../redux/hooks";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useMutation } from "urql";
import { LogoutDocument } from "../mutations/userMutations";
import { getUser } from "../utils/getLocalStorage";
import { useRouter } from "next/router";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer() as any,
  });

  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);

  const checkUser = Object.keys(getUser()).length;
  const userName = getUser()?.userName;

  let body = null;
  if (fetching) {
  } else if (!data?.me && checkUser === 0) {
    body = (
      <Box fontSize="xl" mt={1} pr={5}>
        <Button
          colorScheme="teal"
          size="md"
          textTransform="lowercase"
          mr={2}
          onClick={() => dispatch(openSidebar(false))}
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          textTransform="lowercase"
          onClick={() => dispatch(openSidebar(false))}
        >
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
            dispatch(openSidebar(false));
            localStorage.clear();
            router.reload();
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
      width="100vw"
      height="20vh"
      className="sidebar"
      style={{
        fontFamily: '"Rajdhani", sans-serif',
      }}
    >
      <Flex justify="space-between" alignItems="center">
        <Flex
          className="navbar-component"
          justify="space-between"
          alignItems="center"
        >
          <Box
            fontSize="2xl"
            pt={1}
            onClick={() => dispatch(openSidebar(false))}
          >
            <img src={imageUrl} alt="image-icon" className="image-component" />
          </Box>
          <Box
            fontSize="2xl"
            textTransform="capitalize"
            fontWeight="bold"
            pt={1}
            onClick={() => dispatch(openSidebar(false))}
          >
            <Link href="/" style={{ marginRight: "1em" }}>
              Reddit
            </Link>
          </Box>
        </Flex>
        <Box onClick={() => dispatch(openSidebar(false))}>
          <Icon as={FaTimes} boxSize={7} mr={2} mt={3} color="tomato"></Icon>
        </Box>
      </Flex>

      <Box p={2} className="sidebar-body">
        {body}
      </Box>
    </Box>
  );
};

export default Sidebar;
