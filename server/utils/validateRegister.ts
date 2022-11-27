import { UserPasswordInput } from "./UserPasswordInput";

export const validateRegister = (options: UserPasswordInput) => {
  if (
    options.email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    ) === null
  ) {
    return [
      {
        field: "email",
        message: "Please provide a valid email",
      },
    ];
  }
  if (
    options.username.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    ) !== null
  ) {
    return [
      {
        field: "username",
        message: "Please provide a valid username",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Username length must be greater than 2",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Password length must be greater than 2",
      },
    ];
  }

  return null;
};
