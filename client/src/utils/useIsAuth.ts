import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { getUser } from "./getLocalStorage";

export const useIsAuth = () => {
  const [{ data }] = useMeQuery();

  const checkUser = Object.keys(getUser()).length;

  useEffect(() => {
    if (!data?.me && checkUser === 0) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, router]);
};
