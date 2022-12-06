import React, { useState } from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  console.log(variables);

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
      <Navbar />
      <h1>Home</h1>
      <br />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((item) => (
            <Box p={5} shadow="md" borderWidth="1px" key={item.id}>
              <Heading fontSize="xl">{item.title}</Heading>
              <Text mt={4}>{item.descriptionSnippet}...</Text>
              <Button mt={2} colorScheme="red">
                <Link href={`/single-page/${item.id}`}>Read More</Link>
              </Button>
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
    </>
  );
};

//{ ssr: true } => we use this when we are trying to load on the server side.
// Also, we use this when will are trying to do any queries on the web page
//And if the data that is queried is important to SEO for better performance
export default withUrqlClient(createUrqlClient)(Index);
