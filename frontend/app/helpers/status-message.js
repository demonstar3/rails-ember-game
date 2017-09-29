import Ember from 'ember';

const { get } = Ember;

const statusMap = {
  'WAIT': 'Wait for another player to join',
  'YOUR_TURN': 'Your turn',
  'OPPONENT_TURN': 'Wait for opponent to take action',
  'YOU_WIN': 'You win',
  'YOU_LOST': 'You lost',
};

export function statusMessage([game, status]) {
  const playerId = get(game, 'playerId');

  if (status === 'START') {
    const currentPlayer = get(game, 'currentPlayer');
    const isYouTurn = playerId === currentPlayer;
    status = isYouTurn ? 'YOUR_TURN' : 'OPPONENT_TURN';
  }

  if (status === 'END') {
    const winner = get(game, 'winner');
    const isYouWin = playerId === winner;
    status = isYouWin ? 'YOU_WIN' : 'YOU_LOST'
  }

  return statusMap[status];
}

export default Ember.Helper.helper(statusMessage);
