import React from "react";
import { Box } from "@chakra-ui/core";

interface WrapperProps {
  children: any;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box mt={8} mx="auto" maxW="800px" w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
