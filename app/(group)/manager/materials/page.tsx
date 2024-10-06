"use client";
import { Button, Space, TablePaginationConfig } from "antd";
import { TableProps } from "antd/lib";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueries } from "react-query";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { materialService } from "@/services";
import { Frame } from "@/shared/Frame";
import useAccountStore from "@/stores/account";
import { TMaterial, TMaterialQuery, TQuery } from "@/types";
import { formatUtil, sortUitl } from "@/utils";

import MaterialList from "./ui/MaterialList";

type TSelectMaterial = {
  show: boolean;
  record?: any;
};

const MaterialPage = () => {
  const { account } = useAccountStore();
  const [initMaterialQuery, setInitMaterialQuery] = useState<
    TQuery<TMaterialQuery>
  >({ ...QUERY_CONST.defaultQuery, createdBy: { equals: account?.login } });
  const { router, updatePathname } = useRouterCustom();
  const [query, setQuery] = useState<TQuery<TMaterialQuery>>(initMaterialQuery);
  console.log("🚀 ~ query:", query);

  const [pagination, setPagination] = useState<TablePaginationConfig>(
    QUERY_CONST.initPagination
  );
  const [data, setData] = useState<TMaterial[]>([]);

  const [getMaterialQuery, getMaterialCountQuery] = useQueries([
    {
      queryKey: ["material", { ...query }],
      queryFn: () => materialService.get(query),
      onSuccess: (data: TMaterial[]) => {
        console.log("🚀 ~ useAdminMaterialAction ~ data:", data);
        setData(data);
      },
    },
    {
      queryKey: ["material-count", { ...query }],
      queryFn: () => materialService.getCount(query),
      onSuccess: (data: number) => {
        setPagination((pre) => ({ ...pre, total: data }));
      },
    },
  ]);
  // ##################################################################################

  const columns: TableProps<TMaterial>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên chất liệu",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => sortUitl.sortName(a.name, b.name),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) => sortUitl.sortDate(a.createdDate, b.createdDate),
      render(value, record, index) {
        return formatUtil.formatDate(value);
      },
    },
    {
      title: "Ngày chỉnh sửa",
      dataIndex: "lastModifiedDate",
      sorter: (a, b) => sortUitl.sortDate(a.createdDate, b.createdDate),
      key: "lastModifiedDate",
      render(value, record, index) {
        return formatUtil.formatDate(value);
      },
    },
    {
      title: "Tùy chọn",
      dataIndex: "actions",
      key: "actions",
      // render: (value, record, index) => (
      //   <div className="flex gap-2">
      //     <Button
      //       icon={<Pencil size={18} />}
      //       onClick={() =>
      //         setSelectedPosition({
      //           show: true,
      //           status: FormStatus.UPDATE,
      //           record: record,
      //         })
      //       }
      //     />
      //     <Button
      //       icon={<Trash size={18} />}
      //       danger
      //       type="primary"
      //       onClick={() =>
      //         setSelectedPosition({
      //           show: true,
      //           status: FormStatus.DELETE,
      //           record: record,
      //         })
      //       }
      //     />
      //   </div>
      // ),
    },
  ];
  const refreshData = async () => {
    getMaterialQuery.refetch();
    getMaterialCountQuery.refetch();
    setQuery({ ...initMaterialQuery });
  };
  const handleTableChange: TableProps<TMaterial>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    updatePathname({
      query: { page: pagination.current },
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Frame
      title="Chất liệu làm trang sức"
      buttons={
        <Button
          type="primary"
          onClick={() => router.push(routesManager.addMaterial)}
          icon={<Plus size={18} />}
        >
          Thêm chất liệu
        </Button>
      }
    >
      <Space direction="vertical" className="flex">
        <MaterialList data={data} isLoading={getMaterialQuery.isLoading} />
      </Space>
    </Frame>
  );
};

export default MaterialPage;
