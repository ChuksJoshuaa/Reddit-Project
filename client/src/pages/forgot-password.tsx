import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { InputField, Wrapper } from "../components";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          const response = await forgotPassword({
            variables: values,
          });
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
            <Form
              style={{ fontFamily: '"Rajdhani", sans-serif' }}
              className="form-body"
            >
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

export default ForgotPassword;
