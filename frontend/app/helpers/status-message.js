import Ember from 'ember';

const statusMap = {
  'WAIT': 'Wait for another player to join',
  'YOUR_TURN': 'Your turn',
  'OPPONENT_TURN': 'Wait for opponent to take action'
};

export function statusMessage([status]) {
  return statusMap[status];
}

export default Ember.Helper.helper(statusMessage);
