import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../redux/hooks";

import React from "react";
import { Footer, Sidebar } from ".";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

const Body = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.post);
  return (
    <>
      {isSidebarOpen ? <Sidebar /> : null}
      <Footer />
    </>
  );
};

export default withUrqlClient(
  createUrqlClient,
  isServer() ? { ssr: true } : { ssr: false }
)(Body);
