import { ChikuAi } from "../../Chiku";
import { OWNER_USERNAME as X, BOT_USERNAME as Y } from "../../config";

async function GetCharacterImages(message: any): Promise<void> {
  const chatId = message.chat.id;
  const text = message.text || "";
  const characterName = text.slice(11).trim();

  if (!characterName) {
    try {
      await ChikuAi.send_message(
        chatId,
        "❌ Please Provide A Character Name. 📝 *Usage*: `/Character <Name>`"
      );
    } catch (err) {
      console.error("Error sending message for empty character name:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error: ${err}`);
    }
    return;
  }

  const url = `https://www.zerochan.net/${encodeURIComponent(characterName)}`;
  let fetchingMessage: any = null;

  try {
    fetchingMessage = await ChikuAi.send_message(
      chatId,
      `🔍 *Summoning Your Character Images...* ✨\n\n💫 *Character*: ${characterName}\n🌟 *Hold Tight, The Magic Is Brewing!*`
    );
  } catch (err) {
    console.error("Error sending fetching message:", err);
    await ChikuAi.send_message(chatId, `⚠️ Error: ${err}`);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = await response.text();

    let imgTags: RegExpMatchArray[] = [];
    try {
      imgTags = Array.from(html.matchAll(/<img[^>]+(?:data-src|src)="([^"]+)"/gi));
    } catch (err) {
      console.error("Error parsing img tags:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error parsing images: ${err}`);
    }

    let srcList: string[] = [];
    try {
      srcList = imgTags.map((m) => m[1]);
      srcList = srcList.map((url) => (url.startsWith("//") ? "https:" + url : url));
      srcList = srcList.filter((url) => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url));
      srcList = srcList.slice(10);
    } catch (err) {
      console.error("Error processing src list:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error processing image URLs: ${err}`);
    }

    const uniqueImages = [...new Set(srcList)];

    if (uniqueImages.length === 0) {
      try {
        await ChikuAi.send_message(chatId, "❌ No Images Found For The Provided Character Name. 😢");
      } catch (err) {
        console.error("Error sending no images message:", err);
        await ChikuAi.send_message(chatId, `⚠️ Error: ${err}`);
      }
      return;
    }

    const imagesToSend = uniqueImages.length > 40 ? uniqueImages.slice(0, 40) : uniqueImages;

    const mediaGroup = imagesToSend.map((imageUrl) => ({
      type: "photo",
      media: imageUrl,
    }));

    const batchSize = 10;
    for (let i = 0; i < mediaGroup.length; i += batchSize) {
      const batch = mediaGroup.slice(i, i + batchSize);
      try {
        await ChikuAi.sendMediaGroup(chatId, batch);
      } catch (err) {
        console.error("Error sending media group batch:", err);
        await ChikuAi.send_message(chatId, `⚠️ Error sending batch: ${err}`);
        // fallback: send individually
        for (const item of batch) {
          try {
            await ChikuAi.send_message(chatId, item.media);
          } catch (innerErr) {
            console.error("Error sending individual image:", innerErr);
            await ChikuAi.send_message(chatId, `⚠️ Error sending image: ${innerErr}`);
          }
        }
      }
    }

    try {
      if (fetchingMessage?.result?.message_id) {
        await ChikuAi.delete_message(chatId, fetchingMessage.result.message_id);
      }
    } catch (err) {
      console.error("Error deleting fetching message:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error deleting fetching message: ${err}`);
    }

    try {
      await ChikuAi.send_message(
        chatId,
        `🎉 *Your Character Images Have Been Fetched Successfully!* 🌟\n\n💫 *Character*: ${characterName}\n📸 *Total Images Sent*: ${imagesToSend.length}\n\n🔮 *Summoned By*: @${Y}\n✨ *Crafted With ❤️ By*: @${X}`
      );
    } catch (err) {
      console.error("Error sending success message:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error sending success message: ${err}`);
    }

  } catch (error) {
    console.error("Error Fetching Character Images:", error);

    try {
      if (fetchingMessage?.result?.message_id) {
        await ChikuAi.delete_message(chatId, fetchingMessage.result.message_id);
      }
    } catch (err) {
      console.error("Error deleting fetching message after error:", err);
      await ChikuAi.send_message(chatId, `⚠️ Error deleting fetching message: ${err}`);
    }

    try {
      await ChikuAi.send_message(chatId, `❌ Error Fetching Character Images: ${error}`);
    } catch (err) {
      console.error("Error sending final error message:", err);
    }
  }
}

export { GetCharacterImages };
