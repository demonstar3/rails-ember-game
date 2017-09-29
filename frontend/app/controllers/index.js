import Ember from 'ember';

const { get, set, inject, computed } = Ember;

export default Ember.Controller.extend({
  cable: inject.service(),
  eventConsumer: inject.service(),
  paperToaster: inject.service(),

  shareLink: computed(function() {
    return location.href;
  }),

  setupCable() {
    const model = get(this, 'model');
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
  },

  actions: {
    onClickBoard(rowIndex, colIndex) {
      const model = get(this, 'model');

      if (get(model, 'playerId') !== get(model, 'currentPlayer')) {
        return;
      }

      if (get(model, 'board')[rowIndex][colIndex]) {
        get(this, 'paperToaster').show('The cell has been taken.');
        return;
      }

      get(this, 'subscription').perform('take_step', { r: rowIndex, c: colIndex })
    },

    onClickAction() {
      const status = get(this, 'model.status');

      if (status === 'WAIT') {
        set(this, 'showDialog', true);
      } else if (status === 'START') {
        get(this, 'subscription').perform('withdraw');
      } else if (status === 'END') {
        get(this, 'subscription').perform('join');
      }
    },

    closeDialog() {
      set(this, 'showDialog', false);
    }
  }
});
