import React from "react";
import { Navbar } from "../components";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  return (
    <>
      <Navbar />
      <h1>Home</h1>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
