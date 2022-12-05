import React from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Button } from "@chakra-ui/react";
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
        data.posts.map((item) => (
          <Box
            key={item.id}
            mx={2}
            mb={2}
            style={{ border: "1px solid silver" }}
          >
            <Box p={2} pb={0} color="red">
              {item.title}
            </Box>
            <Box p={2}>{item.description}</Box>
            <Button m={2} colorScheme="cyan">
              <Link href={`/single-page/${item.id}`}>Read More</Link>
            </Button>
          </Box>
        ))
      )}
    </>
  );
};

//{ ssr: true } => we use this when we are trying to load on the server side.
// Also, we use this when will are trying to do any queries on the web page
//And if the data that is queried is important to SEO for better performance
export default withUrqlClient(createUrqlClient)(Index);
