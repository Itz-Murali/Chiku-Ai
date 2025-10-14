export async function getChikuResponse(userMessage: string): Promise<string> {
  const encoded = encodeURIComponent(userMessage);
  const endpoint = `https://chiku-bots.vercel.app/Chiku?user_message=${encoded}`;

  async function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function fetchWithRetries(url: string, retries = 3, baseDelay = 700): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          return json;
        } else {
          console.error(`Attempt ${attempt} failed with status: ${res.status}`);
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }
      await sleep(baseDelay * attempt);
    }
    throw new Error("All attempts to call Chiku API failed");
  }

  try {
    const apiResponse = await fetchWithRetries(endpoint, 3);
    if (apiResponse && apiResponse.answer) {
      return apiResponse.answer;
    } else {
      throw new Error("No 'answer' field found in response");
    }
  } catch (error) {
    console.error("getChikuResponse error:", error);
    return "😅 Oops The Network Has Crashed Plz try again later!";
  }
}
