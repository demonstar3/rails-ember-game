class GameChannel < ApplicationCable::Channel
  def subscribed
    gameId = params[:gameId]
    stream_from "game_#{gameId}"

    game = GameManager.find_game(gameId)
    if game.nil?
      game = GameManager.create_game(gameId)
    end
    game.join(uuid)
  end

  def unsubscribed
    game = GameManager.find_game(params[:gameId])
    game.leave(uuid)
  end

  def ping(data)
    ActionCable.server.broadcast("game_#{params[:gameId]}", { event: "gameStart", uuid: uuid })
  end
end
