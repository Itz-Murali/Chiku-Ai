
# ============================================================
#                    Chiku AI • Version 2
# ============================================================
#
#  Developed with ❤️ by Anya
#  Special thanks to Murali for support and contributions
#
#  Support / Bug Reports:
#  Open an issue 
#
#  License:
#  This project is released under the MIT License.
#  You are free to use, modify, and distribute this code.
#
#  Credits:
#  If you use this source code or parts of it,
#  please give proper credit to the original developers.
#
#  © Team Chiku — All Rights Reserved
# ============================================================


require 'mongo'
require 'set'
require_relative '../config'

module ChikuDB

  @seen_users = Set.new
  @seen_chats = Set.new
  @cache_lock = Mutex.new


  def self.client
    @client ||= Mongo::Client.new(
      MONGO_URL,
      database:                 'chiku',
      server_selection_timeout: 5,
      connect_timeout:          5,
      socket_timeout:           5,
      max_pool_size:            5,
      min_pool_size:            1
    )
  end

  def self.users_col = client[:users]
  def self.chats_col = client[:chats]



  def self.async_write(&block)
    Thread.new do
      begin
        block.call
      rescue => e
        puts "⚠️  ChikuDB async_write: #{e.message}"
      end
    end
  end



  def self.save_user(user_id)
    return if user_id.nil?
    uid = user_id.to_i

    return if @cache_lock.synchronize { @seen_users.include?(uid) }

    @cache_lock.synchronize { @seen_users.add(uid) }


    async_write do
      users_col.update_one(
        { _id: uid },
        { '$setOnInsert' => { _id: uid } },
        upsert: true
      )
    end
  end

  def self.all_user_ids
    users_col.find.map { |doc| doc['_id'] }
  rescue => e
    puts "⚠️  ChikuDB.all_user_ids: #{e.message}"
    []
  end



  def self.save_chat(chat_id)
    return if chat_id.nil?
    cid = chat_id.to_i
    return if @cache_lock.synchronize { @seen_chats.include?(cid) }

    @cache_lock.synchronize { @seen_chats.add(cid) }

    async_write do
      chats_col.update_one(
        { _id: cid },
        { '$setOnInsert' => { _id: cid } },
        upsert: true
      )
    end
  end

  def self.all_chat_ids
    chats_col.find.map { |doc| doc['_id'] }
  rescue => e
    puts "⚠️  ChikuDB.all_chat_ids: #{e.message}"
    []
  end

  # Returns MongoDB storage stats for the 'chiku' database (scale: bytes)
  def self.db_stats
    client.database.command(dbStats: 1, scale: 1).first
  rescue => e
    puts "⚠️  ChikuDB.db_stats: #{e.message}"
    nil
  end

  # Returns per-collection stats (scale: bytes)
  def self.col_stats(collection_name)
    client.database.command(collStats: collection_name, scale: 1).first
  rescue => e
    puts "⚠️  ChikuDB.col_stats(#{collection_name}): #{e.message}"
    nil
  end

  # Returns server build info
  def self.server_info
    client.database.command(buildInfo: 1).first
  rescue => e
    puts "⚠️  ChikuDB.server_info: #{e.message}"
    nil
  end

  # Returns server status (connections, uptime, etc)
  def self.server_status
    client.database.command(serverStatus: 1).first
  rescue => e
    puts "⚠️  ChikuDB.server_status: #{e.message}"
    nil
  end
end
