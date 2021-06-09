import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <link
          rel="preload"
          href="/fonts/proxima-nova-soft.otf"
          as="font"
          crossOrigin=""
        />
        <title>Mahjong with Friends</title>
        <meta
          name="description"
          content="Stay home, stay safe. Play mahjong with friends from anywhere in the world."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
