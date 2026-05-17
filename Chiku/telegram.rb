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
require_relative '../config'

def send_message(chat_id, text, reply_to_message_id = nil, parse_mode = 'HTML')
  uri = URI("https://api.telegram.org/bot#{TOKEN}/sendMessage")
  req = Net::HTTP::Post.new(uri)
  form_data = {
    'chat_id' => chat_id.to_s,
    'text' => text.to_s,
    'parse_mode' => parse_mode
  }
  form_data['reply_to_message_id'] = reply_to_message_id.to_s if reply_to_message_id
  req.set_form_data(form_data)
  Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
end

def send_photo(chat_id, photo_url, caption, reply_to_message_id = nil, parse_mode = 'HTML')
  uri = URI("https://api.telegram.org/bot#{TOKEN}/sendPhoto")
  req = Net::HTTP::Post.new(uri)
  form_data = {
    'chat_id' => chat_id.to_s,
    'photo' => photo_url,
    'caption' => caption.to_s,
    'parse_mode' => parse_mode
  }
  form_data['reply_to_message_id'] = reply_to_message_id.to_s if reply_to_message_id
  req.set_form_data(form_data)
  Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
end

def send_sticker(chat_id, sticker_file_id, reply_to_message_id = nil)
  uri = URI("https://api.telegram.org/bot#{TOKEN}/sendSticker")
  req = Net::HTTP::Post.new(uri)
  form_data = {
    'chat_id' => chat_id.to_s,
    'sticker' => sticker_file_id
  }
  form_data['reply_to_message_id'] = reply_to_message_id.to_s if reply_to_message_id
  req.set_form_data(form_data)
  Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
end

def send_chat_action(chat_id, action = 'typing')
  uri = URI("https://api.telegram.org/bot#{TOKEN}/sendChatAction")
  req = Net::HTTP::Post.new(uri)
  req.set_form_data('chat_id' => chat_id.to_s, 'action' => action)
  Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
end

def simulate_typing(chat_id, duration_seconds = 0.1)
  send_chat_action(chat_id, 'typing')
  sleep(duration_seconds)
end
