import React from "react";
import { usePostQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components";
import { Box, Button, Divider } from "@chakra-ui/react";
import Link from "next/link";

const SinglePage = () => {
  const router = useRouter();

  const routerQuery = router.query;
  let result: any;
  if (routerQuery) {
    result = Number(router.query.id);
  }

  const [{ data, error }] = usePostQuery({
    variables: {
      id: result,
    },
  });

  if (error) {
    return <Box>{error.message}</Box>;
  }

  const item = data?.post;
  if (!item) {
    return (
      <Layout>
        <Box>Loading....</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
      <Box
        mx={2}
        mb={2}
        shadow="md"
        borderWidth="1px"
        style={{ fontFamily: '"Rajdhani", sans-serif' }}
      >
        <Box
          p={2}
          pb={0}
          fontWeight="semibold"
          textTransform="capitalize"
          textAlign="center"
          fontSize="2xl"
        >
          {item?.title}
        </Box>
        <Divider />
        <Box p={2}>{item?.description}</Box>
        <Button m={3} colorScheme="teal">
          <Link href={`/`}>Go Back</Link>
        </Button>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(SinglePage);
