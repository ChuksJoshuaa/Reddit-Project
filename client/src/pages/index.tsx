import { Icon } from "@chakra-ui/icons";
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
import { Loaders, Navbar, Sidebar, Updoot } from "../components";
import EditDeleteButton from "../components/EditDeleteButton";
import { usePostsQuery } from "../generated/graphql";

import { createUrqlClient } from "../utils/createUrqlClient";
import { itemProps, postsDataTypes } from "../utils/dataTypes";
import { getUser } from "../utils/getLocalStorage";
import { isServer } from "../utils/isServer";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <Flex>
        <Box m="auto" my={8}>
          Something went wrong!!!
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

  let userId = getUser().userId;
  const authorId = Number(userId);

  return (
    <>
      <Navbar />
      <Container
        maxW="950px"
        style={{ fontFamily: '"Rajdhani", sans-serif' }}
        mt={10}
      >
        {!data && fetching ? (
          <>
            <Loaders />
          </>
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
                  {authorId === item?.author?.id ? (
                    <EditDeleteButton
                      id={item?.id}
                      authorId={item?.author?.id}
                      check={false}
                    />
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

export default withUrqlClient(
  createUrqlClient,
  isServer() ? { ssr: true } : { ssr: false }
)(Index);
