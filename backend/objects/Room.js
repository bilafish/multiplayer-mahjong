const Player = require("./Player");
const Room = (id) => {
  const id = id;
  const players = [];

  // Methods
  this.addPlayer = ({ id, name }) => {
    const newPlayer = new Player();
    players.push({
      id,
      name,
    });
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

  // Getters/setters
  Object.defineProperty(this, "id", {
    get: () => {
      return id;
    },
  });
};

module.exports = Room;
