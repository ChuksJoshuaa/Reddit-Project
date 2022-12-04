import React, { useState } from "react";
import { NextPage } from "next";
import { Button, Box, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { Wrapper, InputField } from "../../components";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

interface IProps {
  token: string;
}

const ChangePassword: NextPage<IProps> = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  //We can use router.query to get the token instead of the getInitialProps where we pass the token props as a parameter
  const tokenQuery = router.query.token;

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: typeof tokenQuery === "string" ? tokenQuery : "",
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
          <Form>
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

// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };

export default withUrqlClient(createUrqlClient)(ChangePassword);
