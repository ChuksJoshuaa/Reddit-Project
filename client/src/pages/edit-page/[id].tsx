import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Layout, InputField, TextField } from "../../components";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const EditPage = () => {
  const [, updatePost] = useUpdatePostMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const routerQuery = router.query;
  let result: any;
  if (routerQuery) {
    result = Number(router.query.id);
  }

  const [{ data, error }] = usePostQuery({
    variables: {
      id: result,
    },
  });

  const item = data?.post;
  if (!item) {
    return (
      <Layout>
        <Box>Loading....</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: item?.title, description: item?.description }}
        onSubmit={async (values) => {
          const response = await updatePost({ ...values, id: result });
          console.log(response);
          if (response.data?.updatePost === null) {
            setErrorMessage(
              "You cannot update this post due to some issues, Please try again!!!"
            );
            return;
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form style={{ fontFamily: '"Rajdhani", sans-serif' }}>
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