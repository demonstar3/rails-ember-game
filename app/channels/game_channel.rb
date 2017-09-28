class GameChannel < ApplicationCable::Channel
  def subscribed
    game_id = params[:game_id]
    stream_from "game_#{game_id}"

    game = GameManager.find_game(game_id)
    if game.nil?
      game = GameManager.create_game(game_id)
    end
    game.join(uuid)
  end

  def unsubscribed
    game = GameManager.find_game(params[:game_id])
    game.leave(uuid)
  end

  def take_step(data)
    game = GameManager.find_game(params[:game_id])
    game.take_step(uuid, data)
  end
end
