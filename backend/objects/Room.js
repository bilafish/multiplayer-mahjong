const Player = require("./Player");
const { roomPlayerLimit } = require("../constants/room");
const { isNil } = require("ramda");

function Room(id) {
  this.id = id;
  this.players = [];

  // Methods
  this.addPlayer = ({ id, name }) => {
    // Check if player with name and is online already exist
    const existingPlayer = this.players.find((player) => player.name === name);
    if (!isNil(existingPlayer)) {
      // Existing player reconnecting with same name
      if (existingPlayer.isOnline === false) {
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

  this.removePlayer = ({ id }) => {
    // Check if player exists
    const existingPlayer = players.findIndex((player) => player.id === id);
    if (existingPlayer !== -1) {
      //TODO: remove player from array
      return;
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
