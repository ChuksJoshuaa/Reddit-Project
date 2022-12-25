export const getUser = () => {
  let user = {
    userName: "",
    userId: "",
  };

  if (typeof window !== "undefined") {
    user = JSON.parse(localStorage.getItem("profile") || "{}");
  }
  return user;
};
