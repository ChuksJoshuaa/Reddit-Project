import { DeleteIcon, EditIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Navbar, Updoot } from "../components";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { itemProps, itemSingleProps, postsDataTypes } from "../utils/dataTypes";
import { isServer } from "../utils/isServer";
// import { ReqChecker } from "../utils/reqCheck";

const Index = () => {
  const [, deletePost] = useDeletePostMutation();
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [{ data: meData }] = useMeQuery({
    pause: isServer() as any,
  });

  if (!fetching && !data) {
    return (
      <Flex>
        <Box m="auto" my={8}>
          You do not have any posts for some reason
        </Box>
      </Flex>
    );
  }

  const loadMore = (data: postsDataTypes) => {
    setVariables({
      limit: variables.limit,
      cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
    });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
      <Navbar />
      <Container
        maxW="950px"
        style={{ fontFamily: '"Rajdhani", sans-serif' }}
        mt={10}
      >
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            <Box fontSize="xl" textTransform="lowercase" mb={0}>
              <Button>
                <Link href="/create-post">CreatePost</Link>
              </Button>
            </Box>
            {data!.posts.posts.map((item) =>
              !item ? null : (
                <Box pt={0} p={3} shadow="md" borderWidth="1px" key={item.id}>
                  <Flex
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Heading
                      fontSize="xl"
                      textTransform="capitalize"
                      style={{ fontFamily: '"Rajdhani", sans-serif' }}
                    >
                      {item.title}
                    </Heading>
                    <Flex>
                      <Icon as={FaUser} boxSize={4} color="tomato"></Icon>
                      <Text pl="1" color="tomato">
                        {item.author.username}
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex direction="row" alignItems="flex-start" mt={3}>
                    <Updoot item={item as itemProps} />
                    <Box>
                      <Text mt={1}>{item.descriptionSnippet}...</Text>
                      <Button
                        mt={2}
                        colorScheme="gray"
                        fontSize="xs"
                        size="xs"
                        variant="solid"
                      >
                        <Link href={`/single-page/${item.id}`}>Read More</Link>
                      </Button>
                    </Box>
                  </Flex>
                  {meData?.me?.id === item?.author?.id ? (
                    <Flex justify="flex-end" alignItems="center">
                      <Box style={{ visibility: "hidden" }}>.</Box>
                      <Flex
                        justify="flex-start"
                        alignItems="center"
                        direction="row"
                      >
                        <Link href={`/edit-page/${item?.id}`}>
                          <EditIcon w={6} h={6} color="blue.500" mx={2} />
                        </Link>
                        <DeleteIcon
                          w={6}
                          h={6}
                          color="red.500"
                          onClick={() =>
                            deletePost({
                              id: item?.id,
                            })
                          }
                        />
                      </Flex>
                    </Flex>
                  ) : null}
                </Box>
              )
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={fetching}
              m="auto"
              my={8}
              onClick={() => loadMore(data as postsDataTypes)}
            >
              Load More
            </Button>
          </Flex>
        ) : null}
      </Container>
    </>
  );
};

//{ ssr: true } => we use this when we are trying to load on the server side.
// Also, we use this when will are trying to do any queries on the web page
//And if the data that is queried is important to SEO for better performance
export default withUrqlClient(
  createUrqlClient,
  isServer() ? { ssr: true } : { ssr: false }
)(Index);
