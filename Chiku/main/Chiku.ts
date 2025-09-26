import { getChikuResponse } from "../utils/Response";
import { TgApi } from "./api";
import { TOKEN } from "../../config";
import { getRandomErrorText } from "../../strings/Magical-Spells";

class ChikuAi {
  private static commands: Map<string, Function> = new Map();
  private static callbacks: Map<string, Function> = new Map();

  static on_command(command: string, handler: Function): void {
    ChikuAi.commands.set(command, handler);
  }

  static callback(name: string, handler: Function): void {
    ChikuAi.callbacks.set(name, handler);
  }

  static async handleMessage(message: { chat: { id: number }; text?: string }): Promise<void> {
    const chatId = message.chat.id;
    const text = message.text?.trim() ?? "";
    const command = text.split(" ")[0];

    if (ChikuAi.commands.has(command)) {
      const handler = ChikuAi.commands.get(command);
      await handler?.(message);
    } else {
      await ChikuAi.TypingAction(chatId);
      try {
        const aiResponse = await getChikuResponse(text, chatId);
        await ChikuAi.sendWithRetries(chatId, aiResponse);
      } catch (error) {
        console.error("Error handling message:", error);
      }
    }
  }

  static async sendWithRetries(chatId: number, message: string, retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await ChikuAi.send_message(chatId, message);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} to send message failed:`, error);
        if (attempt === retries) {
          console.error("All attempts to send the message failed.");
        }
      }
    }
  }

  static async handleCallback(callbackQuery: { data: string }): Promise<void> {
    const callbackData = callbackQuery.data;

    if (ChikuAi.callbacks.has(callbackData)) {
      const handler = ChikuAi.callbacks.get(callbackData);
      await handler?.(callbackQuery);
    } else {
      console.error("No handler registered for callback:", callbackData);
    }
  }

  static async send_message(chatId: number, text: string): Promise<any> {
    const effectIds = [
      "5044134455711629726",
      "5046509860389126442",
      "5107584321108051014",
      "5104841245755180586",
    ];
    const randomEffectId = effectIds[Math.floor(Math.random() * effectIds.length)];
    const response = await fetch(
      TgApi("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        message_effect_id: randomEffectId,
      })
    );

    return response.json();
  }

  static async send_messageV2(
    chatId: number,
    text: string,
    options: { parse_mode?: string; reply_markup?: any } = {}
  ): Promise<any> {
    const { parse_mode = "Markdown", reply_markup } = options;
    const body: Record<string, any> = { chat_id: chatId, text, parse_mode };

    if (reply_markup) {
      try {
        body.reply_markup = typeof reply_markup === "object" ? JSON.stringify(reply_markup) : reply_markup;
      } catch (error) {
        console.error("Error serializing reply_markup:", error);
        throw new Error("Invalid reply_markup provided.");
      }
    }

    const response = await fetch(TgApi("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return response.json();
  }

  static async send_error(chatId: number): Promise<void> {
    const randomError = getRandomErrorText();
    await ChikuAi.send_message(chatId, randomError);
  }

  static async delete_message(chatId: number, messageId: number): Promise<void> {
    try {
      await fetch(TgApi("deleteMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
      });
    } catch (error) {
      console.error(`Failed to delete message (ID: ${messageId}):`, error);
    }
  }

  static async sendMediaGroup(chatId: number, mediaGroup: Array<{ type: string; media: string }>): Promise<void> {
    await fetch(
      TgApi("sendMediaGroup", {
        chat_id: chatId,
        media: JSON.stringify(mediaGroup),
      })
    );
  }

  static async sendPhotoAction(chatId: number): Promise<void> {
    try {
      await fetch(TgApi("sendChatAction"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action: "upload_photo" }),
      });
    } catch (error) {
      console.error("Error sending photo action:", error);
    }
  }

  static async sendVoiceAction(chatId: number): Promise<void> {
    try {
      await fetch(TgApi("sendChatAction"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action: "record_voice" }),
      });
    } catch (error) {
      console.error("Error sending voice action:", error);
    }
  }

  static async send_audio(chatId: number, audioUrl: string): Promise<void> {
    await fetch(TgApi("sendAudio"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      audio: audioUrl,
      title: "Chiku Ai",
      performer: "Chiku Ai",
    }),
  });
}

  static async TypingAction(chatId: number): Promise<void> {
    await fetch(TgApi("sendChatAction", { chat_id: chatId, action: "typing" }));
  }

  static async send_photo(
    chatId: number,
    photoUrl: string,
    options: { caption?: string; parse_mode?: string; reply_markup?: any; spoiler?: boolean } = {}
  ): Promise<void> {
    const { caption = "", parse_mode = "MarkdownV2", reply_markup = undefined, spoiler = false } = options;
    const photo = spoiler ? `||${photoUrl}||` : photoUrl;

    await fetch(TgApi("sendPhoto"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo,
        caption: caption || undefined,
        parse_mode: caption ? parse_mode : undefined,
        reply_markup: reply_markup || undefined,
      }),
    });
  }

  static async getFile(fileId: string): Promise<any> {
    try {
      const apiUrl = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file info: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (!responseData.ok) {
        throw new Error(`Error in API response: ${responseData.description}`);
      }
      return responseData.result;
    } catch (error) {
      console.error("Error fetching file info:", error);
      throw error;
    }
  }

  static async send_video(chatId: number, videoUrl: string, caption: string): Promise<void> {
    await fetch(TgApi("sendVideo"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        video: videoUrl,
        caption,
        parse_mode: "HTML",
      }),
    });
  }

  static async VideoAction(chatId: number): Promise<void> {
    await fetch(TgApi("sendChatAction", { chat_id: chatId, action: "upload_video" }));
  }

  static async send_animation(
    chatId: number,
    animationUrl: string,
    options: { caption?: string; parse_mode?: string } = {}
  ): Promise<void> {
    const { caption = "", parse_mode = "Markdown" } = options;

    await fetch(TgApi("sendAnimation"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        animation: animationUrl,
        caption: caption || undefined,
        parse_mode: caption ? parse_mode : undefined,
      }),
    });
  }

  static async edit_message_text(
    chatId: number,
    messageId: number,
    text: string,
    options: { parse_mode?: string; reply_markup?: any } = {}
  ): Promise<void> {
    await fetch(TgApi("editMessageText"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        ...options,
      }),
    });
  }
}

export { ChikuAi };



