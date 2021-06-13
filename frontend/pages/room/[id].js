import styles from "../../styles/Home.module.css";
import { HStack, VStack, Center, Box, Button, Tag } from "@chakra-ui/react";
import Image from "next/image";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ENDPOINT = "http://localhost:5000";
let socket;

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
      borderColor={isCurrentUser ? "pink" : "teal"}
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
          disabled={!isCurrentUser || isCurrentUserReady}
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
          disabled={!isCurrentUser || isCurrentUserReady}
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
        isCurrentUserReady={isCurrentUserReady}
        isUserHost={isUserHost}
      />
      {isCurrentUser && (
        <Tag
          variant="solid"
          colorScheme={isCurrentUserReady ? "whatsapp" : "orange"}
        >
          {user?.name}
        </Tag>
      )}
      {!isCurrentUser && (
        <Tag
          variant="outline"
          colorScheme={isCurrentUserReady ? "whatsapp" : "orange"}
        >
          {user?.name}
        </Tag>
      )}
    </VStack>
  );
};

const LobbyView = ({
  roomID,
  users,
  currentUser,
  isCurrentUserHost,
  isJoined,
}) => {
  const userList =
    users.length < 4
      ? [...users, ...new Array(4 - users.length).fill(null)]
      : users;
  console.log(userList);
  const isCurrentUserReady =
    users.find((user) => user?.id === currentUser?.id)?.isReady === true;

  // Event Handlers
  const readyButtonHandler = () => {
    socket.emit("playerReady", { room: roomID }, ({ error, user }) => {
      if (error) {
        alert(error);
      } else {
        console.log(user);
      }
    });
  };
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
            {userList.map((user, index) =>
              user ? (
                <UserCard
                  user={user}
                  key={user.id}
                  isCurrentUser={currentUser?.id === user.id}
                  isCurrentUserReady={user.isReady === true}
                  isUserHost={user.isHost}
                />
              ) : (
                <UserCard isEmpty={true} key={`null-${index + 1}`} />
              )
            )}
          </HStack>
          <Button
            colorScheme="teal"
            variant="solid"
            disabled={isCurrentUserReady}
            onClick={readyButtonHandler}
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

// TODO
const GameView = () => {};

export default function GameRoom() {
  const router = useRouter();
  const { id: roomID, name } = router.query;
  // Component States
  const [user, setUser] = useState(null);
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
      setRoom(room);
    });
  }, []);
  return (
    <div className={styles.container}>
      {roomStatus === "pending" && (
        <LobbyView
          isJoined={isJoined}
          roomID={roomID}
          users={room !== null ? room.players : mockUsers}
          currentUser={user}
          isCurrentUserHost={user?.isHost === true}
        ></LobbyView>
      )}
    </div>
  );
}
