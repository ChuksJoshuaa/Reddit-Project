import React from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box } from "@chakra-ui/react";

const Index = () => {
  const [{ data }] = usePostsQuery();

  console.log(data);
  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((item) => (
          <Box key={item.id} ml={2} mb={1}>
            <Box>{item.title}</Box>
            <Box>{item.description}</Box>
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
