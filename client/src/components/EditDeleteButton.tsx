import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, Box } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

interface EditDeleteProps {
  id: number;
  authorId: number;
  check: boolean;
}

const EditDeleteButton: React.FC<EditDeleteProps> = ({
  id,
  authorId,
  check,
}) => {
  const [deletePost] = useDeletePostMutation();

  const router = useRouter();

  return (
    <>
      <Flex justify="flex-end" alignItems="center">
        <Box style={{ visibility: "hidden" }}>.</Box>
        <Flex justify="flex-start" alignItems="center" direction="row">
          <Link href={`/edit-page/${id}`}>
            <EditIcon w={6} h={6} color="blue.500" mx={2} />
          </Link>
          <DeleteIcon
            w={6}
            h={6}
            color="red.500"
            onClick={() => {
              deletePost({
                variables: {
                  id,
                  authorId,
                },
              });

              check ? router.push("/") : undefined;
            }}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default withApollo({ ssr: false })(EditDeleteButton);
