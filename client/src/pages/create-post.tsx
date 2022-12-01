import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField, TextField, Layout } from "../components";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IProps {}

const CreatePost: React.FC<IProps> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const Router = useRouter();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values) => {
          const response = await createPost({ input: values });
          console.log(response);
          if (response.error) {
            const errorType = response.error?.graphQLErrors;
            for (let err of errorType) {
              if (
                err.extensions.code === "UNAUTHENTICATED" ||
                err.message.includes("logged in")
              ) {
                Router.push("/login");
              }
            }
          } else {
            Router.push("/");
          }
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
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
