import { redirect } from "next/navigation";
import React from "react";

import { routesManager } from "@/routes";

type Props = {};

const ManagerPage: React.FC<Props> = ({}) => {
	redirect(routesManager.project);
};

export default ManagerPage;
