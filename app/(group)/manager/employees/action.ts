import { App } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import userService from "@/services/userService";
import { TAccountInfo } from "@/stores";

export const useEmployeesAction = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<TAccountInfo[]>([]);
  const { message } = App.useApp();

  const getEmployeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: () => userService.getUsersByRole(),
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      message.error("Có lỗi xảy ra khi lấy thông tin nhân viên");
    },
  });

  useEffect(() => {
    getEmployeesQuery.refetch();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return {
    data,
    isLoading: getEmployeesQuery.isLoading,
    selectedRowKeys,
    onSelectChange,
    refreshEmployees: getEmployeesQuery.refetch,
  };
};
