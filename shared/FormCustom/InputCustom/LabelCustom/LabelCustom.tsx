import React from "react";

import { cn } from "@/utils/cn";

type LabelCustomProps = {
  label?: string;
  required?: boolean;
  classname?: string;
  id?: string;
};
const LabelCustom: React.FC<LabelCustomProps> = ({
  label,
  required = false,
  classname,
  id,
}) => {
  return (
    <label className="flex justify-start items-center gap-1" htmlFor={id}>
      {required && <p className="text-red-400 text-xl p-0 m-0">*</p>}
      <p
        className={cn(
          "text-gray-800 font-semibold text-base p-0 m-0",
          classname
        )}
      >
        {label}
      </p>
    </label>
  );
};

export default LabelCustom;
