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
 

require 'json'
require 'open3'
require 'net/http'
require 'uri'
require_relative '../config'
require_relative 'ai'
require_relative 'chiku'
require_relative 'webhook'
require_relative 'mongodb'

def owner?(user_id)
  defined?(OWNER_IDS) && Array(OWNER_IDS).include?(user_id.to_i)
end

def admin?(chat_id, user_id)
  return true if owner?(user_id)
  result = Chiku.get_chat_member(chat_id, user_id)
  %w[administrator creator].include?(result&.dig('result', 'status'))
end

def resolve_target(params, text_after_cmd)
  reply_msg = params[:message]['reply_to_message']
  if reply_msg
    u = reply_msg['from']
    return {
      user_id:    u['id'],
      first_name: u['first_name'] || u['username'] || 'User',
      username:   u['username'],
      source:     :reply
    }
  end
  arg = text_after_cmd.strip.sub(/^@/, '')
  return nil if arg.empty?
  { user_id: nil, first_name: arg, username: arg, source: :text }
end

def mention(target)
  name = target[:first_name].to_s.strip
  name = "User" if name.empty?
  uid  = target[:user_id]
  "[#{name}](tg://user?id=#{uid})"
end

def parse_duration(str)
  return 0 if str.nil? || str.empty?
  units = { 's' => 1, 'm' => 60, 'h' => 3600, 'd' => 86_400 }
  str.scan(/(\d+)([smhd])/i).sum { |n, u| n.to_i * (units[u.downcase] || 1) }
end

SHIP_EMOJIS = %w[💔 💞 💕 💖 💗 💓 💝 ❣️ 💘 🔥 ✨ 😭 👀 💀 🫶].freeze

Chiku.command '/start' do |params|
  ChikuDB.save_user(params[:user_id])

  name     = params[:first_name] || 'stranger'
  username = params[:message]&.dig('from', 'username')
  user_id  = params[:user_id]
  chat_id  = params[:chat_id]
  uname_str   = username ? "@#{username}" : 'no username'
  mention_str = "<a href=\"tg://user?id=#{user_id}\">#{name}</a>"

  # Notify logger group with clickable mention
  Chiku.log_to_gc(<<~LOG.strip)
    🚀 <b>New /start</b>

    👤 <b>User:</b> #{mention_str}
    🪪 <b>User ID:</b> <code>#{user_id}</code>
    📛 <b>Username:</b> #{uname_str}
    💬 <b>Chat ID:</b> <code>#{chat_id}</code>
    🕐 <b>Time:</b> #{Chiku.ist_now}
  LOG

  gif_url = Chiku.fetch_neko('wave')
  text    = Chiku.build_start_text(name)

  keyboard = [[{ text: '📖 What can you do?', callback_data: 'show_help' }]]

  if gif_url
    Chiku.send_animation_with_keyboard(params[:chat_id], gif_url, text, keyboard, params[:reply_to_id])
  else
    Chiku.send_message_with_keyboard(params[:chat_id], text, keyboard, params[:reply_to_id])
  end
end

Chiku.command '/help' do |params|
  Chiku.send_message(params[:chat_id], Chiku::HELP_TEXT, params[:reply_to_id])
end

