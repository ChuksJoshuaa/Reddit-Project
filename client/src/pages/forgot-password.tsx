import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { Wrapper, InputField } from "../components";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

interface IProps {}

const ForgotPassword: React.FC<IProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          const response = await forgotPassword(values);
          console.log(response);
          if (response.data?.forgotPassword) {
            setEmailError(false);
            setError("");
            setComplete(true);
          } else {
            setEmailError(true);
            setError("Email does not exist");
            setComplete(false);
          }
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box mt={2}>A confirmation message has been sent to your mail</Box>
          ) : (
            <Form>
              <link
                href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
                rel="stylesheet"
              ></link>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
                style={{ border: `${emailError ? "1px solid red" : ""}` }}
              />
              {emailError ? (
                <Box mt={2} style={{ color: "red" }}>
                  {error}
                </Box>
              ) : null}
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
