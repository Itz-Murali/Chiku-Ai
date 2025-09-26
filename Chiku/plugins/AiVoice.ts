import { ChikuAi } from "../../Chiku";


async function GetAiVoice(chatId: number, text: string): Promise<void> {
  await ChikuAi.sendVoiceAction(chatId);
  
  try {
    const X = await ChikuAi.send_message(chatId, "Generating Artificial Intelligence Voice For Your Text🔊..");
     const Id = X.result?.message_id;
    const encodedText = encodeURIComponent(text);
    const ttsApiUrl = `https://chikuaivoice.muralimurali3211260.workers.dev/?key=ChikuAiXMurali00&text=${encodedText}`
    
    const response = await fetch(ttsApiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch TTS audio. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    const audioUrl = data.ChikuUrl; 

    if (!audioUrl) {
      throw new Error("No audio URL found in the TTS API response.");
    }

    
    await ChikuAi.send_audio(chatId, audioUrl);
    if (Id) {
      await ChikuAi.delete_message(chatId, Id);
    }
  } catch (error) {
    await ChikuAi.send_error(chatId);
    console.log(error);
  }
}


export { GetAiVoice }
