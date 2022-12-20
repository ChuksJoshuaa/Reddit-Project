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
          <Form style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            <link
              href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
              rel="stylesheet"
            ></link>
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
