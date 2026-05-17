<p align="center">
  <img src="https://files.catbox.moe/1f6ks8.jpg" alt="Chiku Bot" width="250""/>
</p>

<h1 align="center">𝐂 𝚮 𝐈 𝐊 𝐔  𓆩 𔘓  𓆪 </h1>

<p align="center">
  <b>Your warm, playful Telegram AI bestie — built in Ruby, deployed on Vercel.</b><br/>
  <i>Short replies. Natural vibes. Zero robotic energy.</i>
</p>

<p align="center">
  <a href="https://t.me/ChikuAiBot"><img src="https://img.shields.io/badge/Telegram-@ChikuAiBot-2aabee?logo=telegram&logoColor=white&style=for-the-badge"/></a>
  
  <img src="https://img.shields.io/badge/Ruby-3.x-CC342D?logo=ruby&logoColor=white&style=for-the-badge"/>
  
</p>

---

## 🌸 What is Chiku?

Chiku isn't your average chatbot. She's that friend who always knows what to say — casual, warm, and genuinely fun to talk to. No essay-length replies, no weird robotic phrasing. Just natural, real-feeling conversations that make you forget you're chatting with a bot.

She works in **private chats** and **group chats**, responds when mentioned or replied to, and comes packed with 60+ reaction GIFs, anime images, AI image generation, Pinterest search, Pokémon cards, admin tools, and much more.

