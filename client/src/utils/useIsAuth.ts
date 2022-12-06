import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();

  useEffect(() => {
    if (!fetching && !data?.me) {
      //it means redirect to pathname after user have logged in
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, router, fetching]);
};
