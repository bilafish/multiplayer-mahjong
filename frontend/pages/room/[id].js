import styles from "../../styles/Home.module.css";
import { HStack, VStack, Center, Box, Button, Tag } from "@chakra-ui/react";
import Image from "next/image";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const users = new Array(4).fill(null);

const CharacterSelection = ({
  isCurrentUser,
  isCurrentUserReady,
  isUserHost,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const characterInfo = ["Pink Pong", "Yollow", "Huat Zai"];

  return (
    <Box
      borderWidth="2px"
      borderColor="teal"
      minH="300px"
      borderRadius="1rem"
      p="1rem"
      display="flex"
      flexDir="column"
    >
      <Box visibility={isUserHost ? "visible" : "hidden"}>
        <Image
          src={`/img/Host Hat Icon.png`}
          width={50}
          layout="fixed"
          height={50}
        ></Image>
      </Box>
      <Image
        src={`/img/character${selectedCharacter}.png`}
        width={200}
        height={200}
      ></Image>
      <Center w="100%">
        <Button
          onClick={() => {
            if (selectedCharacter >= 2) {
              setSelectedCharacter(selectedCharacter - 1);
            } else {
              setSelectedCharacter(3);
            }
          }}
          variant="ghost"
          colorScheme="pink"
          disabled={isCurrentUserReady}
        >
          {"<"}
        </Button>
        <p style={{ margin: "0 1rem" }}>
          {characterInfo[selectedCharacter - 1]}
        </p>
        <Button
          onClick={() => {
            if (selectedCharacter < 3) {
              setSelectedCharacter(selectedCharacter + 1);
            } else {
              setSelectedCharacter(1);
            }
          }}
          variant="ghost"
          colorScheme="pink"
          disabled={isCurrentUserReady}
        >
          {">"}
        </Button>
      </Center>
    </Box>
  );
};

const UserCard = ({
  isEmpty,
  user,
  isCurrentUser,
  isCurrentUserReady,
  isUserHost,
}) => {
  if (isEmpty) {
    return (
      <VStack color="white" fontFamily="Proxima Nova">
        <Box
          borderWidth="2px"
          borderColor="teal"
          minH="300px"
          borderRadius="1rem"
          p="1rem 1rem 4rem 1rem"
          display="flex"
          flexDir="column"
          textAlign="center"
        >
          <Box visibility="hidden">
            <Image
              src={`/img/Host Hat Icon.png`}
              width={50}
              layout="fixed"
              height={50}
            ></Image>
          </Box>
          <p style={{ width: "200px", fontSize: "8rem", height: "200px" }}>?</p>
        </Box>
      </VStack>
    );
  }
  return (
    <VStack color="white" fontFamily="Proxima Nova">
      <CharacterSelection
        isCurrentUser={isCurrentUser}
        isCurrentUserReady={isCurrentUser && isCurrentUserReady}
        isUserHost={isUserHost}
      />
      {isCurrentUser && (
        <Tag variant="solid" colorScheme="whatsapp">
          {user?.name}
        </Tag>
      )}
      {!isCurrentUser && <p>{user?.name}</p>}
    </VStack>
  );
};

const LobbyView = ({ users, isCurrentUserHost, isJoined }) => {
  const userList =
    users.length < 4
      ? [...users, ...new Array(4 - users.length).fill(null)]
      : users;
  console.log(userList);
  const isCurrentUserReady = true;
  return (
    <>
      <h1
        style={{
          fontFamily: "Proxima Nova",
          fontWeight: "700",
          color: "white",
          fontSize: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        Room Lobby
      </h1>
      {isJoined && (
        <>
          <HStack
            spacing="1rem"
            mb="2rem"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            {userList.map((user) =>
              user ? (
                <UserCard
                  user={user}
                  key={user.id}
                  isCurrentUser={true}
                  isCurrentUserReady={isCurrentUserReady}
                  isUserHost={user.isHost}
                />
              ) : (
                <UserCard isEmpty={true} />
              )
            )}
          </HStack>
          <Button
            colorScheme="teal"
            variant="solid"
            disabled={isCurrentUserReady}
          >
            {isCurrentUserHost
              ? "Start"
              : isCurrentUserReady
              ? "Waiting for Host"
              : "Ready"}
          </Button>
        </>
      )}
    </>
  );
};

const GameView = () => {};

const ENDPOINT = "http://localhost:5000";
let socket;

export default function GameRoom() {
  const router = useRouter();
  const { id: roomID, name } = router.query;
  // Component States
  const [user, setUser] = useState(user);
  const socketID = user?.id;
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [room, setRoom] = useState(null);
  const roomStatus = "pending";
  const mockUsers = [
    {
      id: 1,
      name: "Jason",
      isHost: true,
    },
    {
      id: 2,
      name: "Sabrina",
      isHost: false,
    },
    null,
    null,
  ];

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { name: name, room: roomID }, ({ error, user }) => {
      if (error) {
        alert(error);
        setJoinError(error);
      } else {
        setUser(user);
        setIsJoined(true);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [name, roomID]);

  useEffect(() => {
    socket.on("room", ({ room }) => {
      console.log(room);
      console.log(room.players);
      setRoom(room);
    });
  }, []);
  return (
    <div className={styles.container}>
      {roomStatus === "pending" && (
        <LobbyView
          isJoined={isJoined}
          users={room !== null ? room.players : mockUsers}
          isCurrentUserHost={user?.isHost === true}
        ></LobbyView>
      )}
    </div>
  );
}
