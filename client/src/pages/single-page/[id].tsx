import React from "react";
import { usePostQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components";
import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const SinglePage = () => {
  const router = useRouter();

  const routerQuery = router.query;
  let result: any;
  if (routerQuery) {
    result = Number(router.query.id);
  }

  const [{ data }] = usePostQuery({
    variables: {
      id: result,
    },
  });

  const item = data?.post;
  return (
    <Layout>
      <Box mx={2} mb={2} style={{ border: "1px solid silver" }}>
        <Box p={2} pb={0} color="red" textAlign="center" fontSize="2xl">
          {item?.title}
        </Box>
        <Box p={2}>{item?.description}</Box>
        <Button m={3} colorScheme="teal">
          <Link href={`/`}>Go Back</Link>
        </Button>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(SinglePage);
