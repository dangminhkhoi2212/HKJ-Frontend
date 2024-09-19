import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import userService from "@/services/user.service";
import { App } from "antd";
export type TEmployees = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  activated: boolean;
  phone: number;
};
export const useEmployeesAction = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<TEmployees[]>([]);
  const { message } = App.useApp();

  const getEmployeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: () => userService.getUsersByRole(),
    onSuccess: (data) => {
      setData(data.data);
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
