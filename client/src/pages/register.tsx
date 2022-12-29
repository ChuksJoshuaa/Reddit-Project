import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { InputField, Wrapper } from "../components";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const Register = () => {
  const [register] = useRegisterMutation();
  const Router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: "posts" });
            },
          });

          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data?.register.user) {
            let userName = response?.data?.register?.user?.username;
            let userId = response?.data?.register?.user?.id;
            localStorage.setItem(
              "profile",
              JSON.stringify({ userName, userId })
            );
            Router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form
            style={{ fontFamily: '"Rajdhani", sans-serif' }}
            className="form-body"
          >
            <InputField name="username" placeholder="name" label="Username" />
            <Box mt={4}>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
            </Box>
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

export default withApollo({ ssr: false })(Register);
