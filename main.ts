import { ChikuAi, ChikuOf, ChikuOn, handleWebhook, TgApi } from "./Chiku";
import { MagicalStartMessage, helpMessages, GetRandomMessage, GetRandomCreditsMessage } from "./strings/Magical-Spells";
import { Front_End, ChikuOnPage, ChikuOffPage, ErrorPage } from "./Chiku/Front-End";
import { WEBHOOK, SECRET, TOKEN, BORED_API_URL, WAIFU_API_BASE } from "./config";
import { sendStartMessage, NotifyLogGroup, Neko, getLamaResponse, getClaudResponse, getMixtralResponse, UploadToImageUr, sendDice, DownloadInstaVdo, GetAiVoice, SendUid, GetCharacterImages, generateImage, getPokemon, fetchBingImages, DICE_COMMANDS } from "./Chiku";
import { AiMessage, Funs, Instagram, Tts, Id, Image_Ur, Td, Image, Character, Nekos, NekosV2, BingImg, Pokemon } from "./strings/commands";
import { HugGif, KissGif, Avatars, SmugGif, PatGif } from "./Chiku/utils";
import { NekosCommandsListV2, NekosCommandsList, getRandomTruth, getRandomDare } from "./Chiku/plugins";
import { LOG_GC_ID, SUPPORT_GC, OWNER_USERNAME } from "./config";

// Made By @ChikuBots


addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === "/chikuon") {
    event.respondWith(handleChikuOn(event, url, WEBHOOK, SECRET));
  } else if (url.pathname === "/chikuoff") {
    event.respondWith(handleChikuOff(event));
  } else if (url.pathname === "/") {
    event.respondWith(
      new Response(Front_End, {
        headers: { "Content-Type": "text/html" },
      })
    );
  } else {
    event.respondWith(
      new Response(ErrorPage, {
        headers: { "Content-Type": "text/html" },
        status: 404,
      })
    );
  }
});

