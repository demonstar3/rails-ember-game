import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Service.extend({
  paperToaster: inject.service(),

  playerJoin(game, data) {
    if (get(game, 'playerId')) {
      get(this, 'paperToaster').show('Another player joined.');
    } else {
      game.join(data.playerId);
    }
  },

  playerLeft(game) {
    get(this, 'paperToaster').show('Your opponent has left the game.');
    game.setStatus('WAIT');
  },

  gameStart(game, data) {
    get(this, 'paperToaster').show('Game starts!');
    game.start(data.players);
  }
});
