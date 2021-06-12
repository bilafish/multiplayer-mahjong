function Player({ id, name, isHost }) {
  this.id = id;
  this.name = name;
  this.isOnline = true;
  this.isHost = isHost;
}

module.exports = Player;
