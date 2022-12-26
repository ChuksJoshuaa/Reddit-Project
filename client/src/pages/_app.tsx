import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import "../styles/globals.css";
import { Footer } from "../components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
      <Flex className="container-height">
        <Box height="100%">
          <Component {...pageProps} />
        </Box>
        <Box>
          <Footer />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default MyApp;
