import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField, Layout, TextField } from "../components";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getUser } from "../utils/getLocalStorage";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost = () => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  //check if the user is logged in
  useIsAuth();

  let userId = getUser().userId;
  const authorId = Number(userId);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ authorId, title: "", description: "" }}
        onSubmit={async (values) => {
          const response = await createPost({
            variables: { input: values },
          });
          if (response.errors) {
            const errorType = response.errors;
            if (errorType) {
              router.push("/login");
            }
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form
            style={{ fontFamily: '"Rajdhani", sans-serif' }}
            className="form-body"
          >
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
              colorScheme="red"
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
