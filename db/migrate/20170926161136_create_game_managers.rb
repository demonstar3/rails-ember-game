class CreateGameManagers < ActiveRecord::Migration[5.1]
  def change
    create_table :game_managers do |t|

      t.timestamps
    end
  end
end
