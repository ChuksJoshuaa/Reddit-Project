import React, { useState } from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Divider,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon, Icon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
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

  const loadMore = (data: any) => {
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
      <Container maxW="700px" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
        <h1>Home</h1>
        <br />
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((item) => (
              <Box p={3} shadow="md" borderWidth="1px" key={item.id}>
                <Flex
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Heading
                    fontSize="xl"
                    style={{ fontFamily: '"Rajdhani", sans-serif' }}
                  >
                    {item.title}
                  </Heading>
                  <Flex>
                    <Icon as={FaUser} boxSize={4} color="red.500"></Icon>
                    <Text pl="1" color="red.500">
                      {item.author.username}
                    </Text>
                  </Flex>
                </Flex>
                <Divider />
                <Flex direction="row" alignItems="flex-start" mt={3}>
                  <Flex direction="column" mr={10}>
                    <ChevronUpIcon w={8} h={8} color="blackAlpha.900" />
                    <Text ml={3}>{item.points}</Text>
                    <ChevronDownIcon w={8} h={8} color="blackAlpha.900" />
                  </Flex>
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
              </Box>
            ))}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={fetching}
              m="auto"
              my={8}
              onClick={() => loadMore(data)}
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
export default withUrqlClient(createUrqlClient)(Index);
