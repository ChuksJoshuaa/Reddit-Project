import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField, Wrapper } from "../../components";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

interface IProps {
  token: string;
}

const ChangePassword: NextPage<IProps> = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  const tokenQuery = router.query.token;

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof tokenQuery === "string" ? tokenQuery : "",
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data?.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-body">
            <Box mt={4}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New password"
                type="password"
              />
            </Box>
            {tokenError ? (
              <Flex>
                <Box style={{ color: "crimson" }}>{tokenError}</Box>
                <Box mr={2} style={{ color: "crimson", fontSize: "1rem" }}>
                  !!!
                </Box>
                <NextLink
                  href="/forgot-password"
                  style={{
                    marginTop: "0.05em",
                    color: "blueviolet",
                    fontSize: "1rem",
                    textTransform: "lowercase",
                  }}
                >
                  Click here to get a new one?
                </NextLink>
              </Flex>
            ) : null}
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

export default withApollo({ ssr: false })(ChangePassword);
