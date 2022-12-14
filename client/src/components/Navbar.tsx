import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaAlignJustify, FaUser } from "react-icons/fa";
import { useMutation } from "urql";
import { useMeQuery } from "../generated/graphql";
import { LogoutDocument } from "../mutations/userMutations";
import { getUser } from "../utils/getLocalStorage";
import { imageUrl } from "../utils/image";
import { isServer } from "../utils/isServer";
import { openSidebar } from "../redux/features/posts/postSlice";
import { useAppDispatch } from "../redux/hooks";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);

  const checkUser = Object.keys(getUser()).length;
  const userName = getUser()?.userName;

  const [{ data, fetching }] = useMeQuery({
    pause: isServer() as any,
  });

  let body = null;

  if (fetching) {
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
