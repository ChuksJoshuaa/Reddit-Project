import { Form, Formik } from "formik";

import { Box, Button } from "@chakra-ui/react";
import { InputField, Wrapper } from "../components";

interface IProps {}

const Register: React.FC<IProps> = () => {
  // const handleEnterKeyPress = (e: any) => {
  //   e.preventDefault();
  //   if (e.key === "Enter" || e.keyCode === 13) {
  //     handleSubmit(e);
  //   }
  // };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="name" label="Username" />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
