"use client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

import { Frame } from "@/shared/Frame";

import UpdateMaterialForm from "./ui/UpdateMaterialForm";

type Props = {
  params: Params;
};
const MaterialUpdatePage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <Frame title="Cập nhật chất liệu">
      <UpdateMaterialForm id={id} />
    </Frame>
  );
};

export default MaterialUpdatePage;
