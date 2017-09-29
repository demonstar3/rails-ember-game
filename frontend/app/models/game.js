import Ember from 'ember';
import DS from 'ember-data';

const { set, get, copy } = Ember;

export default DS.Model.extend({
  gameId: DS.attr('string'),
  status: DS.attr('string'),
  playerId: DS.attr('string'),
  currentPlayer: DS.attr('string'),
  winner: DS.attr('string'),
  players: DS.attr(),
  board: DS.attr(),

  join({ playerId }) {
    set(this, 'playerId', playerId)
    set(this, 'status', 'WAIT');
  },

  left() {
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

  end({ winner }) {
    set(this, 'winner', winner);
    set(this, 'status', 'END');
  },

  setCurrentPlayer(currentPlayer) {
    set(this, 'currentPlayer', currentPlayer);
    set(this, 'status', 'START');
  }
});
