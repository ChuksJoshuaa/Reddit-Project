import { ApolloCache, gql } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useVoteMutation, VoteMutation } from "../generated/graphql";
import { itemSingleProps } from "../utils/dataTypes";
import { getUser } from "../utils/getLocalStorage";
import { withApollo } from "../utils/withApollo";

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 1) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const Updoot = ({ item }: itemSingleProps) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  let userId = getUser().userId;
  const authorId = Number(userId);

  return (
    <>
      <Flex direction="column" mr={10} alignItems="center">
        <IconButton
          icon={<ChevronUpIcon />}
          aria-label="updoot post"
          isLoading={loadingState === "updoot-loading"}
          colorScheme={item.voteStatus === 1 ? "teal" : undefined}
          onClick={async () => {
            if (item.voteStatus === 1) {
              return;
            }
            setLoadingState("updoot-loading");
            await vote({
              variables: {
                postId: item.id,
                value: 1,
                authorId,
              },

              update: (cache) => updateAfterVote(1, item.id, cache),
            });
            setLoadingState("not-loading");
          }}
        />

        <Text>{item.points}</Text>
        <IconButton
          icon={<ChevronDownIcon />}
          aria-label="downdoot post"
          colorScheme={item.voteStatus === -1 ? "red" : undefined}
          isLoading={loadingState === "downdoot-loading"}
          onClick={async () => {
            if (item.voteStatus === -1) {
              return;
            }
            setLoadingState("downdoot-loading");
            await vote({
              variables: {
                postId: item.id,
                value: 1,
                authorId,
              },

              update: (cache) => updateAfterVote(-1, item.id, cache),
            });
            setLoadingState("not-loading");
          }}
        />
      </Flex>
    </>
  );
};

export default withApollo({ ssr: false })(Updoot);
