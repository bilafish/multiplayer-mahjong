const characters = require("../constants/characters");

function Player({ id, name, isHost }) {
  this.id = id;
  this.name = name;
  this.isOnline = true;
  this.isHost = isHost;
  this.isReady = false;
  this.selectedCharacter = characters[1];
}

module.exports = Player;
