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



require 'net/http'
require 'uri'
require 'json'
require_relative '../config'
require_relative 'webhook'
require_relative 'mongodb'

NEKO_GIF_ENDPOINTS = %w[
  lurk   shoot    sleep   clap    shrug   stare  wave   poke   confused
  smile  peck     wink    sip     blush   smug   tickle yeet   think
  highfive feed   wag     bite    teehee  shocked bleh  bored  nom
  nya    yawn     facepalm cuddle kick   happy   carry  hug    kabedon
  baka   bonk     pat     angry   spin   shake   run    nod    nope
  kiss   dance    punch   handshake slap  cry    lappillow pout blowkiss
  handhold salute thumbsup laugh  tableflip
].freeze

NEKO_IMAGE_ENDPOINTS = %w[neko waifu husbando kitsune].freeze

NEKO_GIF_ACTIONS = {
  'lurk'      => 'lurked at',          'shoot'     => 'shot',
  'sleep'     => 'fell asleep on',     'clap'      => 'clapped for',
  'shrug'     => 'shrugged at',        'stare'     => 'stared at',
  'wave'      => 'waved at',           'poke'      => 'poked',
  'confused'  => 'is confused by',     'smile'     => 'smiled at',
  'peck'      => 'pecked',             'wink'      => 'winked at',
  'sip'       => 'sipped tea near',    'blush'     => 'blushed at',
  'smug'      => 'smugged at',         'tickle'    => 'tickled',
  'yeet'      => 'yeeted',             'think'     => 'is thinking about',
  'highfive'  => 'high-fived',         'feed'      => 'fed',
  'wag'       => 'wagged tail at',     'bite'      => 'bit',
  'teehee'    => "teehee'd at",        'shocked'   => 'was shocked by',
  'bleh'      => "bleh'd at",          'bored'     => 'is bored with',
  'nom'       => 'nommed',             'nya'       => "nya'd at",
  'yawn'      => 'yawned at',          'facepalm'  => 'facepalmed at',
  'cuddle'    => 'cuddled',            'kick'      => 'kicked',
  'happy'     => 'is happy with',      'carry'     => 'carried',
  'hug'       => 'hugged',             'kabedon'   => "kabedon'd",
  'baka'      => 'called baka',        'bonk'      => 'bonked',
  'pat'       => 'patted',             'angry'     => 'is angry at',
  'spin'      => 'spun around with',   'shake'     => 'shook',
  'run'       => 'ran from',           'nod'       => 'nodded at',
  'nope'      => "nope'd at",          'kiss'      => 'kissed',
  'dance'     => 'danced with',        'punch'     => 'punched',
  'handshake' => 'shook hands with',   'slap'      => 'slapped',
  'cry'       => 'cried with',         'lappillow' => 'gave a lap pillow to',
  'pout'      => 'pouted at',          'blowkiss'  => 'blew a kiss to',
  'handhold'  => 'held hands with',    'salute'    => 'saluted',
  'thumbsup'  => 'gave thumbs up to',  'laugh'     => 'laughed with',
  'tableflip' => 'flipped a table at'
}.freeze

