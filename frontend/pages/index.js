import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, VStack } from "@chakra-ui/react";

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mahjong with Friends</title>
        <meta
          name="description"
          content="Stay home, stay safe. Play mahjong with friends from anywhere in the world."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src="/splash.png" width={424} height={424}></Image>
        <div className={styles.actions}>
          <VStack spacing="2rem">
            <Button colorScheme="teal" size="lg" width="100%">
              Create Room
            </Button>
            <Button colorScheme="teal" size="lg" width="100%">
              Join Room
            </Button>
          </VStack>
        </div>
      </main>
    </div>
  );
}
