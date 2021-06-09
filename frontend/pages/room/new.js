import styles from "../../styles/Home.module.css";
import {
  Input,
  VStack,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";

export async function getStaticProps() {
  return {
    props: {},
  };
}

const CreateRoomForm = () => {
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <form onSubmit={submitHandler}>
      <VStack spacing="1rem" color="white">
        <FormControl id="email" colorScheme="teal" isRequired>
          <FormLabel>Your Nickname</FormLabel>
          <Input />
        </FormControl>
        <Button colorScheme="teal" size="lg" width="100%" type="submit">
          Let's Go!
        </Button>
      </VStack>
    </form>
  );
};

export default function CreateRoom() {
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
        Create Room
      </h1>
      <CreateRoomForm />
    </div>
  );
}