> **Live on Telegram:** [@ChikuAiBot](https://t.me/ChikuAiBot) · **Community:** [@ChikuBots](https://t.me/ChikuBots)

---

## ✨ Feature Overview

| Category | What's included |
|---|---|
| 🤖 AI Chat | Natural conversation via Anya Api AI — context-aware, short replies |
| 🎭 Reaction GIFs | 60 anime reaction GIFs with tappable sender & target mentions |
| 🖼️ Anime Images | Neko, waifu, husbando, kitsune via nekos.best |
| 📌 Pinterest Search | Image search with group send + one-by-one fallback |
| 🎨 AI Image Gen | Text-to-image via Anya AI (Imagine API) |
| 🃏 Pokémon | Pokémon info + official artwork by name |
| 🌤️ Weather | Live weather for any city |
| 💬 Fun & Games | Quotes, facts, jokes |
| 🌍 Translation | Translate to 10+ languages |
| 📖 Urban Dictionary | Slang definitions |
| 🛡️ Admin Tools | Ban, kick, mute, unmute, pin, unpin, delete (group admins) |
| 🔧 Dev Tools | `/eval` Ruby, `/sh` shell (owner only) |
| 📡 Webhook Manager | Enable/disable webhook from the landing page |

---

## 🎭 Reaction GIFs — Full List (60 actions)

All reaction GIFs are powered by **nekos.best**. When used with a reply or mention, both the sender and target are shown as **tappable hyperlink mentions**.

| Affection | Playful | Emotions | Actions |
|---|---|---|---|
| hug · cuddle · pat | poke · tickle · yeet | cry · blush · pout | wave · salute · nod |
| kiss · peck · blowkiss | bonk · slap · punch | happy · smile · wink | run · spin · dance |
| handhold · lappillow | baka · kick · bite | angry · shocked · smug | clap · highfive · thumbsup |
| kabedon · carry · feed | nom · teehee · bleh | confused · bored · think | shake · handshake · tableflip |
| — | sip · nya · wag | yawn · facepalm · shrug | lurk · shoot · sleep · stare |


---

## 🖼️ Anime Images

```
/neko      — Random neko image
/waifu     — Random waifu image
/husbando  — Random husbando image
/kitsune   — Random kitsune image
```

All sourced from the **nekos.best** API.

---

## 📌 Pinterest Search

```
/pinterest <query>
```

Searches Pinterest for images and sends them as a **Telegram media group**.
---

## 🎨 AI Image Generation

```
/imagine <prompt>
/imagine cute anime girl in cherry blossoms
/imagine dragon flying over a neon city at night
```

Generates an AI image from your prompt using Anya-Apis.. 

---

## 🃏 Pokémon

```
/pokemon <name>
/pokemon Pikachu
/pokemon Eevee
```

Fetches Pokémon info and official artwork by name from the Pokémon API.

---

## 🌤️ Weather

```
/weather <city>
/weather Tokyo
/weather New York
```

Returns current weather conditions, temperature, and description for any city.

---

## 💬 Fun Commands

| Command | Description |
|---|---|
| `/quote` | Random inspirational quote |
| `/fact` | Random fun fact |
| `/joke` | Random joke |

---

## 🌍 Translation

Chiku can translate text to 10+ languages. Just ask naturally:
> `translate hello to japanese`
> `translate "good morning" to spanish`

---

## 📖 Urban Dictionary

Look up slang and internet terms:
> `urban dictionary rizz`
> `what does bussin mean`

---

## 🛡️ Admin Commands

These commands require **group admin** permissions (owner always bypassed):

| Command | Description |
|---|---|
| `/ban [@user\|reply]` | Ban a user from the group |
| `/unban [@user\|reply]` | Unban a user |
| `/kick [@user\|reply]` | Kick a user from the group |
| `/mute [@user\|reply]` | Mute a user (restrict messages) |
| `/unmute [@user\|reply]` | Unmute a user |
| `/pin [reply]` | Pin a message |
| `/unpin` | Unpin the current pinned message |
| `/unpinall` | Unpin all messages in the chat |
| `/del [reply]` | Delete a replied message |


---

## 🔧 Developer / Owner Commands

Owner-only commands (IDs set in `config.rb`):

| Command | Description |
|---|---|
| `/eval <ruby>` | Evaluate Ruby code in context |
| `/sh <command>` | Run a shell command |
| `/gcast <message>` | Broadcast a message to all known users/chats |
| `/id` | Show user ID and chat ID |
| `/info [@user\|reply]` | Detailed user or chat info |

---

## ⚙️ General Commands

| Command | Description |
|---|---|
| `/start` | Welcome message + intro |
| `/help` | Full command list |
| `/reactions` | List all 60 reaction GIF commands |
| `/reset` | Clear AI conversation memory |
| `/mood <vibe>` | Set Chiku's response mood |

---

## 🚀 Deployment

Chiku is designed to run **serverlessly on [Vercel](https://vercel.com)** using the `@vercel/ruby` runtime.

### Prerequisites

- Ruby 3.x
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- A MongoDB connection string (for user/chat persistence with allowed all ip access)
- Vercel account (free tier works)

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/Itz-Murali/Chiku-Ai.git
cd Chiku-Ai
```

**2. Install dependencies**
```bash
bundle install
```

**3. Configure `config.rb`**
```ruby
TOKEN      = "your-telegram-bot-token"
BOT_ID     = TOKEN.split(':').first.to_i   # auto-derived
OWNER_IDS  = [your_telegram_user_id]
MONGO_URI  = "mongodb+srv://..."
```

**4. Deploy to Vercel**
```bash
vercel deploy
```

**5. Register the webhook**

Visit your deployment URL to trigger auto-registration:
```
GET https://your-deployment.vercel.app/api
```

Or use the **Enable Chiku** button on the landing page at your deployment URL.




---



## 🫂 Credits

<table width="100%">
    <tr>
      <td align="center" width="50%">
        <img src="https://random-images-anya.vercel.app/anya" width="260"><br><br>
        <b>𝜜ɴყꫝㅤ𓆩💗𓆪</b><br><br>
        <a href="https://github.com/itz-Anya">
          <img src="https://img.shields.io/badge/GitHub-Anya-black?style=for-the-badge&logo=github">
        </a>
      </td>
      <td align="center" width="50%">
        <img src="https://itz-murali-images.vercel.app/api" width="260"><br><br>
        <b>𝐌 𝐔 𝐑 𝚨 𝐋 𝐈 𓂃ִֶָ⋆.˚</b><br><br>
        <a href="https://github.com/Itz-Murali">
          <img src="https://img.shields.io/badge/GitHub-Itz--Murali-black?style=for-the-badge&logo=github">
        </a>
      </td>
    </tr>
  </table>



Special thanks to the amazing tools, platforms, and technologies that made this project possible 💖

- 🌸 [Nekos.Best](https://github.com/Nekos-Best) — Anime image API & resources  
- 🤖 [Telegram Bot API](https://core.telegram.org/bots/api) — Bot interaction system  
- ▲ [Vercel](https://vercel.com/) — Hosting & deployment  
- 🐙 [GitHub](https://github.com/) — Version control & project management  
- 💎 [Ruby](https://www.ruby-lang.org/) — Main programming language  

---

