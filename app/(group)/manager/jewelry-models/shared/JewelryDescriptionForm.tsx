"use client";
import dynamic from "next/dynamic";
import { useFormContext, useWatch } from "react-hook-form";

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});
const JewelryDescriptionForm: React.FC<{}> = () => {
	const { setValue, control } = useFormContext();
	const value = useWatch({ control, name: "description" });
	return (
		<ReactQuill
			theme="snow"
			value={value}
			onChange={(value) => setValue("description", value)}
			className="rounded"
		/>
	);
};
export default JewelryDescriptionForm;
