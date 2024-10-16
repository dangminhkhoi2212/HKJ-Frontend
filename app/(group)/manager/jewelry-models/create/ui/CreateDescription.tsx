"use client";
import { useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";

const CreateDescription: React.FC<{}> = () => {
	const { setValue, watch } = useFormContext();
	return (
		<ReactQuill
			theme="snow"
			value={watch("description")}
			onChange={(value) => setValue("description", value)}
			className="rounded"
		/>
	);
};
export default CreateDescription;
