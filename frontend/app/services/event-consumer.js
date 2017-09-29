import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Service.extend({
  paperToaster: inject.service(),

  playerJoin(game, data) {
    if (get(game, 'playerId') && get(game, 'playerId') !== data.playerId) {
      get(this, 'paperToaster').show('Another player joined.');
    } else {
      game.join(data);
    }
  },

  playerLeft(game) {
    get(this, 'paperToaster').show('Your opponent has left the game.');
    game.left();
  },

  gameStart(game, data) {
    get(this, 'paperToaster').show('Game starts!');
    game.start(data);
  },

  gameEnd(game, data) {
    get(this, 'paperToaster').show('Game ends!');
    game.end(data);
  },

  takeStep(game, data) {
    game.takeStep(data);
  }
});
