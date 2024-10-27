import { TJewelryCreate } from "@/types";

function generateSKU(model: Omit<TJewelryCreate, "sku">) {
	const categoryCode = model.category?.id ?? "GEN";
	const nameCode = model.name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase();
	const isCustomCode = model.isCustom ? "C" : "N";
	const colorCode = model.color ? model.color[0].toUpperCase() : "X";
	const weightCode = model.weight.toString().padStart(2, "0");
	const uniqueCode = (new Date().getTime() % 100000).toString();

	return `${nameCode}${categoryCode}${isCustomCode}${colorCode}${weightCode}${uniqueCode}`;
}
const generate = {
	generateSKU,
};
export default generate;
