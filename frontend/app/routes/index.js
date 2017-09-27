import Ember from 'ember';
import { v4 } from "ember-uuid";

const { get, set, inject } = Ember;

export default Ember.Route.extend({
  queryParams: {
    gameId: { refreshModel: true }
  },

  cable: inject.service(),
  eventConsumer: inject.service(),

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

  afterModel(model){
    const gameId = get(model, 'gameId');
    const consumer = this.get('cable').createConsumer(`ws://${location.host}/cable`);

    const subscription = consumer.subscriptions.create({ channel: 'GameChannel', gameId }, {
      received: (data) => {
        console.log(data)
        const eventConsumer = get(this, 'eventConsumer');

        if (eventConsumer[data.event]) {
          eventConsumer[data.event](model, data);
        }
      }
    });

    set(this, 'consumer', consumer);
    set(this, 'subscription', subscription);
  }
});
