// import React from "react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/core";
import { Wrapper } from "../components";

interface IProps {}

const Register: React.FC<IProps> = () => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values, handleChange }) => (
          <form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                placeholder="username"
                id="username"
                value={values.username}
                onChange={handleChange}
              />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
