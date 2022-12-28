import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Loaders } from "../../components";
import EditDeleteButton from "../../components/EditDeleteButton";
import { usePostQuery } from "../../generated/graphql";
import { getUser } from "../../utils/getLocalStorage";

const SinglePage = () => {
  const router = useRouter();
  let userId = getUser().userId;
  const authorId = Number(userId);

  const routerQuery = router.query;
  let result: any;
  if (routerQuery) {
    result = Number(router.query.id);
  }

  const { data, error } = usePostQuery({
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
        <Loaders />
      </Layout>
    );
  }
  return (
    <Layout>
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

        <Flex justify="space-between" pr={3}>
          <Button m={3} colorScheme="teal">
            <Link href={`/`}>Go Back</Link>
          </Button>

          {authorId === item?.authorId ? (
            <EditDeleteButton
              id={item?.id}
              authorId={item?.authorId}
              check={true}
            />
          ) : null}
        </Flex>
      </Box>
    </Layout>
  );
};

export default SinglePage;
