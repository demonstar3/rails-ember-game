import Ember from 'ember';

const { get, computed } = Ember;

const STATUS_MESSAGES = {
  'WAIT': 'Wait for another player to join',
  'YOUR_TURN': 'Your turn',
  'OPPONENT_TURN': 'Wait for opponent to take action',
  'YOU_WIN': 'You win',
  'YOU_LOST': 'You lost',
  'DRAW': 'Draw'
};

const ACTION_TEXT = {
  'WAIT': 'Share link',
  'START': 'Withdraw',
  'END': 'Restart',
};

export default Ember.Component.extend({
  statusMessage: computed('game.{status,currentPlayer}', function() {
    const game = get(this, 'game');
    const playerId = get(game, 'playerId');
    let status = get(game, 'status');

      if (status === 'START') {
        const currentPlayer = get(game, 'currentPlayer');
        const isYouTurn = playerId === currentPlayer;
        status = isYouTurn ? 'YOUR_TURN' : 'OPPONENT_TURN';
      }

      if (status === 'END') {
        const winner = get(game, 'winner');

        if (!winner) {
          status = 'DRAW';
        } else {
          const isYouWin = playerId === winner;
          status = isYouWin ? 'YOU_WIN' : 'YOU_LOST'
        }
      }

      return STATUS_MESSAGES[status];
  }),

  actionText: computed('game.status', function() {
    return ACTION_TEXT[get(this, 'game.status')]
  })
});
