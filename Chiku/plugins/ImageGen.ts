import { ChikuAi } from "../../Chiku";
import { BOT_USERNAME as B, OWNER_USERNAME as O } from "../../config";



async function generateImage(chatId: number, prompt: string): Promise<void> {
  const fetchingMessage = await ChikuAi.send_message(chatId, "⏳ *Hold on! Crafting your artistic masterpiece...* 🎨");
  const fetchingMessageId = fetchingMessage.result?.message_id;

  try {
    const response = await fetch(
      `https://death-image.ashlynn.workers.dev/generate?prompt={encodeURIComponent(prompt)}&image=1&dimensions=3:4&safety=true`;
      );

    

    const data = await response.json();
    const imageUrls = data.images || [];

    if (imageUrls.length === 0) {
      throw new Error("No images returned from API.");
    }

    const caption = `
✨ **Behold Your Dreamed Artwork!** ✨  

🌟 **Prompt**: ${prompt}  
🖌️ **Created By**: *The magic of AI*  
🔮 **Powered By**: @${B}  
❤️ **Made With Love By**: @${O}  
    `;

    for (const imageUrl of imageUrls) {
      await ChikuAi.send_photo(chatId, imageUrl, { caption, parse_mode: "Markdown" });
    }

    if (fetchingMessageId) {
      await ChikuAi.delete_message(chatId, fetchingMessageId);
    }
  } catch (error) {
    console.error(`Error generating image: ${error}`);

    if (fetchingMessageId) {
      await ChikuAi.delete_message(chatId, fetchingMessageId);
    }

    await ChikuAi.send_error(chatId);
  }
}

export { generateImage };