async function handleChikuOn(event: FetchEvent, url: URL, webhook: string, secret: string): Promise<Response> {
  try {
    await ChikuOn(event, url, webhook, secret);
    return new Response(ChikuOnPage, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("Error in ChikuOn:", error);
    return new Response(ErrorPage, {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  }
}

async function handleChikuOff(event: FetchEvent): Promise<Response> {
  try {
    await ChikuOf(event);
    return new Response(ChikuOffPage, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("Error in ChikuOff:", error);
    return new Response(ErrorPage, {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  }
}







ChikuAi.on_command("/bingimg", async (message: any) => {
  await fetchBingImages(message);
});

ChikuAi.on_command("/pokemon", async (message: any) => {
 await getPokemon(message);
});


ChikuAi.on_command("/genimg", async (message: any) => {
  const chatId = message.chat.id;
  const text = message.text || "";
  const prompt = text.slice(7).trim();

  if (!prompt) {
    return await ChikuAi.send_message(
      chatId,
      "❌ Please provide a prompt after `/genimg`. Example: `/genimg a serene mountain landscape`"
    );
  }

  await generateImage(chatId, prompt);
});
                   

NekosCommandsList.forEach(({ command, endpoint, isAnimation, caption, fetchingMessage }) => {
  ChikuAi.on_command(command, async (message: any) => {
    const chatId = message.chat.id;

    const fetchingMessageResponse = await ChikuAi.send_message(chatId, fetchingMessage);
    const fetchingMessageId = fetchingMessageResponse.result?.message_id;

    try {
      const response = await fetch(`${WAIFU_API_BASE}${endpoint}`);
      const data = await response.json();
      const url = data.url;

      if (isAnimation) {
        await ChikuAi.send_animation(chatId, url, { caption, parse_mode: "Markdown" });
      } else {
        await ChikuAi.send_photo(chatId, url, { caption, parse_mode: "Markdown" });
      }

      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
    } catch (error) {
      console.error(`Error handling ${command} command:`, error);
      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
      await ChikuAi.send_error(chatId);
    }
  });
});

NekosCommandsListV2.forEach(({ command, endpoint, isAnimation, caption, fetchingMessage }) => {
  ChikuAi.on_command(command, async (message: any) => {
    const chatId = message.chat.id;


    const fetchingMessageResponse = await ChikuAi.send_message(chatId, fetchingMessage);
    const fetchingMessageId = fetchingMessageResponse.result?.message_id;

    try {
      
      let url;
      if (typeof endpoint === "function") {
        url = await endpoint();
      } else {
        const response = await fetch(endpoint);
        const data = await response.json();
        url = data.url;
      }

      
      if (isAnimation) {
        await ChikuAi.send_animation(chatId, url, { caption, parse_mode: "Markdown" });
      } else {
        await ChikuAi.send_photo(chatId, url, { caption, parse_mode: "Markdown" });
      }


      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
    } catch (error) {
      console.error(`Error handling ${command} command:`, error);

      await ChikuAi.send_error(chatId);
      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
    }
  });
});


ChikuAi.on_command("/start", async (message) => {    
  await sendStartMessage(message);
  await NotifyLogGroup(message);
});

ChikuAi.on_command("/lama", async (message) => {
  await ChikuAi.TypingAction(message.chat.id);
  await getLamaResponse(message);
});


ChikuAi.on_command("/claud", async (message) => {
  await ChikuAi.TypingAction(message.chat.id);
  await getClaudResponse(message);
});

ChikuAi.on_command("/mixtral", async (message) => {
  await ChikuAi.TypingAction(message.chat.id);
  await getMixtralResponse(message);
});

ChikuAi.on_command("/tts", async (message) => {
  const chatId = message.chat.id;
  const text = message.text || "";

  const ttsText = text.slice(4).trim();
  if (!ttsText) {
    await ChikuAi.send_message(chatId, "⛔ Please provide some text for the TTS command.");
    return;
  }
  await GetAiVoice(chatId, ttsText);
});

ChikuAi.on_command("/id", async (message) => {
  await ChikuAi.TypingAction(message.chat.id);
  await SendUid(message);  
}
);

ChikuAi.on_command("/character", async (message) => {
  await GetCharacterImages(message);
});


  


DICE_COMMANDS.forEach(({ command, emoji, caption, fetchingMessage }) => {
  ChikuAi.on_command(command, async (message: any) => {
    const chatId = message.chat.id;

    const fetchingMessageResponse = await ChikuAi.send_message(chatId, fetchingMessage);
    const fetchingMessageId = fetchingMessageResponse.result?.message_id;

    try {
      const diceResponse = await sendDice(chatId, emoji, message.message_id);
      const diceValue = diceResponse.dice?.value || 0;

      await ChikuAi.send_message(
        chatId,
        caption(diceValue),
        { reply_to_message_id: diceResponse.message_id }
      );

      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
    } catch (error) {
      console.error(`Failed to process ${command} command:`, error);
      await ChikuAi.send_error(chatId);
      if (fetchingMessageId) {
        await ChikuAi.delete_message(chatId, fetchingMessageId);
      }
     
    }
   
  });
});



ChikuAi.on_command("/ig", async (message) => {
  await DownloadInstaVdo(message);
});




ChikuAi.on_command("/upload", async (message: any) => {
  await ChikuAi.TypingAction(message.chat.id);
  await UploadToImageUr(message);
});



ChikuAi.on_command("/truth", async (message: any) => {
 await ChikuAi.TypingAction(message.chat.id);
 const Truth = getRandomTruth();
 await ChikuAi.send_message(message.chat.id, Truth);
}
                   );
 

ChikuAi.on_command("/dare", async (message: any) => {
 await ChikuAi.TypingAction(message.chat.id);
 const Dare = getRandomDare();
 await ChikuAi.send_message(message.chat.id, Dare);
}
                   );




async function GetFact(): Promise<string> {
  try {
    const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    const data = await response.json();

    if (data && data.text) {
      return data.text;
    } else {
      throw new Error("No fact found in API response");
    }
  } catch (error) {
    console.error("Error fetching fact:", error);
    throw error; 
  }
}


ChikuAi.on_command("/fact", async (message: any) => {
  const chatId = message.chat.id;
  try {
    const factText = await GetFact();

    await ChikuAi.send_message(
      chatId,
      `🧠 *Did You Know?* 🌟\n\n${factText}\n\n✨ *Stay curious and keep learning!* 💡`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error handling /fact command:", error);
    await ChikuAi.send_message(
      chatId,
      "❌ *Oops! Couldn't fetch a fact. Please try again later.*",
      { parse_mode: "Markdown" }
    );
  }
});




ChikuAi.callback("help", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    
    const randomHelpMessage = helpMessages[Math.floor(Math.random() * helpMessages.length)];
    
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: randomHelpMessage,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
  [
    { text: "🤖 AI Features", callback_data: "Ai" },
    { text: "🎉 Fun Commands", callback_data: "Funs" },
  ],
  [
    { text: "📸 Instagram Tools", callback_data: "Instagram" },
    { text: "🔊 Text-to-Speech", callback_data: "Tts" },
  ],
  [
    { text: "🆔 User ID Info", callback_data: "Id" },
    { text: "🖼️ Image Uploader", callback_data: "Image_Ur" },
  ],
  [
    { text: "🔙 Back 🧙‍♂️", callback_data: "back" },
    { text: "➡️ Next Page", callback_data: "2nd_page" },
  ],
]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});



ChikuAi.callback("2nd_page", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    
    const randomHelpMessage = helpMessages[Math.floor(Math.random() * helpMessages.length)];
    
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: randomHelpMessage,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
  [
    { text: "🐾 Nekos Gallery V1", callback_data: "Nekos" },
    { text: "🦋 Nekos Gallery V2", callback_data: "NekosV2" },  
  ],
  [
    { text: "🖼️ Image Generator", callback_data: "Image" },
    { text: "📊 Truth And Dare", callback_data: "Td" },
  ],
  [
    { text: "🔍 Bing Images", callback_data: "BingImg" },
    { text: "🐾 Pokémon Explorer", callback_data: "Pokemon" },
  ],
    [
      { text: "🌟 Anime Characters", callback_data: "Character" },
      ],
  [
    { text: "🔙 Back 🧙‍♂️", callback_data: "help" },
    { text: "✨ Magic Page 🪄", callback_data: "credits_page" },
  ],
]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("show_alert", async (callbackQuery: CallbackQuery) => {
  try {
    
    X = GetRandomMessage();
    await fetch(TgApi("answerCallbackQuery"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
        text: X,
        show_alert: true,
      }),
    });
  } catch (error) {
    console.error(`Error showing alert: ${(error as Error).message}`);
  }
});





ChikuAi.callback("back", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;

  

  const userId = callbackQuery.from.id || "7792739542";
    
  const firstName = callbackQuery.from?.first_name || "Magical User";

    
  const caption = await MagicalStartMessage(userId, firstName);
  const GROUP = `https://t.me/${SUPPORT_GC}`;
  const OWNER_LINK = `https://t.me/${OWNER_USERNAME}`;

  try {
    
    
    const nekoImageUrl = Neko();    

    
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: caption,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
  [
    { text: "🔔 Click Me", callback_data: "show_alert" },
  ],
  [
    { text: "💬 Support", url: GROUP },
    { text: "👑 Owner", url: OWNER_LINK },
  ],
  [
    { text: "🆘 Help", callback_data: "help" },
  ],
]
        },
      }),
    });


    
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(`Failed to edit message. API response: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error(`Error in back callback: ${(error as Error).message}`);
  }
});



ChikuAi.callback("credits_page", async (callbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;

  
  try {
    
    
    const nekoImageUrl = Neko();    

    const caption = `
*ᴡᴀɴɴᴀ sᴇᴇ ᴍᴀɢɪᴄ ?*  
ᴄʟɪᴄᴋ ʙᴇʟᴏᴡ ʙᴜᴛᴛᴏɴ 🔮
`;

    
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: caption,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
  [
    { text: "🍹 Click for Magic", callback_data: "show_credits_message" },
  ],
  [
    { text: "🔙 Back", callback_data: "2nd_page" },
    { text: "🏠 Main Menu", callback_data: "back" },
  ],
]
        },
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(`Failed to edit message. API response: ${JSON.stringify(result)}`);
    }

    
  } catch (error) {
    console.error(`Error in credits_page callback: ${(error as Error).message}`);
    
  }
});




ChikuAi.callback("show_credits_message", async (callbackQuery: CallbackQuery) => {
  try {
    const X = GetRandomCreditsMessage();
    await fetch(TgApi("answerCallbackQuery"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
        text: X,
        show_alert: true,
      }),
    });
  } catch (error) {
    console.error(`Error showing alert: ${(error as Error).message}`);
  }
});



// Help Messages Callbacks

ChikuAi.callback("Ai", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${AiMessage}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});



ChikuAi.callback("Funs", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Funs}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("Instagram", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Instagram}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("Tts", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Tts}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});









ChikuAi.callback("Id", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Id}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});





ChikuAi.callback("Image_Ur", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Image_Ur}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "help" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});


// 2nd page callbacks

ChikuAi.callback("Nekos", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Nekos}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
    const p = await response.json();
    console.log(p);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`, error);
  }
});

ChikuAi.callback("NekosV2", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${NekosV2}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
    const p = await response.json();
    console.log(p);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`, error);
  }
});


ChikuAi.callback("Character", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Character}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});



ChikuAi.callback("Image", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Image}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("Td", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Td}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("BingImg", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${BingImg}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});




ChikuAi.callback("Pokemon", async (callbackQuery: CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  
  try {        
    const nekoImageUrl = Neko();    

    const msg = `${Pokemon}`;
    const response = await fetch(TgApi("editMessageMedia"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: "photo",
          media: nekoImageUrl,
          caption: msg,
          parse_mode: "Markdown",
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Back", callback_data: "2nd_page" },
              
          ],
            ]
        },
      }),
    });
        
  } catch (error) {
    console.error(`Error in help callback: ${(error as Error).message}`);
  }
});
