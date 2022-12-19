import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

// '' -> false
// 'error message stuff' -> true
const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} isRequired>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
      <FormLabel
        htmlFor={field.name}
        style={{ fontFamily: '"Rajdhani", sans-serif' }}
      >
        {label}
      </FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        style={{ fontFamily: '"Rajdhani", sans-serif' }}
      />
      {error ? (
        <FormErrorMessage style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          {error}
        </FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default InputField;
