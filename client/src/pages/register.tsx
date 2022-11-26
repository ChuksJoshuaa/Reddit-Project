import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { InputField, Wrapper } from "../components";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IProps {}

const Register: React.FC<IProps> = () => {
  // const handleEnterKeyPress = (e: any) => {
  //   e.preventDefault();
  //   if (e.key === "Enter" || e.keyCode === 13) {
  //     handleSubmit(e);
  //   }
  // };
  const [, register] = useRegisterMutation();
  const Router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);

          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data?.register.user) {
            //redirect to the home page
            Router.push("/");
          }
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

//Without adding this, you cannot make a post request to server url, instead it will return to the default client url
export default withUrqlClient(createUrqlClient)(Register);
