import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField, Layout, TextField } from "../components";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

interface IProps {}

const CreatePost: React.FC<IProps> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  //check if the user is logged in
  useIsAuth();

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
                router.push("/login");
              }
            }
          } else {
            router.push("/");
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
