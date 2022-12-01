import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField, Wrapper, TextField } from "../components";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IProps {}

const CreatePost: React.FC<IProps> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const Router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values) => {
          await createPost({ input: values });
          Router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
              type="text"
            />
            <Box mt={4}>
              <TextField
                name="description"
                placeholder="description..."
                label="Description"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="green"
            >
              Create post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
