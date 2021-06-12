import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, VStack } from "@chakra-ui/react";
import Link from "next/link";

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Image src="/splash.png" width={424} height={424}></Image>
        <div className={styles.actions}>
          <VStack spacing="2rem">
            <Link href="/room/new">
              <Button colorScheme="teal" size="lg" width="100%">
                Create Room
              </Button>
            </Link>
            <Link href="/room/join">
              <Button colorScheme="teal" size="lg" width="100%">
                Join Room
              </Button>
            </Link>
          </VStack>
        </div>
      </main>
    </div>
  );
}
