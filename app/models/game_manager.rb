class GameManager
  @@games = {}

  def self.create_game(gameId)
    @@games[gameId] = Game.new(gameId)
  end

  def self.find_game(gameId)
    return @@games[gameId]
  end
end
