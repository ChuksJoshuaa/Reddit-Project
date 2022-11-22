import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { InputField, Wrapper } from "../components";
import { useMutation } from "urql";
import { REGISTER_MUT } from "../mutations/userMutations";

interface IProps {}

const Register: React.FC<IProps> = () => {
  // const handleEnterKeyPress = (e: any) => {
  //   e.preventDefault();
  //   if (e.key === "Enter" || e.keyCode === 13) {
  //     handleSubmit(e);
  //   }
  // };

  const [, register] = useMutation(REGISTER_MUT);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
          return register(values);
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
