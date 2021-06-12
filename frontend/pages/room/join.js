import styles from "../../styles/Home.module.css";
import {
  Input,
  VStack,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export async function getStaticProps() {
  return {
    props: {},
  };
}

const JoinRoomForm = () => {
  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/room/${e.target.roomID.value}`,
      query: {
        name: e.target.name.value,
      },
    });
  };
  return (
    <form onSubmit={submitHandler}>
      <VStack spacing="1rem" color="white">
        <FormControl id="roomID" colorScheme="teal" isRequired>
          <FormLabel>Room ID</FormLabel>
          <Input name="roomID" />
        </FormControl>
        <FormControl id="name" colorScheme="teal" isRequired>
          <FormLabel>Your Nickname</FormLabel>
          <Input name="name" />
        </FormControl>
        <Button colorScheme="teal" size="lg" width="100%" type="submit">
          Let's Go!
        </Button>
      </VStack>
    </form>
  );
};

export default function JoinRoom() {
  return (
    <div className={styles.container}>
      <h1
        style={{
          fontFamily: "Proxima Nova",
          fontWeight: "700",
          color: "white",
          fontSize: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        Join Room
      </h1>
      <JoinRoomForm />
    </div>
  );
}
