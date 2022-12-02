import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { TextareaHTMLAttributes } from "react";

type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
};

const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} isRequired>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default TextField;