class Chiku
  @@commands = {}


  def self.command(cmd, options = {}, &block)
    @@commands[cmd] = { block: block, options: options }
  end

  def self.get_webhook_info
    uri = URI("https://api.telegram.org/bot#{TOKEN}/getWebhookInfo")
    res = Net::HTTP.get_response(uri)
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  end



  def self.send_message(chat_id, text, reply_to = nil, parse_mode = 'HTML')
    text = text.to_s

    if text.length > 4096

      plain = text
                .gsub(/<\/?(pre|code|b|i|em|strong)[^>]*>/i, '')
                .gsub(/<[^>]+>/, '')
                .gsub('&lt;', '<').gsub('&gt;', '>').gsub('&amp;', '&').gsub('&quot;', '"')
                .gsub(/\n{3,}/, "\n\n")
                .strip
      send_text_file(chat_id, plain, "response.txt", "📄 Response was too long — sending as file~", reply_to)
      return
    end
    chunks = split_message(text)
    chunks.each_with_index do |chunk, i|
      form = {
        'chat_id' => chat_id.to_s,
        'text'    => chunk
      }


      form['parse_mode'] = parse_mode if parse_mode && !parse_mode.to_s.empty?
      tg_post('sendMessage', form, i == 0 ? reply_to : nil)
    end
  end

  def self.send_photo(chat_id, photo, caption = '', reply_to = nil, parse_mode = 'HTML')
    tg_post('sendPhoto', {
      'chat_id'    => chat_id.to_s, 'photo'   => photo.to_s,
      'caption'    => caption.to_s, 'parse_mode' => parse_mode
    }, reply_to)
  end

  def self.send_animation(chat_id, url, caption = '', reply_to = nil, parse_mode = 'HTML')
    tg_post('sendAnimation', {
      'chat_id'    => chat_id.to_s, 'animation' => url.to_s,
      'caption'    => caption.to_s, 'parse_mode' => parse_mode
    }, reply_to)
  end

  def self.send_sticker(chat_id, sticker_id, reply_to = nil)
    tg_post('sendSticker', { 'chat_id' => chat_id.to_s, 'sticker' => sticker_id.to_s }, reply_to)
  end


  def self.send_document(chat_id, document, caption = '', reply_to = nil)
    tg_post('sendDocument', {
      'chat_id' => chat_id.to_s, 'document' => document.to_s, 'caption' => caption.to_s
    }, reply_to)
  end



  def self.send_text_file(chat_id, text_content, filename, caption = '', reply_to = nil)
    require 'net/http'
    require 'tempfile'

    safe_text = text_content.to_s.encode('UTF-8', invalid: :replace, undef: :replace, replace: '')


    tmp = Tempfile.new([File.basename(filename, '.*'), '.txt'])
    tmp.binmode
    tmp.write(safe_text)
    tmp.rewind

    uri = URI("https://api.telegram.org/bot#{TOKEN}/sendDocument")

    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true,
                    open_timeout: 10, read_timeout: 60) do |http|
      req = Net::HTTP::Post.new(uri)


      form_data = [
        ['chat_id',  chat_id.to_s],
        ['document', tmp, { filename: filename, content_type: 'text/plain; charset=utf-8' }]
      ]
      form_data << ['caption',              caption.to_s]   unless caption.to_s.empty?
      form_data << ['reply_to_message_id',  reply_to.to_s]  if reply_to

      req.set_form(form_data, 'multipart/form-data')
      res = http.request(req)
      if res.code == '200'
        puts "📄 send_text_file → OK (#{safe_text.bytesize} bytes)"
      else
        puts "📄 send_text_file → #{res.code} #{res.body[0..200]}"

        tg_post('sendMessage', {
          'chat_id'    => chat_id.to_s,
          'text'       => "#{safe_text[0..3800]}\n\n…[response truncated — too long]",
          'parse_mode' => nil
        }, reply_to)
      end
    end
  rescue => e
    puts "⚠️  send_text_file error: #{e.message}\n#{e.backtrace.first(3).join("\n")}"

    begin
      tg_post('sendMessage', {
        'chat_id' => chat_id.to_s,
        'text'    => "#{safe_text.to_s[0..3800]}\n\n…[response truncated]"
      }, reply_to)
    rescue; end
    nil
  ensure
    tmp&.close
    tmp&.unlink
  end

  def self.send_video(chat_id, video, caption = '', reply_to = nil, parse_mode = 'HTML')
    tg_post('sendVideo', {
      'chat_id' => chat_id.to_s, 'video' => video.to_s,
      'caption' => caption.to_s, 'parse_mode' => parse_mode
    }, reply_to)
  end

  def self.send_audio(chat_id, audio, caption = '', reply_to = nil)
    tg_post('sendAudio', {
      'chat_id' => chat_id.to_s, 'audio' => audio.to_s, 'caption' => caption.to_s
    }, reply_to)
  end

  def self.send_media_group(chat_id, urls, captions = nil, reply_to = nil, parse_mode = 'HTML')
    urls  = Array(urls).first(10)
    media = urls.map.with_index do |url, i|
      item    = { 'type' => 'photo', 'media' => url.to_s }
      caption = captions.is_a?(Array) ? (captions[i] || '') : (i == 0 ? captions.to_s : '')
      unless caption.to_s.empty?
        item['caption']    = caption.to_s
        item['parse_mode'] = parse_mode
      end
      item
    end
    payload = { 'chat_id' => chat_id.to_s, 'media' => media }
    payload['reply_to_message_id'] = reply_to.to_s if reply_to
    uri = URI("https://api.telegram.org/bot#{TOKEN}/sendMediaGroup")
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true
    req = Net::HTTP::Post.new(uri)
    req['Content-Type'] = 'application/json'
    req.body = JSON.generate(payload)
    http.request(req)
  rescue => e
    puts "⚠️  send_media_group: #{e.message}"; nil
  end

  def self.forward_message(chat_id, from_chat_id, message_id)
    tg_post('forwardMessage', {
      'chat_id'      => chat_id.to_s,
      'from_chat_id' => from_chat_id.to_s,
      'message_id'   => message_id.to_s
    })
  end

  def self.delete_message(chat_id, message_id)
    tg_post('deleteMessage', { 'chat_id' => chat_id.to_s, 'message_id' => message_id.to_s })
  end

  def self.edit_message_text(chat_id, message_id, text, parse_mode = 'HTML')
    tg_post('editMessageText', {
      'chat_id' => chat_id.to_s, 'message_id' => message_id.to_s,
      'text' => text.to_s, 'parse_mode' => parse_mode
    })
  end




  def self.send_message_with_keyboard(chat_id, text, keyboard, reply_to = nil, parse_mode = 'HTML')
    form = {
      'chat_id'      => chat_id.to_s,
      'text'         => text.to_s,
      'parse_mode'   => parse_mode,
      'reply_markup' => JSON.generate({ inline_keyboard: keyboard })
    }
    tg_post('sendMessage', form, reply_to)
  end


  def self.send_animation_with_keyboard(chat_id, url, caption, keyboard, reply_to = nil, parse_mode = 'HTML')
    form = {
      'chat_id'      => chat_id.to_s,
      'animation'    => url.to_s,
      'caption'      => caption.to_s,
      'parse_mode'   => parse_mode,
      'reply_markup' => JSON.generate({ inline_keyboard: keyboard })
    }
    tg_post('sendAnimation', form, reply_to)
  end


  def self.edit_message_with_keyboard(chat_id, message_id, text, keyboard = nil, parse_mode = 'HTML')
    form = {
      'chat_id'    => chat_id.to_s,
      'message_id' => message_id.to_s,
      'text'       => text.to_s,
      'parse_mode' => parse_mode
    }
    form['reply_markup'] = JSON.generate({ inline_keyboard: keyboard }) if keyboard
    tg_post('editMessageText', form)
  end



  def self.edit_caption_with_keyboard(chat_id, message_id, caption, keyboard = nil, parse_mode = 'HTML')
    form = {
      'chat_id'    => chat_id.to_s,
      'message_id' => message_id.to_s,
      'caption'    => caption.to_s,
      'parse_mode' => parse_mode
    }
    form['reply_markup'] = JSON.generate({ inline_keyboard: keyboard }) if keyboard
    tg_post('editMessageCaption', form)
  end


  def self.answer_callback_query(callback_query_id, text = nil, show_alert: false)
    form = { 'callback_query_id' => callback_query_id.to_s, 'show_alert' => show_alert.to_s }
    form['text'] = text.to_s if text
    tg_post('answerCallbackQuery', form)
  end

  def self.pin_message(chat_id, message_id, disable_notification: false)
    tg_post('pinChatMessage', {
      'chat_id'              => chat_id.to_s,
      'message_id'           => message_id.to_s,
      'disable_notification' => disable_notification.to_s
    })
  end

  def self.unpin_message(chat_id, message_id = nil)
    p = { 'chat_id' => chat_id.to_s }
    p['message_id'] = message_id.to_s if message_id
    tg_post('unpinChatMessage', p)
  end

  def self.unpin_all_messages(chat_id)
    tg_post('unpinAllChatMessages', { 'chat_id' => chat_id.to_s })
  end



  def self.send_chat_action(chat_id, action = 'typing')
    tg_post('sendChatAction', { 'chat_id' => chat_id.to_s, 'action' => action })
  end

  def self.simulate_typing(chat_id, duration = 0.1)
    send_chat_action(chat_id, 'typing')
    sleep(duration)
  end

  def self.simulate_uploading(chat_id, duration = 0.3)
    send_chat_action(chat_id, 'upload_video')
    sleep(duration)
  end





  def self.get_chat_member(chat_id, user_id)
    uri = URI("https://api.telegram.org/bot#{TOKEN}/getChatMember?chat_id=#{chat_id}&user_id=#{user_id}")
    res = Net::HTTP.get_response(uri)
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  rescue; nil; end

  def self.get_chat(chat_id)
    uri = URI("https://api.telegram.org/bot#{TOKEN}/getChat?chat_id=#{URI.encode_www_form_component(chat_id.to_s)}")
    res = Net::HTTP.get_response(uri)
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  rescue; nil; end

  def self.get_chat_member_count(chat_id)
    uri = URI("https://api.telegram.org/bot#{TOKEN}/getChatMemberCount?chat_id=#{URI.encode_www_form_component(chat_id.to_s)}")
    res = Net::HTTP.get_response(uri)
    return '?' unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body)['result'] rescue '?'
  rescue; '?'; end

  def self.ban_chat_member(chat_id, user_id, until_date: 0)
    tg_post('banChatMember', {
      'chat_id' => chat_id.to_s, 'user_id' => user_id.to_s, 'until_date' => until_date.to_s
    })
  end

  def self.unban_chat_member(chat_id, user_id)
    tg_post('unbanChatMember', {
      'chat_id' => chat_id.to_s, 'user_id' => user_id.to_s, 'only_if_banned' => 'true'
    })
  end

  def self.restrict_chat_member(chat_id, user_id, permissions: {}, until_date: 0)
    perms = {
      'can_send_messages'         => false, 'can_send_media_messages'    => false,
      'can_send_polls'            => false, 'can_send_other_messages'    => false,
      'can_add_web_page_previews' => false, 'can_change_info'            => false,
      'can_invite_users'          => false, 'can_pin_messages'           => false
    }.merge(permissions.transform_keys(&:to_s).transform_values { |v| v.to_s == 'true' })

    form = {
      'chat_id'     => chat_id.to_s, 'user_id'     => user_id.to_s,
      'permissions' => JSON.dump(perms), 'until_date' => until_date.to_s
    }
    uri = URI("https://api.telegram.org/bot#{TOKEN}/restrictChatMember")
    req = Net::HTTP::Post.new(uri); req.set_form_data(form)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
  rescue => e; puts "⚠️  restrict: #{e.message}"; nil; end

  def self.unrestrict_chat_member(chat_id, user_id)
    perms = {
      'can_send_messages' => true, 'can_send_media_messages' => true,
      'can_send_polls'    => true, 'can_send_other_messages' => true,
      'can_add_web_page_previews' => true
    }
    form = { 'chat_id' => chat_id.to_s, 'user_id' => user_id.to_s, 'permissions' => JSON.dump(perms) }
    uri = URI("https://api.telegram.org/bot#{TOKEN}/restrictChatMember")
    req = Net::HTTP::Post.new(uri); req.set_form_data(form)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
  rescue => e; puts "⚠️  unrestrict: #{e.message}"; nil; end



  def self.fetch_neko(endpoint)
    uri          = URI("https://nekos.best/api/v2/#{endpoint}")
    http         = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res          = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body).dig('results', 0, 'url')
  rescue; nil; end

  def self.send_reaction(chat_id, action, sender_name, sender_id = nil, target = nil, target_id = nil, reply_to = nil)
    gif_url = fetch_neko(action)
    unless gif_url
      send_message(chat_id, "couldn't fetch gif rn 😔", reply_to)
      return
    end

    verb = NEKO_GIF_ACTIONS[action] || action


    sender_mention = sender_id \
      ? "[#{sender_name}](tg://user?id=#{sender_id})" \
      : sender_name.to_s

    target_mention = if target_id
                       "[#{target}](tg://user?id=#{target_id})"
                     elsif target && !target.to_s.strip.empty?
                       target.to_s
                     end

    caption = if target_mention.nil?
                ''
              elsif target == 'myself'
                "#{sender_mention} #{verb} themselves~"
              else
                "#{sender_mention} #{verb} #{target_mention}~"
              end

    simulate_uploading(chat_id, 0.2)
    send_animation(chat_id, gif_url, caption, reply_to, 'Markdown')
  rescue => e
    puts "⚠️  send_reaction error: #{e.message}"
  end



  def self.fetch_weather(city)
    city = city.to_s.strip
    return nil if city.empty?

    begin

      geo_encoded = URI.encode_www_form_component(city)
      geo_uri = URI("https://geocoding-api.open-meteo.com/v1/search?name=#{geo_encoded}&count=1&language=en&format=json")

      geo_http = Net::HTTP.new(geo_uri.hostname, geo_uri.port)
      geo_http.use_ssl = true
      geo_http.open_timeout = 6
      geo_http.read_timeout = 8

      geo_res = geo_http.get(geo_uri.request_uri)
      return nil unless geo_res.is_a?(Net::HTTPSuccess)

      geo_data = JSON.parse(geo_res.body)
      results  = geo_data['results'] || []
      return nil if results.empty?

      lat          = results[0]['latitude'].to_f
      lon          = results[0]['longitude'].to_f
      display_name = results[0]['name'] || city.capitalize


      weather_url = "https://api.open-meteo.com/v1/forecast"
      params = {
        'latitude'  => lat.to_s,
        'longitude' => lon.to_s,
        'current'   => 'temperature_2m,wind_speed_10m,weathercode',
        'hourly'    => 'temperature_2m,precipitation_probability,weathercode',
        'daily'     => 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        'timezone'  => 'auto'
      }

      uri = URI(weather_url)
      uri.query = URI.encode_www_form(params)

      http = Net::HTTP.new(uri.hostname, uri.port)
      http.use_ssl = true
      http.open_timeout = 6
      http.read_timeout = 10

      res = http.get(uri.request_uri)
      return nil unless res.is_a?(Net::HTTPSuccess)

      data = JSON.parse(res.body)


      output = []


      cw    = data['current'] || {}
      temp  = cw['temperature_2m']
      wind  = cw['wind_speed_10m']
      wcode = cw['weathercode']

      current_emoji = weather_emoji(wcode)

      output << "🌍 <b>#{display_name}</b> (#{data['latitude']&.round(2)}, #{data['longitude']&.round(2)})"
      output << "#{current_emoji} <b>#{temp}°C</b> • 💨 #{wind} km/h"
      output << ''


      hourly = data['hourly'] || {}
      output << '⏰ <b>Next 8 Hours</b>'

      times = hourly['time'] || []
      temps = hourly['temperature_2m'] || []
      probs = hourly['precipitation_probability'] || []
      codes = hourly['weathercode'] || []



      now_str = data.dig('current', 'time')
      start_i = 0
      if now_str
        now_prefix = now_str[0..12]
        idx = times.rindex { |t| t[0..12] <= now_prefix }
        start_i = idx || 0
      end

      count = 0
      i = start_i
      while count < 8 && i < times.length
        t         = times[i].split('T').last[0..4]
        condition = get_condition(probs[i], codes[i])
        output << "<code>#{t} | #{temps[i]}°C | #{probs[i]}% rain | #{condition}</code>"
        count += 1
        i     += 1
      end

      output << ''


      daily   = data['daily'] || {}
      output << '📅 <b>Daily Forecast</b>'

      d_times = daily['time'] || []
      tmaxs   = daily['temperature_2m_max'] || []
      tmins   = daily['temperature_2m_min'] || []
      rains   = daily['precipitation_sum'] || []

      (0..4).each do |i|
        break if i >= d_times.length
        date      = d_times[i]
        condition = (rains[i].to_f > 1) ? '🌧 Rainy' : '☀️ Mostly Dry'
        output << "<code>#{date} | #{tmins[i]}° – #{tmaxs[i]}°C | #{rains[i]}mm rain | #{condition}</code>"
      end

      output << ''
      output << '🔗 <a href="https://weather-web-anya.vercel.app/">Check More Information Here</a>'

      output.join("\n")

    rescue StandardError => e
      puts "Weather error for #{city}: #{e.message}"
      nil
    end
  end



  def self.weather_emoji(code)
    case code.to_i
    when 0                  then "☀️"
    when 1, 2, 3            then "⛅"
    when 45, 48             then "🌫"
    when 51..67, 80..82     then "🌦"
    when 71..77, 85..86     then "❄️"
    when 95..99             then "⛈"
    else                         "☁️"
    end
  end

  def self.get_condition(rain_prob, code)
    rain_prob = rain_prob.to_i
    code = code.to_i

    if rain_prob > 70
      "🌧 Heavy Rain Likely"
    elsif rain_prob > 40
      "🌦 Rain Possible"
    elsif code == 0
      "☀️ Clear"
    elsif code <= 3
      "⛅ Cloudy"
    elsif code.between?(45, 48)
      "🌫 Fog"
    elsif code.between?(71, 86)
      "❄️ Snow"
    elsif code >= 95
      "⛈ Thunderstorm"
    else
      "☁️ Overcast"
    end
  end

  def self.fetch_quote
    uri  = URI("https://zenquotes.io/api/random")
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res  = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    data = JSON.parse(res.body)
    q    = data.is_a?(Array) ? data[0] : data
    return nil unless q['q'] && q['a']
    { quote: q['q'], author: q['a'] }
  rescue; nil; end

  def self.fetch_fact
    uri  = URI("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res  = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body)['text']
  rescue; nil; end

  def self.fetch_joke
    uri  = URI("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist&type=twopart,single")
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res  = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    data = JSON.parse(res.body)
    if data['type'] == 'twopart'
      { setup: data['setup'], delivery: data['delivery'] }
    else
      { single: data['joke'] }
    end
  rescue; nil; end

  def self.fetch_urban(word)
    encoded = URI.encode_www_form_component(word.strip)
    uri     = URI("https://api.urbandictionary.com/v0/define?term=#{encoded}")
    http    = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res     = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    list = JSON.parse(res.body)['list'] || []
    return nil if list.empty?
    entry = list[0]
    {
      word:       entry['word'],
      definition: entry['definition'].to_s.gsub(/\[([^\]]+)\]/, '\1')[0..400],
      example:    entry['example'].to_s.gsub(/\[([^\]]+)\]/, '\1')[0..200],
      thumbs_up:  entry['thumbs_up']
    }
  rescue; nil; end

  def self.fetch_translation(lang_code, text)
    encoded_q = URI.encode_www_form_component(text)
    uri  = URI("https://api.mymemory.translated.net/get?q=#{encoded_q}&langpair=autodetect|#{lang_code}")
    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = true; http.open_timeout = 6; http.read_timeout = 8
    res  = http.get(uri.request_uri)
    return nil unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body).dig('responseData', 'translatedText')
  rescue; nil; end






  def self.execute_agent_action(raw_response, chat_id, sender_name, reply_to, extra_context = {})

    tag_match = raw_response.match(/\[do:([^\]]+)\]/i)

    text_part = raw_response.gsub(/\s*\[do:[^\]]+\]\s*/i, ' ').strip.gsub(/\s{2,}/, ' ')


    return [text_part, false] unless tag_match


    args   = tag_match[1].split(':', 3).map(&:strip)
    action = args[0]&.downcase






    if action == 'gif' || action == 'sticker'
      is_explicit = !text_part.nil? && !text_part.strip.empty?
      return [text_part, false] unless is_explicit || rand(100) < 15
    end


    unless text_part.nil? || text_part.empty?
      mode    = response_parse_mode(text_part)
      send_message(chat_id, clean_ai_response(text_part), reply_to, mode)
    end

    text_part = ''

    case action


    when 'reaction'
      gif_action = args[1]&.downcase
      target     = args[2]
      if gif_action && NEKO_GIF_ENDPOINTS.include?(gif_action)
        send_reaction(chat_id, gif_action, sender_name, nil, target, nil, reply_to)
        return [text_part, true]
      end


    when 'neko'
      type = args[1]&.downcase
      type = NEKO_IMAGE_ENDPOINTS.include?(type) ? type : NEKO_IMAGE_ENDPOINTS.sample
      img  = fetch_neko(type)
      if img
        simulate_uploading(chat_id, 0.2)
        send_photo(chat_id, img, "✨ #{type}~", reply_to)
        return [text_part, true]
      end


    when 'imagine'
      prompt = args[1..].join(':').strip
      prompt = prompt.empty? ? args[1] : prompt
      if prompt && !prompt.empty?
        _run_imagine(chat_id, prompt, reply_to)
        return [text_part, true]
      end


    when 'pokemon'
      poke_name = args[1..].join(':').strip
      poke_name = poke_name.empty? ? args[1] : poke_name
      if poke_name && !poke_name.empty?
        _run_pokemon(chat_id, poke_name, reply_to)
        return [text_part, true]
      end


    when 'pinterest'
      # Rejoin with ':' to reconstruct URLs like https://pin.it/...
      query = args[1..].join(':').strip
      query = args[1].to_s if query.empty?
      if query && !query.empty?
        _run_pinterest(chat_id, query, reply_to)
        return [text_part, true]
      end


    when 'weather'
      city   = args[1]
      if city && !city.empty?
        result = fetch_weather(city)
        if result
          send_message(chat_id, "🌤 <b>Weather in #{city}:</b>\n#{result}", reply_to)
        else
          send_message(chat_id, "couldn't find weather for #{city}~ 😔", reply_to)
        end
        return [text_part, true]
      end


    when 'quote'
      data = fetch_quote
      if data
        send_message(chat_id, "💬 <i>\"#{data[:quote]}\"</i>\n— <b>#{data[:author]}</b>", reply_to)
      else
        send_message(chat_id, "couldn't fetch a quote rn 😔", reply_to)
      end
      return [text_part, true]


    when 'fact'
      fact = fetch_fact
      if fact
        send_message(chat_id, "💡 #{fact}", reply_to)
      else
        send_message(chat_id, "couldn't fetch a fact rn 😔", reply_to)
      end
      return [text_part, true]


    when 'joke'
      data = fetch_joke
      if data
        if data[:single]
          send_message(chat_id, "😂 #{data[:single]}", reply_to)
        else
          send_message(chat_id, "😂 #{data[:setup]}", reply_to)
          sleep(1.5)
          send_message(chat_id, "...#{data[:delivery]} 💀", reply_to)
        end
      else
        send_message(chat_id, "couldn't fetch a joke rn 😔", reply_to)
      end
      return [text_part, true]


    when 'insta'
      insta_url = args[1..].join(':').strip
      insta_url = insta_url.empty? ? args[1].to_s : insta_url
      if insta_url.match?(/instagram\.com\//i)
        _run_insta(chat_id, insta_url, reply_to)
        return [text_part, true]
      else
        send_message(chat_id, "send me the Instagram link and i'll download it~ 📸", reply_to)
        return [text_part, true]
      end


    when '8ball'
      question = args[1] || '...'
      answer   = EIGHTBALL_ANSWERS.sample
      send_message(chat_id, "🎱 <i>#{question}</i>\n\n<b>#{answer}</b>", reply_to)
      return [text_part, true]


    when 'calc'
      expr = args[1]
      if expr && !expr.empty?
        _run_calc(chat_id, expr, reply_to)
        return [text_part, true]
      end


    when 'translate'
      lang = args[1]
      text = args[2]
      if lang && text && !text.empty?
        result = fetch_translation(lang, text)
        if result
          send_message(chat_id, "🌐 <b>Translation (#{lang}):</b>\n#{result}", reply_to)
        else
          send_message(chat_id, "couldn't translate that rn 😔", reply_to)
        end
        return [text_part, true]
      end


    when 'urban'
      word = args[1]
      if word && !word.empty?
        data = fetch_urban(word)
        if data
          msg  = "📖 <b>#{data[:word]}</b> (👍 #{data[:thumbs_up]})\n\n"
          msg += "<i>#{data[:definition]}</i>"
          msg += "\n\n<b>Example:</b> #{data[:example]}" unless data[:example].empty?
          send_message(chat_id, msg, reply_to)
        else
          send_message(chat_id, "no definition found for <b>#{word}</b>~", reply_to)
        end
        return [text_part, true]
      end


    when 'gif'
      gif_action = args[1]&.downcase
      if gif_action && NEKO_GIF_ENDPOINTS.include?(gif_action)
        gif_url = fetch_neko(gif_action)
        if gif_url
          simulate_uploading(chat_id, 0.2)
          send_animation(chat_id, gif_url, '', reply_to)
          return [text_part, true]
        end
      end


    when 'sticker'
      sticker = defined?(STICKERS) && STICKERS.any? ? STICKERS.sample : nil
      if sticker
        send_sticker(chat_id, sticker, reply_to)
        return [text_part, true]
      end

    when 'tts'
      tts_text = args[1..].join(':').strip
      tts_text = tts_text.empty? ? extra_context[:last_ai_text].to_s : tts_text
      unless tts_text.empty?
        _run_tts(chat_id, tts_text, reply_to)
        return [text_part, true]
      end
    end

    [text_part, false]
  end



  # ── Logger helpers ──────────────────────────────────────────────────────────

  def self.ist_now
    # IST = UTC+5:30
    utc = Time.now.utc
    ist = utc + (5 * 3600) + (30 * 60)
    ist.strftime('%d %b %Y, %I:%M:%S %p IST')
  end

  def self.log_to_gc(text)
    return unless defined?(LOGGER_GC_ID) && LOGGER_GC_ID
    Thread.new do
      begin
        send_message(LOGGER_GC_ID, text, nil, 'HTML')
      rescue => e
        puts "⚠️  log_to_gc failed: #{e.message}"
      end
    end
  end

  # ── Update processor ────────────────────────────────────────────────────────

  def self.process_update(update)

    if update['my_chat_member']
      mcm        = update['my_chat_member']
      old_status = mcm.dig('old_chat_member', 'status')
      new_status = mcm.dig('new_chat_member', 'status')
      chat       = mcm['chat']
      actor      = mcm['from']

      # Bot was added to a group
      if %w[member administrator].include?(new_status) &&
         %w[group supergroup channel].include?(chat['type']) &&
         !%w[member administrator].include?(old_status)

        ChikuDB.save_chat(chat['id'])

        actor_name     = [actor['first_name'], actor['last_name']].compact.join(' ').strip
        actor_username = actor['username'] ? "@#{actor['username']}" : 'no username'
        chat_username  = chat['username'] ? "@#{chat['username']}" : 'no username'
        chat_title     = chat['title'] || chat['username'] || 'Unknown'

        log_to_gc(<<~LOG.strip)
          ➕ <b>Bot Added to Group</b>

          💬 <b>Group:</b> #{chat_title}
          🆔 <b>Chat ID:</b> <code>#{chat['id']}</code>
          🏷 <b>Username:</b> #{chat_username}
          📂 <b>Type:</b> #{chat['type']}

          👤 <b>Added By:</b> #{actor_name}
          🪪 <b>User ID:</b> <code>#{actor['id']}</code>
          📛 <b>Username:</b> #{actor_username}

          🕐 <b>Time:</b> #{ist_now}
        LOG

      # Bot was removed / kicked from a group
      elsif %w[kicked left].include?(new_status) &&
            %w[group supergroup channel].include?(chat['type']) &&
            !%w[kicked left].include?(old_status)

        actor_name     = [actor['first_name'], actor['last_name']].compact.join(' ').strip
        actor_username = actor['username'] ? "@#{actor['username']}" : 'no username'
        chat_username  = chat['username'] ? "@#{chat['username']}" : 'no username'
        chat_title     = chat['title'] || chat['username'] || 'Unknown'

        log_to_gc(<<~LOG.strip)
          ➖ <b>Bot Removed from Group</b>

          💬 <b>Group:</b> #{chat_title}
          🆔 <b>Chat ID:</b> <code>#{chat['id']}</code>
          🏷 <b>Username:</b> #{chat_username}
          📂 <b>Type:</b> #{chat['type']}

          👤 <b>Removed By:</b> #{actor_name}
          🪪 <b>User ID:</b> <code>#{actor['id']}</code>
          📛 <b>Username:</b> #{actor_username}

          🕐 <b>Time:</b> #{ist_now}
        LOG
      end

      return
    end


    if update['callback_query']
      handle_callback_query(update['callback_query'])
      return
    end

    return unless update['message']
    msg       = update['message']
    chat_id   = msg['chat']['id']
    chat_type = msg['chat']['type']


    sender_id = msg.dig('from', 'id')
    ChikuDB.save_user(sender_id) if sender_id


    if %w[group supergroup].include?(chat_type)
      ChikuDB.save_chat(chat_id)
    end


    if msg['new_chat_members']
      msg['new_chat_members'].each do |user|
        next if user['is_bot']
        handle_member_join(chat_id, user)
      end
      return
    end

    if msg['left_chat_member']
      user = msg['left_chat_member']
      handle_member_leave(chat_id, user) unless user['is_bot']
      return
    end

    if msg['text']
      handle_text(msg, chat_id, chat_type)
    elsif msg['sticker']
      handle_sticker(msg, chat_id, chat_type)
    end
  end


  WELCOME_GIFS = %w[wave hug happy dance clap highfive].freeze


  WELCOME_MESSAGES = [
    "🌸 Heyyy %mention%~ welcome to the group! We\'ve been waiting for you ✨
Don\'t be shy — dive right in 💕",
    "🎉 %mention% just walked in\! Fresh vibes detected~
Make yourself at home, we don\'t bite 😌",
    "✨ Welcome, %mention%\! The group just got better 💫
Glad you\'re here~",
    "💖 %mention% has arrived\!
Someone get the confetti, this person looks cool already~",
    "🌺 Yooo %mention%~ glad you made it\!
Drop a hi so everyone knows you\'re real 👀",
    "🎊 %mention% joined the party\!
The energy just went up~ Welcome welcome 🥳",
  ].freeze

  LEAVE_MESSAGES = [
    "💔 %mention% has left the chat\.
It was a vibe while it lasted~ take care out there 🌙",
    "🌸 %mention% dipped\. Hope they come back someday~
The group won\'t be the same without them 😔",
    "🌿 %mention% left the group\.
Farewell and safe travels~ ✈️",
    "😢 %mention% has gone\.
We\'ll miss the energy~ 💫",
    "🕊 %mention% flew away\.
Until next time~ 🌙",
  ].freeze

  LEAVE_GIFS = %w[wave cry pout shrug].freeze

  def self.handle_member_join(chat_id, user)
    name    = (user['first_name'] || user['username'] || 'stranger').to_s.strip
    uid     = user['id']
    mention = "[#{name}](tg://user?id=#{uid})"
    text    = WELCOME_MESSAGES.sample.gsub('%mention%', mention)
    gif     = fetch_neko(WELCOME_GIFS.sample)
    if gif
      send_animation(chat_id, gif, text, nil, 'Markdown')
    else
      send_message(chat_id, text, nil, 'Markdown')
    end
  rescue => e
    puts "⚠️  handle_member_join: #{e.message}"
  end

  def self.handle_member_leave(chat_id, user)
    name    = (user['first_name'] || user['username'] || 'someone').to_s.strip
    uid     = user['id']
    mention = "[#{name}](tg://user?id=#{uid})"
    text    = LEAVE_MESSAGES.sample.gsub('%mention%', mention)
    gif     = fetch_neko(LEAVE_GIFS.sample)
    if gif
      send_animation(chat_id, gif, text, nil, 'Markdown')
    else
      send_message(chat_id, text, nil, 'Markdown')
    end
  rescue => e
    puts "⚠️  handle_member_leave: #{e.message}"
  end




  # Compact enough to fit in Telegram's 1024-char caption limit (used for in-place GIF edit)
  HELP_TEXT = <<~HELP.strip
    🌸 <b>Chiku — What I can do</b>

    <b>💬 Chat &amp; AI</b>
    Talk to me naturally — I vibe, listen &amp; remember~

    <b>🖼 Anime &amp; Reactions</b>
    /neko /waifu /husbando /kitsune
    /hug /pat /kiss /bonk /slap /dance + 55 more~
    /reactions — see the full list

    <b>🎨 Create &amp; Search</b>
    /imagine &lt;prompt&gt; · /pinterest &lt;query&gt; · /pokemon &lt;name&gt;
    /tts &lt;text&gt; — text to voice message 🎙️

    <b>📥 Downloader</b>
    /insta &lt;url&gt; — download Instagram reels &amp; posts

    <b>🌐 Info</b>
    /weather &lt;city&gt; · /quote · /fact · /joke

    <b>🎲 Fun</b>
    /ship @u1 @u2 · /id · /info

    <b>🛡 Admin</b>
    /ban /unban /kick /mute /unmute /pin /del

    <b>👑 Owner</b>
    /eval · /sh · /gcast · /stats

    <b>⚙️ Misc</b>
    /reset · /help
  HELP

  def self.build_start_text(name)
    <<~MSG.strip
      🌸 <b>Hey #{name}! I'm Chiku~</b> 💕

      Your AI companion who actually gets you ✨
      Not just a bot — I vibe, I listen, I respond like a real person would.

      ─────────────────────────
      💬 <b>Chat &amp; AI</b> — just talk to me naturally
      🎨 <b>AI Art</b> — /imagine anything you can dream
      🎙️ <b>Voice</b> — /tts anything to hear it~
      🌤 <b>Weather</b> — /weather &lt;city&gt;
      😂 <b>Fun</b> — /joke /fact /quote /ship
      🖼 <b>Anime</b> — /neko /waifu /hug /pat ... 60+ GIFs
      🛡 <b>Groups</b> — ban, mute, pin and more
      ─────────────────────────

      Tap below to see <b>everything</b> I can do~ 👇
    MSG
  end

  def self.handle_callback_query(cbq)
    cbq_id     = cbq['id']
    chat_id    = cbq.dig('message', 'chat', 'id')
    message_id = cbq.dig('message', 'message_id')
    data       = cbq['data']

    has_media  = cbq.dig('message', 'animation') ||
                 cbq.dig('message', 'photo') ||
                 cbq.dig('message', 'video')

    case data
    when 'show_help'
      answer_callback_query(cbq_id)
      back_keyboard = [[{ text: '« Back to Start', callback_data: 'back_to_start' }]]
      if has_media
        # Edit the GIF caption in-place (HELP_TEXT is now ≤1024 chars to fit caption limit)
        edit_caption_with_keyboard(chat_id, message_id, HELP_TEXT, back_keyboard)
      else
        edit_message_with_keyboard(chat_id, message_id, HELP_TEXT, back_keyboard)
      end

    when 'back_to_start'
      answer_callback_query(cbq_id)
      first_name    = cbq.dig('from', 'first_name') || 'stranger'
      start_text    = build_start_text(first_name)
      help_keyboard = [[{ text: '📖 What can you do?', callback_data: 'show_help' }]]
      if has_media
        # Edit the caption back to the start text
        edit_caption_with_keyboard(chat_id, message_id, start_text, help_keyboard)
      else
        edit_message_with_keyboard(chat_id, message_id, start_text, help_keyboard)
      end

    else
      answer_callback_query(cbq_id, 'Unknown action~')
    end
  end



  def self.handle_text(msg, chat_id, chat_type)
    user_text  = msg['text'].strip
    user_id    = msg['from']['id']
    first_name = msg['from']['first_name'] || 'User'

    should_respond = false
    reply_to       = nil
    cleaned        = user_text.dup
    is_command     = user_text.start_with?('/')

    if chat_type == 'private'
      should_respond = true
    elsif %w[group supergroup].include?(chat_type)
      if msg.dig('reply_to_message', 'from', 'id') == BOT_ID
        should_respond = true
        reply_to       = msg['message_id']
      end
      if cleaned.match?(/\bChiku\b/i)
        should_respond = true
        reply_to     ||= msg['message_id']
      end
      if is_command
        @@commands.each do |cmd, data|
          if data[:options][:prefix] ? cleaned.start_with?(cmd) : cleaned == cmd
            should_respond = true; break
          end
        end
      end
    end

    return unless should_respond

    cleaned.sub!(/^Chiku\s*/i, '')
    simulate_typing(chat_id, rand(2..4) * 0.1)

    handled = try_commands(cleaned, msg, chat_id, reply_to, first_name, user_id, chat_type)
    return if handled


    history_key = chat_type == 'private' ? chat_id.to_s : "#{chat_id}_#{user_id}"
    ai_input    = "#{first_name}: #{cleaned}"
    raw         = get_ai_response(history_key, ai_input, chat_id)

    last_ai_text = HISTORY[history_key]&.select { |m| m['role'] == 'assistant' }&.last(2)&.first&.dig('content').to_s
    text_part, _tag_executed = execute_agent_action(raw, chat_id, first_name, reply_to, { last_ai_text: last_ai_text })




    unless text_part.nil? || text_part.empty?
      mode    = response_parse_mode(text_part)
      cleaned = clean_ai_response(text_part)
      send_message(chat_id, cleaned, reply_to, mode)
    end
  end

  def self.handle_sticker(msg, chat_id, chat_type)
    should_respond  = false
    reply_to        = nil
    replied_to_bot  = false

    if chat_type == 'private'
      should_respond = true
    elsif %w[group supergroup].include?(chat_type)
      if msg.dig('reply_to_message', 'from', 'id') == BOT_ID
        should_respond = true
        reply_to       = msg['message_id']
        replied_to_bot = true
      end
    end
    return unless should_respond

    if replied_to_bot

      sticker = defined?(STICKERS) && STICKERS.any? ? STICKERS.sample : nil
      if sticker
        send_sticker(chat_id, sticker, reply_to)
      else

        gif_url = fetch_neko(NEKO_GIF_ENDPOINTS.sample)
        if gif_url
          simulate_uploading(chat_id, 0.2)
          send_animation(chat_id, gif_url, '', reply_to)
        end
      end
    else

      roll = rand(3)
      if roll == 0 && defined?(STICKERS) && STICKERS.any?
        send_sticker(chat_id, STICKERS.sample, reply_to)
      elsif roll == 1
        gif_url = fetch_neko(NEKO_GIF_ENDPOINTS.sample)
        if gif_url
          simulate_uploading(chat_id, 0.2)
          send_animation(chat_id, gif_url, '', reply_to)
        end
      end
    end
  end

  def self.try_commands(text, msg, chat_id, reply_to, first_name, user_id, chat_type)
    @@commands.each do |cmd, data|
      next unless data[:options][:prefix] ? text.start_with?(cmd) : text == cmd
      data[:block].call({
        chat_id: chat_id, reply_to_id: reply_to, cleaned_text: text,
        first_name: first_name, user_id: user_id, chat_type: chat_type, message: msg
      })
      return true
    end
    false
  end




  def self._run_pokemon(chat_id, name, reply_to)
    send_chat_action(chat_id, 'upload_photo')

    begin
      encoded = URI.encode_www_form_component(name.strip)
      uri     = URI("https://anya-apis.vercel.app/pokemon/#{encoded}")
      http    = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl      = true
      http.open_timeout = 8
      http.read_timeout = 12
      req = Net::HTTP::Get.new(uri)
      req['User-Agent'] = 'ChikuBot/1.0'
      resp = http.request(req)

      unless resp.code == '200'
        send_message(chat_id, "couldn't find <b>#{name}</b>~ are you sure that's a real Pokémon? 😔", reply_to)
        return
      end

      data = JSON.parse(resp.body)

      pname      = data['name'].to_s.capitalize
      genus      = data['genus'].to_s
      flavor     = data['flavor_text'].to_s.gsub("\n", ' ').gsub("\f", ' ')
      types      = Array(data['types']).map(&:capitalize).join(' / ')
      gen        = data['generation'].to_s.gsub('-', ' ').split.map(&:capitalize).join(' ')
      height_m   = (data['height_dm'].to_f / 10).round(1)
      weight_kg  = (data['weight_hg'].to_f / 10).round(1)
      base_exp   = data['base_experience'].to_s

      stats      = data['stats'] || {}
      hp         = stats['hp'].to_s
      atk        = stats['attack'].to_s
      def_       = stats['defense'].to_s
      sp_atk     = stats['special-attack'].to_s
      sp_def     = stats['special-defense'].to_s
      spd        = stats['speed'].to_s

      abilities  = Array(data['abilities'])
      ability_lines = abilities.map do |ab|
        tag = ab['hidden'] ? ' <i>(hidden)</i>' : ''
        "  • <b>#{ab['name'].capitalize}</b>#{tag} — #{ab['effect']}"
      end.join("\n")

      evolution  = Array(data['evolution_chain']).map(&:capitalize).join(' → ')

      dr         = data['damage_relations'] || {}
      weak_to    = dr.values.flat_map { |t| Array(t['double_damage_from']).map { |x| x['name'].capitalize } }.uniq
      immune_to  = dr.values.flat_map { |t| Array(t['no_damage_from']).map { |x| x['name'].capitalize } }.uniq

      legendary_tag = data['is_legendary'] ? ' ⭐ <b>Legendary</b>' : ''
      legendary_tag = data['is_mythical']  ? ' ✨ <b>Mythical</b>'  : legendary_tag

      moves_sample = Array(data['moves_sample']).first(5).map(&:capitalize).join(', ')

      caption = <<~CAP.strip
        #{legendary_tag.empty? ? '' : "#{legendary_tag}\n"}
        🎴 <b>#{pname}</b> — <i>#{genus}</i>
        🔷 <b>Type:</b> #{types}
        🌏 <b>Generation:</b> #{gen}
        📖 <i>#{flavor}</i>

        ━━━━━━━━━━━━━━━━━━━━━━
        📏 <b>Height:</b> #{height_m} m　　⚖️ <b>Weight:</b> #{weight_kg} kg
        ⭐ <b>Base Exp:</b> #{base_exp}　　🎯 <b>Catch Rate:</b> #{data['capture_rate']}

        ━━━━━━━━━━━━━━━━━━━━━━
        📊 <b>Base Stats</b>
          ❤️ HP:          #{hp}
          ⚔️ Attack:      #{atk}
          🛡 Defense:     #{def_}
          🔮 Sp. Attack:  #{sp_atk}
          💠 Sp. Defense: #{sp_def}
          💨 Speed:       #{spd}

        ━━━━━━━━━━━━━━━━━━━━━━
        ✨ <b>Abilities</b>
        #{ability_lines}

        ━━━━━━━━━━━━━━━━━━━━━━
        🔗 <b>Evolution Chain:</b> #{evolution}
        #{ weak_to.any?  ? "⚡ <b>Weak to:</b> #{weak_to.join(', ')}\n" : '' }#{ immune_to.any? ? "🛡 <b>Immune to:</b> #{immune_to.join(', ')}\n" : '' }
        🎮 <b>Sample Moves:</b> #{moves_sample}
      CAP

      image_url = data.dig('sprites', 'official') ||
                  data.dig('sprites', 'home')     ||
                  data.dig('sprites', 'default')

      if image_url && !image_url.empty?
        send_photo(chat_id, image_url, caption.strip, reply_to)
      else
        send_message(chat_id, caption.strip, reply_to)
      end

    rescue JSON::ParserError
      send_message(chat_id, "got a weird response for <b>#{name}</b>~ try again? 😅", reply_to)
    rescue => e
      puts "⚠️  _run_pokemon error: #{e.class} #{e.message}"
      send_message(chat_id, "something went wrong fetching <b>#{name}</b>~ 😔", reply_to)
    end
  end


  def self._run_insta(chat_id, url, reply_to = nil)
    send_chat_action(chat_id, 'upload_video')
    begin
      encoded  = URI.encode_www_form_component(url)
      api_uri  = URI("https://anya-apis.vercel.app/insta?url=#{encoded}")
      response = Net::HTTP.get_response(api_uri)
      data     = JSON.parse(response.body)

      unless data['status'] == true && data['data'].is_a?(Array) && !data['data'].empty?
        send_message(chat_id, "❌ couldn't download that~ make sure the post is public!", reply_to)
        return
      end

      items = data['data']
      count = items.length

      items.each_with_index do |item, idx|
        media_url = item['url'].to_s
        thumb_url = item['thumbnail'].to_s

        caption = "📸 <b>Instagram Media</b>#{count > 1 ? " (#{idx + 1}/#{count})" : ''}\n\n"                   "🔗 <a href=\"#{url}\">View on Instagram</a>\n"                   "✨ <i>Downloaded by Chiku~</i>"

        if media_url.end_with?('.mp4')
          send_chat_action(chat_id, 'upload_video')
          send_video(chat_id, media_url, caption, reply_to)
        elsif media_url.match?(/\.(jpg|jpeg|png|webp)/i)
          send_chat_action(chat_id, 'upload_photo')
          send_photo(chat_id, media_url, caption, reply_to)
        elsif thumb_url.match?(/\.(jpg|jpeg|png|webp)/i)
          send_chat_action(chat_id, 'upload_photo')
          send_photo(chat_id, thumb_url, caption, reply_to)
        else
          send_message(chat_id, "#{caption}\n\n📥 <a href=\"#{media_url}\">Direct Download</a>", reply_to)
        end

        sleep(0.4) if count > 1
      end

    rescue JSON::ParserError
      send_message(chat_id, "❌ API returned weird data~ try again later!", reply_to)
    rescue => e
      puts "⚠️  _run_insta error: #{e.class} #{e.message}"
      send_message(chat_id, "❌ something went wrong downloading that~", reply_to)
    end
  end

  # Detect if a string is a Pinterest URL (pin.it shortlink or full pinterest.com URL)
  def self.pinterest_url?(str)
    str.to_s.match?(/\A(https?:\/\/)?(www\.)?(pin\.it\/|pinterest\.com\/)/i)
  end

  def self._run_pinterest(chat_id, query, reply_to)
    is_url = pinterest_url?(query)

    wait_text = is_url       ? "📌 <b>Fetching that Pinterest pin…</b>\n<i>One sec~ ✨</i>"       : "🔍 <b>Searching Pinterest for \"#{query}\"…</b>\n<i>Hang tight~ ✨</i>"

    wait_msg_id = begin
      res = tg_post('sendMessage', {
        'chat_id'    => chat_id.to_s,
        'text'       => wait_text,
        'parse_mode' => 'HTML'
      }, reply_to)
      JSON.parse(res.body).dig('result', 'message_id') rescue nil
    end

    begin
      encoded  = URI.encode_www_form_component(query)
      api_uri  = URI("https://anya-apis.vercel.app/pinterest?query=#{encoded}")
      http     = Net::HTTP.new(api_uri.hostname, api_uri.port)
      http.use_ssl      = true
      http.open_timeout = 15
      http.read_timeout = 30
      response = http.get(api_uri.request_uri)

      delete_message(chat_id, wait_msg_id) if wait_msg_id

      unless response.code == '200'
        send_message(chat_id, "❌ Pinterest API error #{response.code}~", reply_to)
        return
      end

      data = JSON.parse(response.body)
      mode = data['mode']

      # ── PIN mode: single pin URL was passed ────────────────────────────
      if mode == 'pin'
        title     = data['title'].to_s.strip
        pin_url   = data['pin_url'].to_s
        image_url = data['image_url'].to_s
        video_url = data['video_url'].to_s

        caption = "📌 <b>Pinterest Pin</b>\n"
        caption += "📝 #{title}\n" unless title.empty?
        caption += "\n🔗 <a href=\"#{pin_url}\">View on Pinterest</a>" unless pin_url.empty?
        caption += "\n✨ <i>via Chiku~</i>"

        if !video_url.empty? && video_url != 'null'
          send_chat_action(chat_id, 'upload_video')
          send_video(chat_id, video_url, caption, reply_to)
        elsif !image_url.empty?
          send_chat_action(chat_id, 'upload_photo')
          send_photo(chat_id, image_url, caption, reply_to)
        else
          send_message(chat_id, "❌ couldn't find media in that pin~", reply_to)
        end
        return
      end

      # ── SEARCH mode: query string was passed ───────────────────────────
      all_urls = (data['images'] || []).first(10)

      if all_urls.empty?
        send_message(chat_id, "no results for \"#{query}\"~ 😔", reply_to)
        return
      end

      caption_first = "📌 <b>Pinterest</b> — #{query}\n<i>#{all_urls.size} images~</i>"

      send_chat_action(chat_id, 'upload_photo')
      group_res = send_media_group(chat_id, all_urls, [caption_first], reply_to)
      group_ok  = begin
        JSON.parse(group_res.body)['ok'] == true
      rescue
        false
      end

      unless group_ok
        # Fallback: send one by one
        all_urls.each_with_index do |url, i|
          begin
            send_photo(chat_id, url,
                       i == 0 ? caption_first : '',
                       reply_to, 'HTML')
            sleep(0.35)
          rescue => e
            puts "⚠️  pinterest individual send failed (#{i}): #{e.message}"
          end
        end
      end

    rescue JSON::ParserError
      delete_message(chat_id, wait_msg_id) if wait_msg_id
      send_message(chat_id, "❌ Pinterest API returned invalid data~", reply_to)
    rescue => e
      delete_message(chat_id, wait_msg_id) if wait_msg_id
      send_message(chat_id, "❌ Pinterest error: #{e.message.split(':').last.strip}", reply_to)
      puts "⚠️  _run_pinterest error: #{e.message}"
    end
  end

  def self._run_imagine(chat_id, prompt, reply_to)
    if prompt.nil? || prompt.strip.empty?
      send_message(chat_id, "give me something to imagine~ like: imagine a dragon 🐉", reply_to)
      return
    end

    prompt  = prompt.strip
    encoded = URI.encode_www_form_component(prompt)


    wait_msg = tg_post('sendMessage', {
      'chat_id'    => chat_id.to_s,
      'text'       => "🎨 <b>Generating your image…</b>\n<i>This takes a few seconds, hang tight~ ✨</i>",
      'parse_mode' => 'HTML'
    }, reply_to)
    wait_msg_id = JSON.parse(wait_msg.body).dig('result', 'message_id') rescue nil

    begin
      api_url  = URI("https://anya-apis.vercel.app/Imagine?prompt=#{encoded}")
      img_data = Net::HTTP.start(api_url.hostname, api_url.port, use_ssl: true,
                                 read_timeout: 55, open_timeout: 15) do |http|
        http.get(api_url.request_uri)
      end.body.b

      
      if img_data.nil? || img_data.bytesize < 500
        raise "API returned empty or too-small response (#{img_data&.bytesize || 0} bytes)"
      end

      caption = "🎨 <b>AI Generated Image</b>\n" \
                "╭──────────────────\n" \
                "│ 🖊 <b>Prompt:</b> <i>#{prompt}</i>\n" \
                "│ 🤖 <b>Powered by:</b> Chiku AI\n" \
                "╰──────────────────"

      delete_message(chat_id, wait_msg_id) if wait_msg_id

      io = StringIO.new(img_data)
      io.set_encoding(Encoding::BINARY)

      tg_uri = URI("https://api.telegram.org/bot#{TOKEN}/sendPhoto")
      req    = Net::HTTP::Post.new(tg_uri)
      form   = [
        ['chat_id',    chat_id.to_s],
        ['caption',    caption],
        ['parse_mode', 'HTML'],
        ['photo',      io, { filename: 'image.jpg', content_type: 'image/jpeg' }]
      ]
      form << ['reply_to_message_id', reply_to.to_s] if reply_to
      req.set_form(form, 'multipart/form-data')

      tg_res = Net::HTTP.start(tg_uri.hostname, tg_uri.port, use_ssl: true,
                               open_timeout: 15, read_timeout: 30) { |h| h.request(req) }

      unless JSON.parse(tg_res.body)['ok']
        raise "Telegram sendPhoto failed: #{tg_res.body[0..200]}"
      end

    rescue => e
      delete_message(chat_id, wait_msg_id) if wait_msg_id
      send_message(chat_id, "couldn't generate that image rn 😔 (#{e.message.split(':').last.strip})", reply_to)
      puts "⚠️  _run_imagine error: #{e.class} #{e.message}"
    end
  end

  def self._run_tts(chat_id, text, reply_to)
    if text.nil? || text.strip.empty?
      send_message(chat_id, "give me some text to convert~ like: /tts hello world 🎙️", reply_to)
      return
    end

    text    = text.strip
    encoded = URI.encode_www_form_component(text)

    send_chat_action(chat_id, 'upload_voice')

    begin
      api_uri  = URI("https://anya-apis.vercel.app/tts?text=#{encoded}")
      response = Net::HTTP.get_response(api_uri)
      data     = JSON.parse(response.body)

      audio_url = data['url'].to_s

      if audio_url.empty?
        send_message(chat_id, "couldn't generate voice for that~ try again 😔", reply_to)
        return
      end

      send_audio(chat_id, audio_url, '', reply_to)
    rescue JSON::ParserError
      send_message(chat_id, "tts api returned invalid data~ try again later!", reply_to)
    rescue => e
      puts "⚠️  _run_tts error: #{e.class} #{e.message}"
      send_message(chat_id, "something went wrong with tts~ 😔", reply_to)
    end
  end

  def self.split_message(text, limit = 4000)
    return [text] if text.length <= limit
    chunks = []
    while text.length > limit
      cut = text.rindex("\n", limit) || text.rindex(' ', limit) || limit
      chunks << text[0...cut]
      text    = text[cut..].lstrip
    end
    chunks << text unless text.empty?
    chunks
  end

  def self.tg_post(method, form, reply_to = nil)
    form['reply_to_message_id'] = reply_to.to_s if reply_to
    uri = URI("https://api.telegram.org/bot#{TOKEN}/#{method}")
    req = Net::HTTP::Post.new(uri)
    req.set_form_data(form)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
  rescue => e
    puts "⚠️  tg_post #{method}: #{e.message}"; nil
  end
end
