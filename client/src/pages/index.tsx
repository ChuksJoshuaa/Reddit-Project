import React from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
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

  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <br />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((item) => (
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
      {data ? (
        <Flex>
          <Button isLoading={fetching} m="auto" my={8}>
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
