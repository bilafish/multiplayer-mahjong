import styles from "../../styles/Home.module.css";
import {
  HStack,
  VStack,
  Center,
  Box,
  Button,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ENDPOINT = "http://localhost:5000";
let socket;

const CharacterSelection = ({
  isCurrentUser,
  isCurrentUserReady,
  isUserHost,
  selectedCharacter,
  roomID,
}) => {
  const { id, name } = selectedCharacter;

  // Event Handlers
  const changeCharacterButtonHandler = (selectedCharacterID) => {
    socket.emit(
      "playerChangeCharacter",
      { room: roomID, selectedCharacterID },
      ({ error, user }) => {
        if (error) {
          alert(error);
        } else {
          console.log(user);
        }
      }
    );
  };
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
      <Image src={`/img/character${id}.png`} width={200} height={200}></Image>
      <Center w="100%">
        <Button
          onClick={() => {
            let newCharacterID;
            if (id >= 2) {
              newCharacterID = id - 1;
            } else {
              newCharacterID = 3;
            }
            changeCharacterButtonHandler(newCharacterID);
          }}
          variant="ghost"
          colorScheme="pink"
          disabled={!isCurrentUser || isCurrentUserReady}
        >
          {"<"}
        </Button>
        <p style={{ margin: "0 1rem" }}>{name}</p>
        <Button
          onClick={() => {
            let newCharacterID;
            if (id < 3) {
              newCharacterID = id + 1;
            } else {
              newCharacterID = 1;
            }
            changeCharacterButtonHandler(newCharacterID);
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
  roomID,
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
        selectedCharacter={user.selectedCharacter}
        roomID={roomID}
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

const CopyRoomIDButton = ({ roomID }) => {
  const [showCopied, setShowCopied] = useState(false);

  return (
    <Box mb="2rem" color="white">
      <span>Jio your friends now! Game Link:</span>
      <CopyToClipboard
        text={`${window.location.origin}/room/join?room=${roomID}`}
        onCopy={() => {
          setShowCopied(true);
          setTimeout(() => {
            setShowCopied(false);
          }, 1500);
        }}
      >
        <Button
          variant={showCopied ? "solid" : "outline"}
          colorScheme="teal"
          ml="1rem"
        >
          {showCopied ? "Copied!" : roomID}
        </Button>
      </CopyToClipboard>
    </Box>
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
          marginBottom: "1rem",
        }}
      >
        Room Lobby
      </h1>
      <CopyRoomIDButton roomID={roomID} />
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
                  roomID={roomID}
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
          users={room !== null ? room.players : []}
          currentUser={user}
          isCurrentUserHost={user?.isHost === true}
        ></LobbyView>
      )}
    </div>
  );
}
