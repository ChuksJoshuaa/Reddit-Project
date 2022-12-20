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
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
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
