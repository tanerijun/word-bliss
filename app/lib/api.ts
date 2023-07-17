import { z } from "zod";
import { WordDefinitionsSchema } from "./schema";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

// TODO: If I decide to implement nested route, consider throwing an error instead of null
export async function getWordDefinitions(word: string) {
	try {
		const response = await fetch(`${BASE_URL}/${word}`);
		const json = await response.json();
		const data = z.array(WordDefinitionsSchema).parse(json)[0];
		return data;
	} catch {
		return null;
	}
}
