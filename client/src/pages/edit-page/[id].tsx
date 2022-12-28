import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Layout, InputField, TextField, Loaders } from "../../components";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { getUser } from "../../utils/getLocalStorage";

const EditPage = () => {
  const [updatePost] = useUpdatePostMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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
    return (
      <Layout>
        <Box textAlign="center" color="red" fontSize="1.2rem">
          Something went wrong
        </Box>
      </Layout>
    );
  }

  const item = data?.post;
  if (!item) {
    return (
      <Layout>
        <Loaders />
      </Layout>
    );
  }

  let userId = getUser().userId;
  const authorId = Number(userId);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          authorId,
          title: item?.title,
          description: item?.description,
        }}
        onSubmit={async (values) => {
          const response = await updatePost({
            variables: { ...values, id: result },
          });
          if (response.data?.updatePost === null) {
            setErrorMessage(
              "Cannot edit, make sure you are logged in and try again!!!"
            );
            return;
          } else {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form
            style={{ fontFamily: '"Rajdhani", sans-serif' }}
            className="form-body"
          >
            <Box mb={2} textAlign="center" color="red" fontSize="1rem">
              {errorMessage}
            </Box>
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
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPage);
