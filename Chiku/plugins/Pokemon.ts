import { POKEAPI_BASE_URL } from "../../config";
import { ChikuAi } from "../../Chiku";
import { capitalizeFirstLetter } from "../../Chiku/utils";

async function getPokemon(message: any) {
  const chatId = message.chat.id;
  const commandParts = message.text?.split(" ").slice(1);

  if (!commandParts || commandParts.length === 0) {
    await ChikuAi.send_message(
      chatId,
      "❌ Oops! Please tell me the name of a Pokémon to fetch its magic. ✨"
    );
    return;
  }

  const pokemonName = commandParts[0].toLowerCase();
  const pokemonUrl = `${POKEAPI_BASE_URL}pokemon/${pokemonName}`;
  const speciesUrl = `${POKEAPI_BASE_URL}pokemon-species/${pokemonName}`;

  try {

    const response = await fetch(pokemonUrl);
    if (!response.ok) throw new Error(`${response.status}`);

    const data = await response.json();
    const name = capitalizeFirstLetter(data.name);

    const abilities = data.abilities
      .map((ability: { ability: { name: string } }) => ability.ability.name)
      .join(", ");

    const stats = data.stats.reduce(
      (acc: Record<string, number>, stat: { stat: { name: string }; base_stat: number }) => {
        acc[capitalizeFirstLetter(stat.stat.name)] = stat.base_stat;
        return acc;
      },
      {}
    );

    let description = "No description available.";
    let genus = "";
    try {
      const speciesRes = await fetch(speciesUrl);
      if (speciesRes.ok) {
        const speciesData = await speciesRes.json();

        const flavorEntry = speciesData.flavor_text_entries.find(
          (entry: any) => entry.language.name === "en"
        );
        if (flavorEntry) {
          description = flavorEntry.flavor_text
            .replace(/\n|\f/g, " ")
            .trim();
        }

        const genusEntry = speciesData.genera.find(
          (g: any) => g.language.name === "en"
        );
        if (genusEntry) {
          genus = genusEntry.genus;
        }
      }
    } catch (err) {
      console.error("Failed to fetch species data:", err);
    }

    let responseMessage = `✨ **${name}** ✨\n\n`;
    if (genus) responseMessage += `🧬 *${genus} Pokémon*\n`;
    if (description) responseMessage += `📖 *About:* ${description}\n\n`;

    responseMessage += `🌟 **Abilities:** ${abilities}\n\n📊 **Stats:**\n`;
    for (const [stat, value] of Object.entries(stats)) {
      responseMessage += `   🔹 **${stat}:** ${value}\n`;
    }

    const pokeImgUrl = `https://img.pokemondb.net/artwork/${pokemonName}.jpg`;

    await ChikuAi.send_photo(chatId, pokeImgUrl, {
      caption: responseMessage,
      parse_mode: "Markdown",
    });
  } catch (error: any) {
    if (error.message.includes("404")) {
      await ChikuAi.send_message(
        chatId,
        "❌ Uh-oh! Couldn't find that Pokémon. 🕵️‍♂️ Try another name!"
      );
    } else {
      await ChikuAi.send_message(
        chatId,
        "❌ Something went wrong while fetching your Pokémon. 😢"
      );
    }
  }
}

export { getPokemon };