Chiku.command '/stats' do |params|
  unless owner?(params[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 /stats is for bot owners only~", params[:reply_to_id])
    next
  end

  Chiku.send_chat_action(params[:chat_id], 'typing')

  begin
    user_count = ChikuDB.all_user_ids.length
    chat_count = ChikuDB.all_chat_ids.length
    total_docs = user_count + chat_count

    # ── Uptime (with seconds) ──
    uptime_raw = File.read('/proc/uptime').split.first.to_f rescue 0
    uptime_d   = (uptime_raw / 86_400).to_i
    uptime_h   = ((uptime_raw % 86_400) / 3600).to_i
    uptime_m   = ((uptime_raw % 3600) / 60).to_i
    uptime_s   = (uptime_raw % 60).to_i
    uptime_str = [
      uptime_d > 0 ? "#{uptime_d}d" : nil,
      uptime_h > 0 ? "#{uptime_h}h" : nil,
      uptime_m > 0 ? "#{uptime_m}m" : nil,
      "#{uptime_s}s"
    ].compact.join(' ')

    # ── RAM ──
    mem_info  = File.read('/proc/meminfo') rescue ''
    mem_total = mem_info.match(/MemTotal:\s+(\d+)/)[1].to_i / 1024 rescue 0
    mem_avail = mem_info.match(/MemAvailable:\s+(\d+)/)[1].to_i / 1024 rescue 0
    mem_used  = mem_total - mem_avail

    # ── CPU cores ──
    cpu_info  = File.read('/proc/cpuinfo') rescue ''
    cpu_cores = cpu_info.scan(/^processor\s*:/).length rescue 1
    cpu_cores = 1 if cpu_cores < 1

    # ── Runtime ──
    ruby_ver = RUBY_VERSION rescue 'unknown'
    pid      = Process.pid
    threads  = Thread.list.length
    now_ist  = Chiku.ist_now

    # ── Helper: bytes → human readable ──
    fmt_bytes = lambda do |bytes|
      b = bytes.to_f
      return "#{b.to_i} B"       if b < 1_024
      return "#{(b/1024).round(2)} KB"  if b < 1_048_576
      return "#{(b/1_048_576).round(2)} MB" if b < 1_073_741_824
      "#{(b/1_073_741_824).round(2)} GB"
    end

    # ── MongoDB: dbStats ──
    db   = ChikuDB.db_stats
    srv  = ChikuDB.server_status
    info = ChikuDB.server_info
    u_cs = ChikuDB.col_stats('users')
    c_cs = ChikuDB.col_stats('chats')

    if db
      db_collections  = db['collections'].to_i
      db_objects      = db['objects'].to_i
      db_data_size    = fmt_bytes.(db['dataSize'].to_i)
      db_storage_size = fmt_bytes.(db['storageSize'].to_i)
      db_index_size   = fmt_bytes.(db['indexSize'].to_i)
      db_total_size   = fmt_bytes.((db['storageSize'].to_i + db['indexSize'].to_i))
      db_indexes      = db['indexes'].to_i
      db_avg_obj      = db_objects > 0 ? fmt_bytes.((db['dataSize'].to_f / db_objects).to_i) : 'N/A'
      db_status       = '✅ Connected'
    else
      db_collections = db_objects = db_data_size = db_storage_size =
      db_index_size  = db_total_size = db_indexes = db_avg_obj = 'N/A'
      db_status = '❌ Error'
    end

    # Per-collection stats
    u_docs  = u_cs ? u_cs['count'].to_i          : user_count
    u_size  = u_cs ? fmt_bytes.(u_cs['size'].to_i)      : 'N/A'
    u_stor  = u_cs ? fmt_bytes.(u_cs['storageSize'].to_i) : 'N/A'
    u_idx   = u_cs ? fmt_bytes.(u_cs['totalIndexSize'].to_i) : 'N/A'

    c_docs  = c_cs ? c_cs['count'].to_i          : chat_count
    c_size  = c_cs ? fmt_bytes.(c_cs['size'].to_i)      : 'N/A'
    c_stor  = c_cs ? fmt_bytes.(c_cs['storageSize'].to_i) : 'N/A'
    c_idx   = c_cs ? fmt_bytes.(c_cs['totalIndexSize'].to_i) : 'N/A'

    # Server info
    mongo_ver  = info ? info['version'].to_s         : 'N/A'
    mongo_bits = info ? info['bits'].to_i            : 'N/A'
    mongo_os   = info ? info.dig('buildEnvironment', 'distmod').to_s : 'N/A'
    mongo_os   = 'N/A' if mongo_os.empty?

    # Server status
    if srv
      srv_uptime   = srv['uptimeEstimate'].to_i
      sv_d = srv_uptime / 86_400; sv_h = (srv_uptime % 86_400)/3600
      sv_m = (srv_uptime % 3600)/60; sv_s = srv_uptime % 60
      srv_uptime_str = [
        sv_d > 0 ? "#{sv_d}d" : nil, sv_h > 0 ? "#{sv_h}h" : nil,
        sv_m > 0 ? "#{sv_m}m" : nil, "#{sv_s}s"
      ].compact.join(' ')
      conns_current = srv.dig('connections', 'current').to_i
      conns_avail   = srv.dig('connections', 'available').to_i
      ops_insert    = srv.dig('opcounters', 'insert').to_i
      ops_query     = srv.dig('opcounters', 'query').to_i
      ops_update    = srv.dig('opcounters', 'update').to_i
      net_in        = fmt_bytes.(srv.dig('network', 'bytesIn').to_i)
      net_out       = fmt_bytes.(srv.dig('network', 'bytesOut').to_i)
      mem_resident  = srv.dig('mem', 'resident').to_i  # MB
      mem_virtual   = srv.dig('mem', 'virtual').to_i   # MB
    else
      srv_uptime_str = conns_current = conns_avail = ops_insert =
      ops_query = ops_update = net_in = net_out = mem_resident = mem_virtual = 'N/A'
    end

    stats_msg = <<~STATS.strip
      📊 <b>Chiku — Bot Statistics</b>
      <i>#{now_ist}</i>

      ━━━━━━━━━━━━━━━━━━━━━
      👥 <b>Users &amp; Reach</b>
        👤 Total Users   : <b>#{user_count}</b>
        💬 Total Groups  : <b>#{chat_count}</b>
        📦 Total Records : <b>#{total_docs}</b>

      ━━━━━━━━━━━━━━━━━━━━━
      🗄 <b>MongoDB — Database</b>
        🔗 Status        : #{db_status}
        📂 Database      : <code>chiku</code>
        📋 Collections   : <b>#{db_collections}</b>
        🗃 Documents     : <b>#{db_objects}</b>
        🔑 Indexes       : <b>#{db_indexes}</b>
        📄 Avg Doc Size  : #{db_avg_obj}

      💽 <b>MongoDB — Storage</b>
        📦 Data Size     : <b>#{db_data_size}</b>
        🗜 Storage Size  : <b>#{db_storage_size}</b>
        🔍 Index Size    : <b>#{db_index_size}</b>
        📊 Total On Disk : <b>#{db_total_size}</b>

      📁 <b>MongoDB — Collections</b>
        👤 <code>users</code>  → #{u_docs} docs · #{u_size} data · #{u_stor} storage · #{u_idx} idx
        💬 <code>chats</code>  → #{c_docs} docs · #{c_size} data · #{c_stor} storage · #{c_idx} idx

      🖥 <b>MongoDB — Server</b>
        🔢 Version       : <b>v#{mongo_ver}</b> (#{mongo_bits}-bit)
        ⏱ Server Uptime : #{srv_uptime_str}
        🔌 Connections   : #{conns_current} active · #{conns_avail} available
        💾 Mongo RAM     : #{mem_resident} MB resident · #{mem_virtual} MB virtual
        🌐 Network In    : #{net_in}
        🌐 Network Out   : #{net_out}
        ✍️ Ops Insert    : #{ops_insert}
        🔍 Ops Query     : #{ops_query}
        ✏️ Ops Update    : #{ops_update}

      ━━━━━━━━━━━━━━━━━━━━━
      🖥 <b>System</b>
        ⏱ Uptime        : <b>#{uptime_str}</b>
        💾 RAM           : <b>#{mem_used} MB</b> used · #{mem_avail} MB free
        ⚙️ CPU Cores     : <b>#{cpu_cores}</b>

      ━━━━━━━━━━━━━━━━━━━━━
      💎 <b>Runtime</b>
        🔢 Ruby          : v#{ruby_ver}
        🔄 Threads       : #{threads}
        🆔 PID           : <code>#{pid}</code>

      ━━━━━━━━━━━━━━━━━━━━━
      🤖 <b>Bot Config</b>
        🆔 Bot ID        : <code>#{BOT_ID}</code>
        👑 Owners        : #{OWNER_IDS.length}
        📡 Logger GC     : <code>#{LOGGER_GC_ID}</code>
    STATS

    Chiku.send_message(params[:chat_id], stats_msg, params[:reply_to_id])

  rescue => e
    Chiku.send_message(params[:chat_id], "❌ Stats fetch failed: #{e.message}", params[:reply_to_id])
  end
end

Chiku.command '/gcast', prefix: true do |params|
  unless owner?(params[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Only bot owners can use /gcast~", params[:reply_to_id])
    next
  end

  reply_msg = params[:message]['reply_to_message']
  cast_text = params[:cleaned_text].sub(/^\/gcast\s*/i, '').strip

  if reply_msg.nil? && cast_text.empty?
    Chiku.send_message(params[:chat_id], "Usage: /gcast <message>  — or — reply to a message with /gcast", params[:reply_to_id])
    next
  end

  all_ids = (ChikuDB.all_user_ids + ChikuDB.all_chat_ids).uniq

  if all_ids.empty?
    Chiku.send_message(params[:chat_id], "No users or groups in DB yet~", params[:reply_to_id])
    next
  end

  sent = 0; failed = 0

  all_ids.each do |target_id|
    begin
      if reply_msg
        Chiku.tg_post('forwardMessage', {
          'chat_id'      => target_id.to_s,
          'from_chat_id' => params[:chat_id].to_s,
          'message_id'   => reply_msg['message_id'].to_s
        })
      else
        Chiku.send_message(target_id, cast_text)
      end
      sent += 1
    rescue => e
      failed += 1
      puts "⚠️  gcast failed for #{target_id}: #{e.message}"
    end
    sleep(0.05)
  end

  Chiku.send_message(params[:chat_id], "📢 Broadcast done!\n✅ Sent: #{sent}\n❌ Failed: #{failed}", params[:reply_to_id])
end

Chiku.command '/reactions' do |params|
  cats = {
    "💖 Affection"    => %w[hug kiss cuddle pat handhold blowkiss lappillow peck carry kabedon],
    "😊 Emotions"     => %w[happy smile blush wink smug pout cry laugh bored yawn think],
    "🎉 Hype"         => %w[dance wave clap highfive spin thumbsup salute handshake],
    "😤 Combat"       => %w[slap punch kick bonk baka yeet bite poke tickle tableflip],
    "🤔 Reactions"    => %w[confused shocked facepalm shrug nod nope stare lurk],
    "✨ Misc"          => %w[nom nya sip wag feed bleh teehee run shake sleep shoot],
  }
  lines = [
    "🌸 <b>All Reaction GIFs</b>",
    "<i>Use /hug @name · reply to someone + /pat · or just tell me naturally~</i>",
    ""
  ]
  cats.each { |c, cmds| lines << "#{c}  #{cmds.map { |x| "/#{x}" }.join(' ')}" }
  Chiku.send_message(params[:chat_id], lines.join("\n"), params[:reply_to_id])
end

Chiku.command '/reset' do |params|
  HISTORY.clear
  Chiku.send_message(params[:chat_id], "memory cleared~ fresh start 🌸", params[:reply_to_id])
end

Chiku.command '/weather', prefix: true do |params|
  city = params[:cleaned_text].to_s.sub(/^\/weather\s*/i, '').strip

  if city.empty?
    Chiku.send_message(params[:chat_id],
      "Usage: <code>/weather &lt;city&gt;</code>\nExample: <code>/weather Bengaluru</code>",
      params[:reply_to_id])
    next
  end

  Chiku.send_chat_action(params[:chat_id], 'typing')

  result = Chiku.fetch_weather(city)

  if result && !result.empty?
    Chiku.send_message(params[:chat_id],
      "🌤 <b>Weather in #{city}:</b>\n#{result}",
      params[:reply_to_id])
  else
    Chiku.send_message(params[:chat_id],
      "Couldn't fetch weather for <b>#{city}</b>.\nCheck the city name and try again~",
      params[:reply_to_id])
  end
end

Chiku.command '/quote' do |params|
  Chiku.send_chat_action(params[:chat_id], 'typing')
  data = Chiku.fetch_quote
  if data
    Chiku.send_message(params[:chat_id], "💬 <i>\"#{data[:quote]}\"</i>\n— <b>#{data[:author]}</b>", params[:reply_to_id])
  else
    QUOTES = [
      { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
      { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    ] unless defined?(QUOTES)
    data = QUOTES.sample
    Chiku.send_message(params[:chat_id], "💬 <i>\"#{data[:quote]}\"</i>\n— <b>#{data[:author]}</b>", params[:reply_to_id])
  end
end

Chiku.command '/fact' do |params|
  Chiku.send_chat_action(params[:chat_id], 'typing')
  fact = Chiku.fetch_fact
  Chiku.send_message(params[:chat_id], "💡 <b>Random Fact</b>\n#{fact || 'Octopuses have three hearts, blue blood, and can taste with their suckers.'}", params[:reply_to_id])
end

Chiku.command '/joke' do |params|
  Chiku.send_chat_action(params[:chat_id], 'typing')
  data = Chiku.fetch_joke
  if data
    if data[:single]
      Chiku.send_message(params[:chat_id], "😂 #{data[:single]}", params[:reply_to_id])
    else
      Chiku.send_message(params[:chat_id], "😂 #{data[:setup]}", params[:reply_to_id])
      sleep(1.2)
      Chiku.send_message(params[:chat_id], "...#{data[:delivery]} 💀", params[:reply_to_id])
    end
  else
    Chiku.send_message(params[:chat_id], "couldn't fetch a joke rn 😔", params[:reply_to_id])
  end
end

Chiku.command '/ship', prefix: true do |params|
  raw   = params[:cleaned_text].sub(/^\/ship\s*/i, '').strip
  parts = raw.split(/\s+/, 2)

  if parts.length < 2
    Chiku.send_message(params[:chat_id], "Usage: /ship @user1 @user2\nExample: /ship @Chiku @Murali", params[:reply_to_id])
    next
  end

  u1      = parts[0].sub(/^@/, '')
  u2      = parts[1].sub(/^@/, '')
  score   = rand(1..100)
  emoji   = SHIP_EMOJIS.sample
  bar_len = (score / 10.0).round
  bar     = ("❤️" * bar_len).ljust(10, "🖤")

  comment = case score
            when 90..100 then "SOULMATES?? 😭🔥"
            when 75..89  then "something's definitely there~"
            when 55..74  then "hmm could work tbh"
            when 35..54  then "mid but not impossible~"
            when 15..34  then "rough but love is unpredictable"
            else              "bro just no 💀"
            end

  Chiku.send_message(
    params[:chat_id],
    "#{emoji} <b>#{u1}</b> + <b>#{u2}</b>\n#{bar} <b>#{score}%</b>\n<i>#{comment}</i>",
    params[:reply_to_id]
  )
end

Chiku.command '/id' do |params|
  msg     = params[:message]
  user_id = msg['from']['id']
  chat_id = msg['chat']['id']
  name    = msg['from']['first_name'] || 'User'

  extra = ""
  if msg['reply_to_message']
    t     = msg['reply_to_message']['from']
    extra = "\n👤 <b>#{t['first_name']}</b> — <code>#{t['id']}</code>"
  end

  Chiku.send_message(
    params[:chat_id],
    "👤 <b>#{name}</b> — <code>#{user_id}</code>#{extra}\n💬 Chat ID: <code>#{chat_id}</code>",
    params[:reply_to_id]
  )
end

Chiku.command '/info' do |params|
  msg     = params[:message]
  chat_id = params[:chat_id]
  reply   = params[:reply_to_id]

  if msg['reply_to_message']
    u    = msg['reply_to_message']['from']
    name = [u['first_name'], u['last_name']].compact.join(' ')
    info = <<~INFO.strip
      👤 <b>User Info</b>
      Name: <b>#{name}</b>
      Username: #{u['username'] ? "@#{u['username']}" : 'none'}
      ID: <code>#{u['id']}</code>
      Bot: #{u['is_bot'] ? 'yes' : 'no'}
    INFO
    if %w[group supergroup].include?(msg['chat']['type'])
      status = Chiku.get_chat_member(chat_id, u['id'])&.dig('result', 'status') || 'unknown'
      info  += "\nStatus: #{status}"
    end
    Chiku.send_message(chat_id, info, reply)
  else
    c     = Chiku.get_chat(chat_id)&.dig('result') || {}
    count = Chiku.get_chat_member_count(chat_id)
    Chiku.send_message(chat_id, <<~INFO.strip, reply)
      💬 <b>Chat Info</b>
      Title: <b>#{c['title'] || c['first_name'] || 'Unknown'}</b>
      Username: #{c['username'] ? "@#{c['username']}" : 'none'}
      Type: #{c['type'] || 'unknown'}
      ID: <code>#{chat_id}</code>
      Members: #{count}
    INFO
  end
end

Chiku.command '/del' do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin for that~", params[:reply_to_id]); next
  end
  reply_msg = params[:message]['reply_to_message']
  unless reply_msg
    Chiku.send_message(params[:chat_id], "reply to the message you want to delete~", params[:reply_to_id]); next
  end
  Chiku.delete_message(params[:chat_id], reply_msg['message_id'])
end

Chiku.command '/pin' do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  reply_msg = params[:message]['reply_to_message']
  unless reply_msg
    Chiku.send_message(params[:chat_id], "reply to the message to pin~", params[:reply_to_id]); next
  end
  Chiku.pin_message(params[:chat_id], reply_msg['message_id'])
  Chiku.send_message(params[:chat_id], "📌 pinned~", params[:reply_to_id])
end

Chiku.command '/unpin' do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  reply_msg = params[:message]['reply_to_message']
  Chiku.unpin_message(params[:chat_id], reply_msg&.dig('message_id'))
  Chiku.send_message(params[:chat_id], "unpinned~", params[:reply_to_id])
end

Chiku.command '/unpinall' do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  Chiku.unpin_all_messages(params[:chat_id])
  Chiku.send_message(params[:chat_id], "all pins cleared~", params[:reply_to_id])
end

Chiku.command '/ban', prefix: true do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  target = resolve_target(params, params[:cleaned_text].sub(/^\/ban\s*/i, ''))
  unless target&.[](:user_id)
    Chiku.send_message(params[:chat_id], "reply to the user you want to ban~", params[:reply_to_id]); next
  end
  if owner?(target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Can't ban a bot owner~", params[:reply_to_id]); next
  end
  if admin?(params[:chat_id], target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Can't ban a chat admin~", params[:reply_to_id]); next
  end
  Chiku.ban_chat_member(params[:chat_id], target[:user_id])
  gif = Chiku.fetch_neko('punch')
  caption = "🔨 #{mention(target)} has been banned from the group~"
  if gif
    Chiku.send_animation(params[:chat_id], gif, caption, params[:reply_to_id], 'Markdown')
  else
    Chiku.send_message(params[:chat_id], caption, params[:reply_to_id], 'Markdown')
  end
end

Chiku.command '/unban', prefix: true do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  target = resolve_target(params, params[:cleaned_text].sub(/^\/unban\s*/i, ''))
  unless target&.[](:user_id)
    Chiku.send_message(params[:chat_id], "reply to the user you want to unban~", params[:reply_to_id]); next
  end
  if owner?(target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Bot owners are never banned~", params[:reply_to_id]); next
  end
  Chiku.unban_chat_member(params[:chat_id], target[:user_id])
  Chiku.send_message(params[:chat_id], "✅ #{mention(target)} has been unbanned~", params[:reply_to_id], 'Markdown')
end

Chiku.command '/kick', prefix: true do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  target = resolve_target(params, params[:cleaned_text].sub(/^\/kick\s*/i, ''))
  unless target&.[](:user_id)
    Chiku.send_message(params[:chat_id], "reply to the user you want to kick~", params[:reply_to_id]); next
  end
  Chiku.ban_chat_member(params[:chat_id], target[:user_id])
  Chiku.unban_chat_member(params[:chat_id], target[:user_id])
  gif = Chiku.fetch_neko('kick')
  caption = "👟 #{mention(target)} got kicked out of the group~"
  if gif
    Chiku.send_animation(params[:chat_id], gif, caption, params[:reply_to_id], 'Markdown')
  else
    Chiku.send_message(params[:chat_id], caption, params[:reply_to_id], 'Markdown')
  end
end

Chiku.command '/mute', prefix: true do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  target = resolve_target(params, '')
  unless target&.[](:user_id)
    Chiku.send_message(params[:chat_id], "reply to the user you want to mute~", params[:reply_to_id]); next
  end
  if owner?(target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Can't mute a bot owner~", params[:reply_to_id]); next
  end
  if admin?(params[:chat_id], target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Can't mute a chat admin~", params[:reply_to_id]); next
  end
  dur_str    = params[:cleaned_text].sub(/^\/mute\s*/i, '').strip
  seconds    = parse_duration(dur_str)
  until_date = seconds > 0 ? (Time.now.to_i + seconds) : 0
  label      = seconds > 0 ? " for #{dur_str}" : " indefinitely"
  Chiku.restrict_chat_member(params[:chat_id], target[:user_id], until_date: until_date)
  gif = Chiku.fetch_neko('bonk')
  caption = "🔇 #{mention(target)} has been muted#{label}~"
  if gif
    Chiku.send_animation(params[:chat_id], gif, caption, params[:reply_to_id], 'Markdown')
  else
    Chiku.send_message(params[:chat_id], caption, params[:reply_to_id], 'Markdown')
  end
end

Chiku.command '/unmute' do |params|
  unless admin?(params[:chat_id], params[:user_id])
    Chiku.send_message(params[:chat_id], "you need admin~", params[:reply_to_id]); next
  end
  target = resolve_target(params, '')
  unless target&.[](:user_id)
    Chiku.send_message(params[:chat_id], "reply to the user you want to unmute~", params[:reply_to_id]); next
  end
  if owner?(target[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 Bot owners are never muted~", params[:reply_to_id]); next
  end
  Chiku.unrestrict_chat_member(params[:chat_id], target[:user_id])
  Chiku.send_message(params[:chat_id], "🔊 #{mention(target)} can speak again~", params[:reply_to_id], 'Markdown')
end

Chiku.command '/pokemon', prefix: true do |params|
  name = params[:cleaned_text].to_s.sub(/^\/pokemon\s*/i, '').strip

  if name.empty?
    Chiku.send_message(params[:chat_id],
      "Usage: <code>/pokemon &lt;name&gt;</code>\nExample: <code>/pokemon Pikachu</code>",
      params[:reply_to_id])
    next
  end

  Chiku._run_pokemon(params[:chat_id], name, params[:reply_to_id])
end

Chiku.command '/pinterest', prefix: true do |params|
  query = params[:cleaned_text].sub(/^\/pinterest\s*/i, '').strip

  if query.empty?
    Chiku.send_message(
      params[:chat_id],
      "📌 <b>Pinterest</b>\n\n" \
      "<b>Usage:</b>\n" \
      "• <code>/pinterest &lt;search query&gt;</code> — search images\n" \
      "• <code>/pinterest &lt;pin.it or pinterest url&gt;</code> — fetch a specific pin\n\n" \
      "✨ <b>Examples:</b>\n" \
      "• <code>/pinterest anime sunset wallpaper</code>\n" \
      "• <code>/pinterest https://pin.it/4zyIXnQbO</code>",
      params[:reply_to_id]
    )
    next
  end

  Chiku._run_pinterest(params[:chat_id], query, params[:reply_to_id])
end

Chiku.command '/insta', prefix: true do |params|
  url = params[:cleaned_text].sub(/^\/insta\s*/i, '').strip

  if url.empty?
    Chiku.send_message(
      params[:chat_id],
      "📸 <b>Instagram Downloader</b>\n\n" \
      "<b>Usage:</b> <code>/insta &lt;instagram url&gt;</code>\n\n" \
      "✨ <b>Examples:</b>\n" \
      "• <code>/insta https://www.instagram.com/reel/DYxOFnGK-RS/</code>\n" \
      "• <code>/insta https://www.instagram.com/p/ABC123/</code>\n\n" \
      "Supports reels, posts &amp; photos~",
      params[:reply_to_id]
    )
    next
  end

  unless url.match?(/instagram\.com\//i)
    Chiku.send_message(params[:chat_id], "❌ That doesn't look like an Instagram link~\nSend a valid Instagram reel or post URL!", params[:reply_to_id])
    next
  end

  Chiku.send_chat_action(params[:chat_id], 'upload_video')

  begin
    encoded  = URI.encode_www_form_component(url)
    api_uri  = URI("https://anya-apis.vercel.app/insta?url=#{encoded}")
    response = Net::HTTP.get_response(api_uri)
    data     = JSON.parse(response.body)

    unless data['status'] == true && data['data'].is_a?(Array) && !data['data'].empty?
      Chiku.send_message(params[:chat_id], "❌ Couldn't fetch that Instagram link~\nMake sure it's a <b>public</b> post and try again!", params[:reply_to_id])
      next
    end

    items = data['data']
    count = items.length

    items.each_with_index do |item, idx|
      media_url = item['url'].to_s
      thumb_url = item['thumbnail'].to_s

      caption = "📸 <b>Instagram Media</b>#{count > 1 ? " (#{idx + 1}/#{count})" : ''}\n\n" \
                "🔗 <a href=\"#{url}\">View on Instagram</a>\n" \
                "✨ <i>Downloaded by Chiku~</i>"

      if media_url.end_with?('.mp4')
        Chiku.send_chat_action(params[:chat_id], 'upload_video')
        Chiku.send_video(params[:chat_id], media_url, caption, params[:reply_to_id])
      elsif media_url.match?(/\.(jpg|jpeg|png|webp)/i)
        Chiku.send_chat_action(params[:chat_id], 'upload_photo')
        Chiku.send_photo(params[:chat_id], media_url, caption, params[:reply_to_id])
      elsif thumb_url.match?(/\.(jpg|jpeg|png|webp)/i)
        Chiku.send_chat_action(params[:chat_id], 'upload_photo')
        Chiku.send_photo(params[:chat_id], thumb_url, caption, params[:reply_to_id])
      else
        Chiku.send_message(
          params[:chat_id],
          "#{caption}\n\n📥 <a href=\"#{media_url}\">Direct Download</a>",
          params[:reply_to_id]
        )
      end

      sleep(0.4) if count > 1
    end

  rescue JSON::ParserError
    Chiku.send_message(params[:chat_id], "❌ API returned invalid data~ Try again later!", params[:reply_to_id])
  rescue => e
    puts "⚠️  /insta error: #{e.class} #{e.message}"
    Chiku.send_message(params[:chat_id], "❌ Something went wrong while downloading~", params[:reply_to_id])
  end
end


Chiku.command '/imagine', prefix: true do |params|
  prompt = params[:cleaned_text].sub(/^\/imagine\s*/i, '').strip
  if prompt.empty?
    Chiku.send_message(
      params[:chat_id],
      "🎨 <b>Usage:</b> <code>/imagine &lt;your prompt&gt;</code>\n\n" \
      "✨ <b>Examples:</b>\n" \
      "• <code>/imagine cute anime girl in cherry blossoms</code>\n" \
      "• <code>/imagine dragon flying over a neon city at night</code>",
      params[:reply_to_id]
    )
    next
  end
  Chiku._run_imagine(params[:chat_id], prompt, params[:reply_to_id])
end

NEKO_IMAGE_ENDPOINTS.each do |type|
  Chiku.command "/#{type}" do |params|
    img = Chiku.fetch_neko(type)
    if img
      Chiku.simulate_uploading(params[:chat_id], 0.2)
      Chiku.send_photo(params[:chat_id], img, "✨ #{type}~", params[:reply_to_id])
    else
      Chiku.send_message(params[:chat_id], "couldn't fetch one rn 😔", params[:reply_to_id])
    end
  end
end

NEKO_GIF_ENDPOINTS.each do |action|
  Chiku.command "/#{action}", prefix: true do |params|
    sender_name = params[:first_name] || 'Chiku'
    sender_id   = params[:user_id]
    arg         = params[:cleaned_text].sub(/^\/#{Regexp.escape(action)}\s*/i, '').strip

    target_name = nil
    target_id   = nil

    if params[:message]['reply_to_message']
      r           = params[:message]['reply_to_message']['from']
      target_id   = r['id']
      target_name = r['first_name'] || r['username'] || 'them'

      # If target is the bot itself or has no real user, send without caption
      if target_id == BOT_ID || r['is_bot']
        target_name = nil
        target_id   = nil
      end
    elsif !arg.empty?
      target_name = arg.sub(/^@/, '')
      # target_id stays nil — no hyperlink possible from plain text arg
    end

    Chiku.send_reaction(
      params[:chat_id], action,
      sender_name, sender_id,
      target_name, target_id,
      params[:reply_to_id]
    )
  end
end

Chiku.command '/eval', prefix: true do |params|
  unless owner?(params[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 /eval is for bot owners only~", params[:reply_to_id]); next
  end
  code = params[:cleaned_text].sub(/^\/eval\s*/i, '').strip
  if code.empty?
    Chiku.send_message(params[:chat_id], "Usage: /eval &lt;ruby code&gt;", params[:reply_to_id]); next
  end

  begin
    require 'stringio'
    so, se  = StringIO.new, StringIO.new
    old_o   = $stdout.dup; old_e = $stderr.dup
    $stdout = so; $stderr = se
    result  = eval(code, binding, '(eval)', 0)
    $stdout = old_o; $stderr = old_e

    out = so.string.chomp; err = se.string.chomp
    lines = []
    lines << "Printed:\n#{out}" unless out.empty?
    lines << "STDERR:\n#{err}"  unless err.empty?
    unless result.nil? && !out.empty? && err.empty?
      rs = result.inspect
      rs = "#{rs[0..2800]}… [truncated]" if rs.length > 3000
      lines << "=> #{rs}"
    end
    lines << "(no output)" if lines.empty?
    safe = lines.join("\n\n").gsub('&','&amp;').gsub('<','&lt;').gsub('>','&gt;')
    Chiku.send_message(params[:chat_id], "<pre>#{safe}</pre>", params[:reply_to_id], 'HTML')
  rescue SyntaxError => e
    Chiku.send_message(params[:chat_id], "<pre>SyntaxError: #{e.message.gsub('<','&lt;')}</pre>", params[:reply_to_id], 'HTML')
  rescue Exception => e
    msg = "#{e.class}: #{e.message}\n#{e.backtrace&.first(5)&.join("\n")}"
    Chiku.send_message(params[:chat_id], "<pre>#{msg.gsub('<','&lt;').gsub('>','&gt;')}</pre>", params[:reply_to_id], 'HTML')
  ensure
    $stdout = old_o if defined?(old_o) && old_o
    $stderr = old_e if defined?(old_e) && old_e
  end
end

Chiku.command '/sh', prefix: true do |params|
  unless owner?(params[:user_id])
    Chiku.send_message(params[:chat_id], "🚫 /sh is for bot owners only~", params[:reply_to_id]); next
  end
  cmd = params[:cleaned_text].sub(/^\/sh\s*/i, '').strip
  if cmd.empty?
    Chiku.send_message(params[:chat_id], "Usage: /sh &lt;command&gt;", params[:reply_to_id]); next
  end
  begin
    out, err, status = Open3.capture3('/bin/sh', '-c', cmd)
    if status.success?
      safe = (out.chomp.empty? ? '(no output)' : out.chomp).gsub('<','&lt;').gsub('>','&gt;')
      Chiku.send_message(params[:chat_id], "<pre>#{safe}</pre>", params[:reply_to_id], 'HTML')
    else
      safe = (err.empty? ? "exit #{status.exitstatus}" : err).chomp.gsub('<','&lt;').gsub('>','&gt;')
      Chiku.send_message(params[:chat_id], "❌\n<pre>#{safe}</pre>", params[:reply_to_id], 'HTML')
    end
  rescue => e
    Chiku.send_message(params[:chat_id], "❌ #{e.message}", params[:reply_to_id])
  end
end

Handler = Proc.new do |req, res|
  res['Content-Type'] = 'application/json'
  res['Access-Control-Allow-Origin'] = '*'

  if req.request_method == 'GET'
    query  = req.query_string.to_s
    params = URI.decode_www_form(query).to_h
    action = params['action']

    if action == 'enable'
      our_url = derive_webhook_url(req)
      raw     = set_webhook(our_url)
      data    = JSON.parse(raw) rescue { 'ok' => false, 'description' => raw.to_s }
      info    = get_webhook_info
      payload = {
        action:       'enable',
        success:      data['ok'] == true,
        webhook_url:  our_url,
        set_result:   data,
        webhook_info: info&.dig('result') || {}
      }
      res.status = 200; res.body = JSON.generate(payload)

    
    else
      our_url = derive_webhook_url(req)
      info    = get_webhook_info
      if info&.dig('ok') && info.dig('result', 'url') != our_url
        set_webhook(our_url)
        payload = { action: 'auto_set', success: true, webhook_url: our_url, webhook_info: info&.dig('result') || {} }
      else
        payload = { action: 'status', success: true, webhook_url: info&.dig('result', 'url') || 'unknown', webhook_info: info&.dig('result') || {} }
      end
      res.status = 200; res.body = JSON.generate(payload)
    end

  elsif req.request_method == 'POST'
    begin
      body   = req.body.respond_to?(:read) ? req.body.read : req.body.to_s
      update = JSON.parse(body)

      res.status = 200
      res.body   = 'ok'

      if req.respond_to?(:env) && req.env['rack.after_response']
        req.env['rack.after_response'] << proc { Chiku.process_update(update) }
      else
        
        Chiku.process_update(update)
      end

    rescue JSON::ParserError
      res.status = 400; res.body = 'Bad JSON'
    rescue => e
      puts "⚠️  Handler: #{e.class} #{e.message}"
      res.status = 500; res.body = 'Server error'
    end

  else
    res.status = 405; res.body = 'Method Not Allowed'
  end
end
