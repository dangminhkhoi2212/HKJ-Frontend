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
	const uniqueCode = model?.id;

	return `${nameCode}${categoryCode}${uniqueCode}`;
}
const generate = {
	generateSKU,
};
export default generate;
