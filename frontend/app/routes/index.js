import Ember from 'ember';
import { v4 } from "ember-uuid";

const { get } = Ember;

export default Ember.Route.extend({
  queryParams: {
    gameId: { refreshModel: true }
  },

  beforeModel(transition) {
    if (!transition.queryParams.gameId) {
      return this.replaceWith('index', {
        queryParams: {
          gameId: v4()
        }
      });
    }
  },

  model(params) {
    return get(this, 'store').createRecord('game', {
      gameId: params.gameId,
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.setupCable();
  }
});
