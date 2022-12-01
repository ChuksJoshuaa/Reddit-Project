import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField, Wrapper } from "../components";
interface IProps {}

const CreatePost: React.FC<IProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values, { setErrors }) => {}}
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
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter description..."
                value="description"
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

export default CreatePost;
