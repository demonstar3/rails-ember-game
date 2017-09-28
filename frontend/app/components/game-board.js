import Ember from 'ember';

const { get } = Ember;
export default Ember.Component.extend({
  actions: {
    onClickBoard(rIndex, cIndex) {
      get(this, 'onClickBoard')(rIndex, cIndex);
    }
  }
});
