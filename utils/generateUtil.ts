import { TJewelry } from "@/types";

function generateSKU(model: TJewelry) {
	if (!model?.id) return "";
	const categoryCode = model?.category?.id ?? "GEN";
	const nameCode =
		model?.category
			?.name!.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase() || "N";
	const isCustomCode = model?.isCustom ? "C" : "N";
	const colorCode = model?.color ? model.color[0].toUpperCase() : "X";
	const uniqueCode = model?.id;

	return `${nameCode}${categoryCode}${isCustomCode}${colorCode}${uniqueCode}`;
}
const generate = {
	generateSKU,
};
export default generate;
