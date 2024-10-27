import { TJewelry } from "./jewelryType";

export type TImageSearchAI = {
	id: number;
	jewelryId: number;
	url: string;
};
export type TImageSearchAIResponse = TJewelry[];
