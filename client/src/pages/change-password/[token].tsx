import React from "react";
import { NextPage } from "next";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { Wrapper, InputField } from "../../components";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";

interface IProps {
  token: string;
}

const ChangePassword: NextPage<IProps> = ({ token }) => {
  const Router = useRouter();
  console.log(token);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          //   const response = await login(values);
          //   if (response.data?.login.errors) {
          //     setErrors(toErrorMap(response.data?.login.errors));
          //   } else if (response.data?.login.user) {
          //     Router.push("/");
          //   }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
