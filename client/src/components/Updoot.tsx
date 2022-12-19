import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useVoteMutation } from "../generated/graphql";
import { itemSingleProps } from "../utils/dataTypes";

const Updoot = ({ item }: itemSingleProps) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

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
              postId: item.id,
              value: 1,
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
              postId: item.id,
              value: -1,
            });
            setLoadingState("not-loading");
          }}
        />
      </Flex>
    </>
  );
};

export default Updoot;
