import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "http://localhost:5000/graphql",
});

import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
