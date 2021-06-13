function Player({ id, name, isHost }) {
  this.id = id;
  this.name = name;
  this.isOnline = true;
  this.isHost = isHost;
  this.isReady = false;
}

module.exports = Player;
