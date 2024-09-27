import { cn } from "@/utils/cn";
import React from "react";
type LabelCustomProps = {
  label?: string;
  required?: boolean;
  classname?: string;
};
const LabelCustom: React.FC<LabelCustomProps> = ({
  label,
  required = false,
  classname,
}) => {
  return (
    <div className="flex justify-start items-center gap-1">
      {required && <p className="text-red-400 text-xl p-0 m-0">*</p>}
      <p
        className={cn(
          "text-gray-800 font-semibold text-base p-0 m-0",
          classname
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default LabelCustom;
