import React from "react";

import { TMaterial } from "@/types";

import MaterialCard from "./MaterialCard";

type Props = {
  data: TMaterial[];
};
const MaterialList: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-3 place-items-center gap-3">
      {data.map((card) => (
        <MaterialCard key={card.id} data={card} />
      ))}
    </div>
  );
};

export default MaterialList;
