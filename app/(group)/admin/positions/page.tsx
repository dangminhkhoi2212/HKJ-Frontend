"use client";
import {
  TPosition,
  TPositionQuery,
  TSelectedPosition,
} from "@/types/postion.type";
import { formatDate } from "@/utils/format";
import {
  Button,
  Divider,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { Pencil, Plus, RefreshCcw, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddPositionForm from "./ui/AddPositionForm";

import { initPagination } from "@/const/params";
import { useRouterCustom } from "@/hooks/router.hook";
import positionService from "@/services/position.service";
import InputSearchCustom from "@/shared/InputSearchCustom";
import { FormStatus } from "@/types/form.type";
import { sortDate, sortName } from "@/utils/sorter";
import cleanDeep from "clean-deep";
import { useQueries } from "react-query";
import DeletePositionForm from "./ui/DeletePositionForm";
export const initPositionQuery: TPositionQuery = {
  "name.contains": undefined,
  sort: "lastModifiedDate,desc",
  page: 0,
  size: 5,
};

const PostiionsPage: React.FC = () => {
  const { updatePathname, pathname, router, searchParams } = useRouterCustom();
  const [selectedPosition, setSelectedPosition] = useState<TSelectedPosition>({
    show: false,
    status: FormStatus.ADD,
    record: {} as TPosition,
  });
  const [query, setQuery] = useState<TPositionQuery>(initPositionQuery);
  console.log("🚀 ~ query:", query);

  const [pagination, setPagination] =
    useState<TablePaginationConfig>(initPagination);
  const [data, setData] = useState<TPosition[]>([]);

  console.log("🚀 ~ pagination:", pagination);
  const [getPositionsQuery, getPositionsCountQuery] = useQueries([
    {
      queryKey: ["positions", { ...query }],
      queryFn: () => positionService.get(query),
      onSuccess: (data: TPosition[]) => {
        console.log("🚀 ~ useAdminPositionsAction ~ data:", data);
        setData(data);
      },
      onError: (error: any) => {
        console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
      },
    },
    {
      queryKey: ["positions-count", { ...query }],
      queryFn: () => positionService.getCount(query),
      onSuccess: (data: number) => {
        setPagination((pre) => ({ ...pre, total: data }));
      },
      onError: (error: any) => {
        console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
      },
    },
  ]);
  const refreshPositionsData = async () => {
    getPositionsQuery.refetch();
    getPositionsCountQuery.refetch();
  };

  //get first data
  useEffect(() => {
    refreshPositionsData();
  }, []);

  const resetFilter = () => {
    updatePathname({
      query: {},
    });
  };

  const handleSearch = (value: string) => {
    updatePathname({
      query: { textSearch: value, page: 0 },
    });
  };

  useEffect(() => {
    const page: number = Math.max(
      Number.parseInt(searchParams.get("page")! ?? initPagination.current) - 1,
      0
    );
    const pageSize: number | undefined =
      Number.parseInt(searchParams.get("size")!) ?? initPagination.pageSize;
    const textSearch: string = searchParams.get("textSearch") ?? "";

    setQuery((pre) =>
      cleanDeep({
        ...pre,
        page,
        size: pageSize,
        "name.contains": textSearch,
      })
    );
    setPagination(
      (pre) =>
        ({
          ...pre,
          pageSize: pageSize || pre.pageSize,
          current: page + 1,
        } as TablePaginationConfig)
    );
  }, [searchParams, pathname, router]);
  const handleTableChange: TableProps<TPosition>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    updatePathname({
      query: { page: pagination.current },
    });
  };
  // ##################################################################################

  const columns: TableProps<TPosition>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Vị trí",
      dataIndex: "name",
      sorter: (a, b) => sortName(a.name, b.name),

      key: "name",
    },
    {
      title: "Tạo bởi",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) => sortDate(a.createdDate, b.createdDate),
      render(value, record, index) {
        return formatDate(value);
      },
    },
    {
      title: "Ngày chỉnh sửa",
      dataIndex: "lastModifiedDate",
      sorter: (a, b) => sortDate(a.createdDate, b.createdDate),
      key: "lastModifiedDate",
      render(value, record, index) {
        return formatDate(value);
      },
    },
    {
      title: "Tùy chọn",
      dataIndex: "actions",
      key: "actions",
      render: (value, record, index) => (
        <div className="flex gap-2">
          <Button
            icon={<Pencil size={18} />}
            onClick={() =>
              setSelectedPosition({
                show: true,
                status: FormStatus.UPDATE,
                record: record,
              })
            }
          />
          <Button
            icon={<Trash size={18} />}
            danger
            type="primary"
            onClick={() =>
              setSelectedPosition({
                show: true,
                status: FormStatus.DELETE,
                record: record,
              })
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="m-5">
      <Modal
        width={400}
        title={
          selectedPosition.status === FormStatus.UPDATE
            ? "Cập nhật vị trí làm việc"
            : "Thêm vị trí làm việc"
        }
        open={
          selectedPosition.show &&
          (selectedPosition.status === FormStatus.ADD ||
            selectedPosition.status === FormStatus.UPDATE)
        }
        onCancel={() => setSelectedPosition({ show: false })}
        footer={null}
      >
        <AddPositionForm
          data={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          refreshPositionsData={refreshPositionsData}
        />
      </Modal>

      <Modal
        title="Xóa vị trí"
        open={
          selectedPosition.show && selectedPosition.status === FormStatus.DELETE
        }
        okType="danger"
        onCancel={() => setSelectedPosition({ show: false })}
        footer={null}
      >
        <DeletePositionForm
          data={selectedPosition.record}
          refreshPositionsData={refreshPositionsData}
          setSelectedPosition={setSelectedPosition}
        />
      </Modal>
      <div className="flex gap-2 justify-start">
        <Button icon={<RefreshCcw size={18} />} onClick={() => resetFilter()}>
          Làm mới
        </Button>
        <Button
          icon={<Plus />}
          type="primary"
          onClick={() =>
            setSelectedPosition({
              show: true,
              status: FormStatus.ADD,
              record: {} as TPosition,
            })
          }
        >
          Tạo vị trí làm việc mới
        </Button>
        <InputSearchCustom handleSearch={handleSearch} />
      </div>
      <Divider />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={{
          style: {},
          className: "absolute inset-0",
          spinning: getPositionsQuery.isFetching,
        }}
        pagination={pagination}
        onChange={handleTableChange}
        sticky={{ offsetHeader: 0 }}
      />
    </div>
  );
};

export default PostiionsPage;
