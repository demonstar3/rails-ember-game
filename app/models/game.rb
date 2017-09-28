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
    @current_player = @players.first
    ActionCable.server.broadcast("game_#{@game_id}",
      { event: "gameStart", players: @players, currentPlayer: @current_player })
  end

  def take_step(uuid, data)
    r, c = data.values_at("r", "c")

    return if @board[r][c] && uuid != @current_player

    @board[r][c] = @current_player == @players.first ? 'X' : 'O'
    @current_player = @current_player == @players.first ? @players.last : @players.first
    ActionCable.server.broadcast("game_#{@game_id}",
      { event: "takeStep", nextPlayer: @current_player, r: r, c: c, value: @board[r][c] })
  end
end
