import Ember from 'ember';
import DS from 'ember-data';

const { set, get, copy } = Ember;

export default DS.Model.extend({
  gameId: DS.attr('string'),
  status: DS.attr('string'),
  playerId: DS.attr('string'),
  currentPlayer: DS.attr('string'),
  players: DS.attr(),
  board: DS.attr(),

  join({ playerId }) {
    set(this, 'playerId', playerId)
    set(this, 'status', 'WAIT');
  },

  start({ players, currentPlayer }) {
    set(this, 'players', players);
    set(this, 'board', [Array(3), Array(3), Array(3)]);
    this.setCurrentPlayer(currentPlayer);
  },

  takeStep({ r, c, value, nextPlayer }) {
    const board = copy(get(this, 'board'), true);
    board[r][c] = value;
    set(this, 'board', board);

    this.setCurrentPlayer(nextPlayer);
  },

  end() {
    set(this, 'status', 'WAIT');
  },

  setCurrentPlayer(currentPlayer) {
    const isYourTurn = get(this, 'playerId') === currentPlayer;
    set(this, 'currentPlayer', currentPlayer);
    set(this, 'status', isYourTurn ? 'YOUR_TURN' : 'OPPONENT_TURN');
  }
});
