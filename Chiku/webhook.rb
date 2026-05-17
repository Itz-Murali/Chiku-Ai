
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

def derive_webhook_url(req = nil)
  host = nil

  if req

    host =
      (req.respond_to?(:get_header) && req.get_header('HTTP_X_FORWARDED_HOST')) ||
      (req.respond_to?(:[])         && req['x-forwarded-host'])                 ||
      (req.respond_to?(:host)       && req.host)                                ||
      (req.respond_to?(:env)        && req.env['HTTP_HOST'])
  end


  host ||= ENV['VERCEL_URL'] || ENV['WEBHOOK_HOST']

  raise 'Cannot derive webhook host: no request and no VERCEL_URL/WEBHOOK_HOST env var set' if host.nil?


  "https://#{host.sub(/^https?:\/\//, '').chomp('/')}/api"
end

def set_webhook(our_url)


  allowed = URI.encode_www_form_component('["message","my_chat_member","callback_query"]')
  uri = URI("https://api.telegram.org/bot#{TOKEN}/setWebhook?url=#{URI.encode_www_form_component(our_url)}&allowed_updates=#{allowed}")
  Net::HTTP.get(uri)
end

def get_webhook_info
  uri = URI("https://api.telegram.org/bot#{TOKEN}/getWebhookInfo")
  response = Net::HTTP.get_response(uri)
  response.is_a?(Net::HTTPSuccess) ? JSON.parse(response.body) : nil
end

def delete_webhook
  uri = URI("https://api.telegram.org/bot#{TOKEN}/deleteWebhook")
  response = Net::HTTP.get_response(uri)
  response.is_a?(Net::HTTPSuccess) ? JSON.parse(response.body) : nil
end
