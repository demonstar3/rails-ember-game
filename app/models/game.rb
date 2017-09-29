class Game
  def initialize(game_id)
    @players = []
    @game_id = game_id
  end

  def join(player_id)
    return if @players.length == 2

    @players.push(player_id)
    ActionCable.server.broadcast("game_#{@game_id}", { event: "playerJoin", playerId: player_id })

    start if @players.length == 2
  end

  def leave(player_id)
    return if @players.find_index.nil?

    @players.delete(player_id)
    ActionCable.server.broadcast("game_#{@game_id}", { event: "playerLeft", playerId: player_id })
  end

  def start
    @board = [[], [], []]
    @empty_cell = 9
    @current_player = @players.first
    ActionCable.server.broadcast("game_#{@game_id}",
      { event: "gameStart", players: @players, currentPlayer: @current_player })
  end

  def withdraw(player_id)
    winner = player_id == @players.first ? @players.last : @players.first
    finalize_game(winner)
  end

  def take_step(player_id, data)
    r, c = data.values_at("r", "c")

    return if @board[r][c] && player_id != @current_player

    @board[r][c] = @current_player == @players.first ? 'X' : 'O'
    @empty_cell -= 1
    @current_player = @current_player == @players.first ? @players.last : @players.first
    ActionCable.server.broadcast("game_#{@game_id}",
      { event: "takeStep", nextPlayer: @current_player, r: r, c: c, value: @board[r][c] })

    check_winner
    check_draw
  end

  private
  def check_winner
    winner = check_row || check_col || check_dia
    puts @board[0]
    puts @board[1]
    puts @board[2]

    if winner
      winner = winner == 'X' ? @players.first : @players.last
      finalize_game(winner)
    end
  end

  def check_draw
    if @empty_cell == 0
      finalize_game(nil)
    end
  end

  def finalize_game(winner)
    ActionCable.server.broadcast("game_#{@game_id}", { event: "gameEnd", winner: winner })
    @players = []
  end

  def check_row
    for i in 0..2
      target = @board[i][0]
      if target && target == @board[i][1] && target == @board[i][2]
        return target
      end
    end

    false
  end

  def check_col
    for i in 0..2
      target = @board[0][i]
      if target && target == @board[1][i] && target == @board[2][i]
        return target
      end
    end

    false
  end

  def check_dia
    target = @board[1][1]
    if target &&
        (target == @board[0][0] && target == @board[2][2] ||
         target ==@board[0][2] && target == @board[2][0])
      return target
    end

    false
  end
end
