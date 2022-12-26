import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

export type WrapperVariant = "small" | "regular";
interface WrapperProps {
  children: any;
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <>
      <Navbar />
      <Box
        mt={8}
        mx="auto"
        maxW={variant === "regular" ? "800px" : "500px"}
        w="100%"
      >
        {children}
      </Box>
    </>
  );
};

export default Wrapper;
