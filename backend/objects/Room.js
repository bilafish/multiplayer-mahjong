const Player = require("./Player");
const { roomPlayerLimit } = require("../constants/room");
const { isNil, remove } = require("ramda");

function Room(id) {
  this.id = id;
  this.players = [];
  this.roomStatus = "pending";

  // Methods
  this.addPlayer = ({ id, name }) => {
    // Check if player with name and is online already exist
    const existingPlayer = this.players.find((player) => player.name === name);
    if (!isNil(existingPlayer)) {
      // Existing player reconnecting with same name
      if (existingPlayer.isOnline === false && this.roomStatus !== "pending") {
        existingPlayer.isOnline = true;
        return {
          result: existingPlayer,
        };
      }
      return {
        error: `A player with name: ${name} already exists in room.`,
      };
    }
    // Check if room is full
    if (this.players.length === roomPlayerLimit) {
      return {
        error: "Room is already full.",
      };
    }
    const newPlayer = new Player({
      id,
      name,
      isHost: this.players.length === 0,
    });
    this.players.push(newPlayer);
    return {
      result: newPlayer,
    };
  };

  this.setPlayerReady = ({ id }) => {
    const existingPlayer = this.players.find((player) => player.id === id);
    if (isNil(existingPlayer)) {
      return {
        error: `Player with id: ${id} does not exist`,
      };
    }
    existingPlayer.isReady = true;
    return {
      result: existingPlayer,
    };
  };

  this.removePlayer = ({ id }) => {
    // Check if player exists
    const existingPlayerIndex = this.players.findIndex(
      (player) => player.id === id
    );
    if (existingPlayerIndex !== -1) {
      // Check if room status has started
      if (this.roomStatus !== "pending") {
        // Set Player object isOnline value
        this.players[existingPlayerIndex].isOnline = false;
        return {
          result: true,
        };
      }
      const newPlayerList = remove(existingPlayerIndex, 1, this.players);
      this.players = newPlayerList;
      return {
        result: true,
      };
    }
    return {
      error: `Player ${id} not found in room`,
    };
  };

  // // Getters/setters
  // Object.defineProperty(this, "id", {
  //   get: () => {
  //     return id;
  //   },
  // });
  // Object.defineProperty(this, "players", {
  //   get: () => {
  //     return players;
  //   },
  // });
}

module.exports = Room;
