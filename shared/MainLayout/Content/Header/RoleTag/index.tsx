import { Tag } from "antd";
import React from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import useAccountStore from "@/stores/account";
import { TAccountInfo } from "@/types";

const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
const RoleTag: React.FC = () => {
  const account: TAccountInfo | null | undefined = useAccountStore(
    (state) => state.account
  );
  if (!account) return <></>;
  switch (account!.authorities![0]) {
    case AUTHORIZATIONS.ADMIN:
      return <Tag color="blue">{AUTHORIZATIONS.ADMIN}</Tag>;
    case AUTHORIZATIONS.MANAGER:
      return <Tag color="yellow">{AUTHORIZATIONS.MANAGER}</Tag>;
    case AUTHORIZATIONS.EMPLOYEE:
      return <Tag color="green">{AUTHORIZATIONS.EMPLOYEE}</Tag>;
    default:
      break;
  }
};

export default RoleTag;
