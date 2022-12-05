import React from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data.posts.map((item) => (
            <Box p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{item.title}</Heading>
              <Text mt={4}>{item.description.slice(0, 100)}</Text>
              <Button mt={2} colorScheme="red">
                <Link href={`/single-page/${item.id}`}>Read More</Link>
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </>
  );
};

//{ ssr: true } => we use this when we are trying to load on the server side.
// Also, we use this when will are trying to do any queries on the web page
//And if the data that is queried is important to SEO for better performance
export default withUrqlClient(createUrqlClient)(Index);
