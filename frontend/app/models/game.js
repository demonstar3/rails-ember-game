import Ember from 'ember';
import DS from 'ember-data';

const { set, get } = Ember;

const statusMap = {
  'WAIT': 'Wait for another player to join',
  'YOUR_TURN': 'Your turn',
  'OPPONENT_TURN': 'Wait for opponent to take action'
};

export default DS.Model.extend({
  gameId: DS.attr('string'),
  status: DS.attr('string'),
  playerId: DS.attr('string'),
  currentPlayer: DS.attr('string'),
  players: DS.attr(),
  board: DS.attr(),

  join(playerId) {
    set(this, 'playerId', playerId)
    this.setStatus('WAIT');
  },

  start(players) {
    set(this, 'players', players);
    set(this, 'board', [Array(3), Array(3), Array(3)]);
    this.setCurrentPlayer(players[0]);
  },

  setCurrentPlayer(currentPlayer) {
    const isYourTurn = get(this, 'playerId') === currentPlayer;
    set(this, 'currentPlayer', currentPlayer);
    this.setStatus(isYourTurn ? 'YOUR_TURN' : 'OPPONENT_TURN');
  },

  setStatus(statusCode) {
    set(this, 'status', statusMap[statusCode]);
  }
});
