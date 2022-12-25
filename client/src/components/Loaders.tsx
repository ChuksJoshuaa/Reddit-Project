import { Box } from "@chakra-ui/react";
import React from "react";

const Loaders = () => {
  return (
    <>
      <Box
        textAlign="center"
        mt={3}
        color="orange"
        fontSize="1.5em"
        fontWeight="semibold"
        textTransform="capitalize"
      >
        Loading...
      </Box>
      <div className="loader-container">
        <div className="item-1"></div>
        <div className="item-2"></div>
        <div className="item-3"></div>
        <div className="item-4"></div>
        <div className="item-5"></div>
      </div>
    </>
  );
};

export default Loaders;
