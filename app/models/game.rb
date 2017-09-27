class Game
  def initialize(gameId)
    @players = []
    @gameId = gameId
  end

  def join(playerId)
    return if @players.length == 2

    @players.push(playerId)
    ActionCable.server.broadcast("game_#{@gameId}", { event: "playerJoin", playerId: playerId })

    start if @players.length == 2
  end

  def leave(playerId)
    return if @players.find_index.nil?

    @players.delete(playerId)
    ActionCable.server.broadcast("game_#{@gameId}", { event: "playerLeft", playerId: playerId })
  end

  def start
    @board = [[], [], []]
    ActionCable.server.broadcast("game_#{@gameId}", { event: "gameStart", players: @players })
  end
end
