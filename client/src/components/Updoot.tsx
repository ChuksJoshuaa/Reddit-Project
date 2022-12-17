import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { itemSingleProps } from "../utils/dataTypes";

const Updoot = ({ item }: itemSingleProps) => {
  return (
    <>
      <Flex direction="column" mr={10} alignItems="center">
        <IconButton icon={<ChevronUpIcon />} aria-label="updoot vote" />

        <Text>{item.points}</Text>
        <IconButton icon={<ChevronDownIcon />} aria-label="updoot vote" />
      </Flex>
    </>
  );
};

export default Updoot;
