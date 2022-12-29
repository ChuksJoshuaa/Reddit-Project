import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { InputField, Wrapper } from "../components";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const Login = () => {
  const [login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data?.login.errors));
          } else if (response.data?.login.user) {
            let userName = response?.data?.login?.user?.username;
            let userId = response?.data?.login?.user?.id;
            localStorage.setItem(
              "profile",
              JSON.stringify({ userName, userId })
            );
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-body">
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex
              justify="space-between"
              style={{ fontFamily: '"Rajdhani", sans-serif' }}
            >
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                login
              </Button>
              {/* <NextLink href="/forgot-password" className="forgot-component">
                Forgot-password?
              </NextLink> */}
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
